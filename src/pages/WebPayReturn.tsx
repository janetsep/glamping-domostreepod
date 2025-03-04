
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentSuccess from '@/components/webpay/PaymentSuccess';
import PaymentError from '@/components/webpay/PaymentError';
import PaymentProcessing from '@/components/webpay/PaymentProcessing';
import { TransactionResult, updateReservationIfNeeded } from '@/services/webPayService';
import { useMutateReservationStatus } from '@/hooks/reservations/useReservationUpdate';
import { toast } from 'sonner';

const WebPayReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [isPackage, setIsPackage] = useState(false);

  // Custom hook to update reservation status
  const { updateReservation } = useMutateReservationStatus();

  useEffect(() => {
    const confirmTransaction = async () => {
      try {
        // Extract token_ws from URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token_ws');
        
        if (!token) {
          throw new Error('No se encontró el token de la transacción');
        }

        // Determine if this is a package unit from localStorage
        const isPackageUnit = localStorage.getItem('is_package_unit') === 'true';
        setIsPackage(isPackageUnit);
        
        // Get the reservation ID if available
        const storedReservationId = localStorage.getItem('current_reservation_id');
        if (storedReservationId) {
          setReservationId(storedReservationId);
          console.log(`Recuperado ID de reserva desde localStorage: ${storedReservationId}`);
        }

        // Get client information from localStorage if available
        const clientName = localStorage.getItem('client_name');
        const clientEmail = localStorage.getItem('client_email');
        const clientPhone = localStorage.getItem('client_phone');
        
        console.log(`Información del cliente recuperada desde localStorage: ${clientName}, ${clientEmail}, ${clientPhone}`);

        // Call Supabase edge function to confirm payment
        const response = await fetch('https://gtxjfmvnzrsuaxryffnt.supabase.co/functions/v1/webpay-confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8`
          },
          body: JSON.stringify({
            token_ws: token,
            is_package_unit: isPackageUnit,
            reservation_id: storedReservationId,
            client_info: {
              name: clientName,
              email: clientEmail,
              phone: clientPhone
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error en la respuesta del servidor:', errorData);
          throw new Error(`Error en la confirmación: ${errorData}`);
        }

        const data = await response.json();
        console.log('Transacción confirmada:', data);
        
        // If the response contains a reservation_id, use it
        if (data.reservation_id && !reservationId) {
          setReservationId(data.reservation_id);
          localStorage.setItem('current_reservation_id', data.reservation_id);
        }
        
        // Store the result
        setTransactionResult(data);
        
        // Actualizar explícitamente el estado de la reserva si el pago fue exitoso
        if (data.response_code === 0 && data.reservation_id) {
          console.log(`Actualizando explícitamente el estado de la reserva ${data.reservation_id} a confirmed`);
          
          try {
            const success = await updateReservation(data.reservation_id, 'confirmed', data);
            if (success) {
              console.log('Estado de reserva actualizado correctamente a confirmed');
            } else {
              console.error('No se pudo actualizar el estado de la reserva');
            }
          } catch (updateError) {
            console.error('Error al actualizar el estado de la reserva:', updateError);
          }
          
          // También intentar actualizar a través del servicio
          const unitId = await updateReservationIfNeeded(data);
          console.log(`Resultado de updateReservationIfNeeded: ${unitId || 'sin resultado'}`);
        }
        
        // Auto-redirect to detail page after a few seconds
        setTimeout(() => {
          // Get product/unit ID from localStorage
          const unitId = localStorage.getItem('current_unit_id');
          
          if (unitId) {
            if (data.response_code === 0) {
              // If payment was successful, navigate to the detail page with query param
              toast.success("Pago completado con éxito", {
                description: "Tu reserva ha sido confirmada correctamente",
              });
              navigate(`/unit/${unitId}?payment=success&reservationId=${data.reservation_id || reservationId}`);
            } else {
              // If payment failed, navigate back to the detail page
              toast.error("Pago no completado", {
                description: `Código de respuesta: ${data.response_code}`,
              });
              navigate(`/unit/${unitId}?payment=failed`);
            }
          } else {
            // Fallback to homepage if no unit ID is found
            navigate('/');
          }
        }, 5000);
        
      } catch (error) {
        console.error('Error al confirmar transacción:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
        
        // Notify the user about the error
        toast.error("Error en la transacción", {
          description: error instanceof Error ? error.message : 'Ha ocurrido un error al procesar el pago',
        });
        
        // Redirect to homepage after error
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    };

    confirmTransaction();
  }, [location.search, navigate, updateReservation]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
          <PaymentProcessing />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
          <PaymentError errorMessage={error} />
        </div>
      </div>
    );
  }

  // Success state
  if (transactionResult) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
          {transactionResult.response_code === 0 ? (
            <PaymentSuccess transaction={transactionResult} />
          ) : (
            <PaymentError errorMessage={`Error en el pago: Código ${transactionResult.response_code}`} />
          )}
        </div>
      </div>
    );
  }

  // Should never reach here
  return null;
};

export default WebPayReturn;

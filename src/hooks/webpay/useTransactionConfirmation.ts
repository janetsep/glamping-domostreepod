
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TransactionResult, confirmTransaction, updateReservationIfNeeded } from '@/services/webpay';
import { useMutateReservationStatus } from '@/hooks/reservations/useReservationUpdate';
import { toast } from 'sonner';

export const useTransactionConfirmation = () => {
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
    const processTransaction = async () => {
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

        // Call Supabase edge function to confirm payment with improved error handling
        try {
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

          // Enhanced error handling for non-200 responses
          if (!response.ok) {
            let errorMessage = 'Error en la confirmación';
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || `Error HTTP: ${response.status}`;
              console.error('Error detallado en la respuesta del servidor:', errorData);
              
              // Specific handling for "Transaction already locked" error
              if (errorMessage.includes("Transaction already locked")) {
                console.log("Transacción ya está bloqueada por otro proceso, intentando obtener estado actual");
                
                // Si la transacción ya fue confirmada, podemos considerar el pago como exitoso
                // Intentar obtener la reserva directamente si tenemos el ID
                if (storedReservationId) {
                  toast.info("La transacción ya está siendo procesada", {
                    description: "Estamos verificando el estado del pago, por favor espera un momento...",
                  });
                  
                  setTimeout(() => {
                    redirectToDetailPage({
                      reservation_id: storedReservationId,
                      response_code: 0 // Asumimos que es exitoso para redirigir al usuario
                    });
                  }, 3000);
                  
                  return;
                }
              }
            } catch (jsonError) {
              const errorText = await response.text();
              errorMessage = `Error HTTP ${response.status}: ${errorText || 'Sin detalle'}`;
              console.error('Error en texto plano:', errorText);
            }
            throw new Error(errorMessage);
          }

          // Process successful response
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
                console.warn('No se pudo actualizar el estado de la reserva con updateReservation');
                
                // Intento alternativo directo a la base de datos
                try {
                  const alternativeUpdateResult = await updateReservationIfNeeded(data);
                  console.log(`Resultado de updateReservationIfNeeded: ${alternativeUpdateResult || 'sin resultado'}`);
                } catch (alternativeError) {
                  console.error('Error en updateReservationIfNeeded:', alternativeError);
                }
              }
            } catch (updateError) {
              console.error('Error al actualizar el estado de la reserva:', updateError);
            }
          }
          
          // Auto-redirect to detail page after a few seconds
          setTimeout(() => {
            redirectToDetailPage(data);
          }, 5000);
        } catch (confirmError) {
          throw confirmError;
        }
      } catch (err) {
        console.error('Error al confirmar transacción:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        
        // Notify the user about the error
        toast.error("Error en la transacción", {
          description: err instanceof Error ? err.message : 'Ha ocurrido un error al procesar el pago',
        });
        
        // Redirect to homepage after error
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    };

    const redirectToDetailPage = (data: TransactionResult) => {
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
    };

    processTransaction();
  }, [location.search, navigate, updateReservation]);

  return {
    isLoading,
    transactionResult,
    error
  };
};


import { useTransactionConfirmation } from '@/hooks/webpay/useTransactionConfirmation';
import TransactionStatus from '@/components/webpay/TransactionStatus';
import { ClientInformationForm } from '@/pages/UnitDetail/ClientInformationForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutateReservationStatus } from '@/hooks/reservations/useReservationUpdate';
import { toast } from 'sonner';

const WebPayReturn = () => {
  const { isLoading, transactionResult, error } = useTransactionConfirmation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveClientInformation } = useMutateReservationStatus();
  const [clientInfoSubmitted, setClientInfoSubmitted] = useState(false);

  // Handle client information submission
  const handleClientInfoSubmit = async (clientInfo: { name: string; email: string; phone: string }) => {
    if (!transactionResult || !transactionResult.reservation_id) {
      toast.error("Error", {
        description: "No se encontró el ID de la reserva",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Store client info in localStorage for future use
      localStorage.setItem('client_name', clientInfo.name);
      localStorage.setItem('client_email', clientInfo.email);
      localStorage.setItem('client_phone', clientInfo.phone);
      
      // Save the client information in the reservation
      const success = await saveClientInformation(transactionResult.reservation_id, clientInfo);
      
      if (success) {
        setClientInfoSubmitted(true);
        toast.success("Información guardada", {
          description: "¡Gracias! Hemos registrado tus datos y los hemos asociado a tu reserva.",
        });
        
        // Navigate to unit detail page after successful submission
        setTimeout(() => {
          const unitId = localStorage.getItem('current_unit_id');
          if (unitId && transactionResult.reservation_id) {
            navigate(`/units/${unitId}?payment=success&reservationId=${transactionResult.reservation_id}`);
          }
        }, 3000);
      } else {
        throw new Error("Error al guardar información del cliente");
      }
    } catch (error) {
      console.error('Error guardando información del cliente:', error);
      toast.error("Error", {
        description: "No se pudo guardar la información del cliente. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
        <TransactionStatus 
          isLoading={isLoading} 
          error={error} 
          transactionResult={transactionResult} 
        />
        
        {!isLoading && transactionResult && transactionResult.response_code === 0 && !clientInfoSubmitted && (
          <div className="mt-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm">
                Tu pago ha sido procesado correctamente. Para completar tu reserva, confirma tus datos de contacto.
                Esta información quedará directamente asociada con tu reserva.
              </p>
            </div>
            <ClientInformationForm 
              onSubmit={handleClientInfoSubmit}
              isSubmitting={isSubmitting}
              initialValues={{
                name: localStorage.getItem('client_name') || '',
                email: localStorage.getItem('client_email') || '',
                phone: localStorage.getItem('client_phone') || ''
              }}
            />
          </div>
        )}
        
        {clientInfoSubmitted && (
          <div className="mt-6 text-center">
            <p className="text-green-600 font-medium">
              ¡Información guardada correctamente!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Serás redirigido a los detalles de tu reserva en unos momentos...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebPayReturn;

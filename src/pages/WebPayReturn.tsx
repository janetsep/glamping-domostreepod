
import { useTransactionConfirmation } from '@/hooks/webpay/useTransactionConfirmation';
import TransactionStatus from '@/components/webpay/TransactionStatus';
import { ClientInformationForm } from '@/pages/UnitDetail/ClientInformationForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutateReservationStatus } from '@/hooks/reservations/useReservationUpdate';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ReservationDetails } from '@/components/unit-detail/ReservationDetails';
import { Button } from '@/components/ui/button'; // Add Button import

const WebPayReturn = () => {
  const { isLoading, transactionResult, error } = useTransactionConfirmation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { saveClientInformation } = useMutateReservationStatus();
  const [clientInfoSubmitted, setClientInfoSubmitted] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    name: localStorage.getItem('client_name') || '',
    email: localStorage.getItem('client_email') || '',
    phone: localStorage.getItem('client_phone') || ''
  });
  
  // Función para enviar el correo con los detalles de la reserva
  const handleSendEmail = async () => {
    if (!transactionResult || !transactionResult.reservation_id) {
      toast.error("Error", {
        description: "No se encontró el ID de la reserva para enviar el correo",
      });
      return;
    }
    
    if (!clientInfo.email) {
      toast.error("Error", {
        description: "No se encontró un correo electrónico para enviar los detalles",
      });
      return;
    }
    
    setIsEmailSending(true);
    
    try {
      const response = await fetch('https://gtxjfmvnzrsuaxryffnt.supabase.co/functions/v1/send-reservation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: clientInfo.email,
          phone: clientInfo.phone,
          name: clientInfo.name,
          reservationId: transactionResult.reservation_id
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error al enviar el correo: ${response.status}`);
      }
      
      setEmailSent(true);
      toast.success("Correo enviado", {
        description: "Hemos enviado los detalles de tu reserva a tu correo electrónico.",
      });
    } catch (error) {
      console.error('Error enviando correo:', error);
      toast.error("Error", {
        description: "No se pudo enviar el correo. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  // Handle client information submission
  const handleClientInfoSubmit = async (clientInfo: { name: string; email: string; phone: string }) => {
    if (!transactionResult || !transactionResult.reservation_id) {
      toast.error("Error", {
        description: "No se encontró el ID de la reserva",
      });
      return;
    }

    setIsSubmitting(true);
    setClientInfo(clientInfo);
    
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

  // Función para volver a la página de detalle de unidad
  const handleBackToUnit = () => {
    const unitId = localStorage.getItem('current_unit_id');
    if (unitId && transactionResult?.reservation_id) {
      navigate(`/units/${unitId}?payment=success&reservationId=${transactionResult.reservation_id}`);
    } else {
      navigate('/');
    }
  };

  // Preparar el objeto quote para ReservationDetails
  const getQuoteFromTransaction = () => {
    if (!transactionResult) return null;
    
    return {
      nights: 0, // Esto debería calcularse a partir de check_in y check_out si están disponibles
      basePrice: transactionResult.amount || 0,
      activitiesTotal: 0, // Esto debería extraerse de los detalles de la reserva si están disponibles
      packagesTotal: 0, // Esto debería extraerse de los detalles de la reserva si están disponibles
      totalPrice: transactionResult.amount || 0,
      selectedActivities: transactionResult.reservation_data?.selected_activities || [],
      selectedPackages: transactionResult.reservation_data?.selected_packages || []
    };
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
        <TransactionStatus 
          isLoading={isLoading} 
          error={error} 
          transactionResult={transactionResult} 
        />
        
        {!isLoading && transactionResult && transactionResult.response_code === 0 && (
          <div className="mt-8">
            {!clientInfoSubmitted ? (
              <>
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800 text-sm">
                    Tu pago ha sido procesado correctamente. Para completar tu reserva, confirma tus datos de contacto.
                    Esta información quedará directamente asociada con tu reserva.
                  </p>
                </div>
                <ClientInformationForm 
                  onSubmit={handleClientInfoSubmit}
                  isSubmitting={isSubmitting}
                  initialValues={clientInfo}
                />
              </>
            ) : (
              <div className="space-y-6">
                <div className="mt-6 text-center">
                  <p className="text-green-600 font-medium mb-4">
                    ¡Información guardada correctamente!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Button 
                      onClick={handleSendEmail} 
                      variant="default"
                      disabled={isEmailSending || emailSent}
                      className="w-full sm:w-auto"
                    >
                      {isEmailSending ? 'Enviando...' : 
                       emailSent ? '✓ Enviado correctamente' : 
                       'Enviar detalles a mi correo'}
                    </Button>
                    
                    <Button 
                      onClick={handleBackToUnit} 
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Ver detalles de mi reserva
                    </Button>
                  </div>
                </div>
                
                {transactionResult.reservation_id && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Detalles completos de tu reserva</h3>
                    <ReservationDetails
                      startDate={transactionResult.reservation_data?.check_in ? new Date(transactionResult.reservation_data.check_in) : undefined}
                      endDate={transactionResult.reservation_data?.check_out ? new Date(transactionResult.reservation_data.check_out) : undefined}
                      guests={transactionResult.reservation_data?.guests}
                      quote={getQuoteFromTransaction()}
                      paymentDetails={transactionResult}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebPayReturn;

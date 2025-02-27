
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const WebPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      const token = searchParams.get('token_ws');
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Error en el pago",
          description: "No se recibió el token de la transacción."
        });
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        // Confirmamos la transacción con WebPay
        const confirmResponse = await fetch('https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/' + token, {
          method: 'PUT',
          headers: {
            'Tbk-Api-Key-Id': '597055555532',
            'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
          }
        });

        if (!confirmResponse.ok) {
          throw new Error('Error al confirmar transacción');
        }

        const transactionResult = await confirmResponse.json();
        console.log('Resultado de la transacción:', transactionResult);

        // Buscamos la reserva por el buy_order
        const buyOrder = transactionResult.buy_order;
        const reservationId = buyOrder.replace('BO-', '');

        // Actualizamos el estado de la reserva
        const { error: updateError } = await supabase
          .from('reservations')
          .update({
            status: transactionResult.response_code === 0 ? 'confirmed' : 'failed',
            payment_details: {
              ...transactionResult,
              confirmation_date: new Date().toISOString()
            }
          })
          .eq('id', reservationId);

        if (updateError) {
          console.error('Error al actualizar reserva:', updateError);
          throw updateError;
        }

        if (transactionResult.response_code === 0) {
          toast({
            title: "¡Pago exitoso!",
            description: `Tu reserva ha sido confirmada. Código de autorización: ${transactionResult.authorization_code}`
          });
        } else {
          toast({
            variant: "destructive",
            title: "Pago rechazado",
            description: "La transacción no pudo ser completada. Por favor, intenta nuevamente."
          });
        }

        // Redirigimos al usuario a la página de detalle de la unidad
        setTimeout(() => {
          navigate(`/unit/${reservationId}`);
        }, 3000);

      } catch (error) {
        console.error('Error al procesar pago:', error);
        toast({
          variant: "destructive",
          title: "Error en el proceso",
          description: "No se pudo completar el proceso de pago. Por favor, contacta a soporte."
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4 text-center">
        {isProcessing ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold">Procesando pago...</h2>
            <p>Por favor, no cierres esta ventana.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold">Redirigiendo...</h2>
            <p>Serás redirigido en unos momentos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebPayReturn;

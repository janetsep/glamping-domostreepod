
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const SUPABASE_URL = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

const WebPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      const token_ws = searchParams.get('token_ws');
      
      if (!token_ws) {
        toast({
          variant: "destructive",
          title: "Error en el pago",
          description: "No se recibió el token de la transacción."
        });
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        // Llamar a nuestra Edge Function para confirmar la transacción
        const confirmResponse = await fetch(`${SUPABASE_URL}/functions/v1/webpay-confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ token_ws })
        });

        if (!confirmResponse.ok) {
          const errorData = await confirmResponse.json();
          throw new Error(errorData.error || 'Error al confirmar la transacción');
        }

        const transactionResult = await confirmResponse.json();
        console.log('Resultado de la transacción:', transactionResult);

        // Procesar el resultado
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

        // Redirigir al usuario (usando ID de unidad extraído del buy_order)
        const buyOrder = transactionResult.buy_order;
        const reservationId = buyOrder.replace('BO-', '');
        
        // Obtener la unidad asociada a la reserva
        const { data: reservation } = await supabase
          .from('reservations')
          .select('unit_id')
          .eq('id', reservationId)
          .single();
          
        setTimeout(() => {
          if (reservation?.unit_id) {
            navigate(`/unit/${reservation.unit_id}`);
          } else {
            navigate('/');
          }
        }, 3000);

      } catch (error) {
        console.error('Error al procesar pago:', error);
        toast({
          variant: "destructive",
          title: "Error en el proceso",
          description: "No se pudo completar el proceso de pago. Por favor, contacta a soporte."
        });
        setTimeout(() => navigate('/'), 3000);
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

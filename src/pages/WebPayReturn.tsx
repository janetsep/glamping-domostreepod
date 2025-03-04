
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';

const SUPABASE_URL = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

const WebPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  useEffect(() => {
    const processPayment = async () => {
      const token_ws = searchParams.get('token_ws');
      const tbk_token = searchParams.get('TBK_TOKEN');
      const tbk_orden_compra = searchParams.get('TBK_ORDEN_COMPRA');
      const tbk_id_sesion = searchParams.get('TBK_ID_SESION');
      
      console.log("Parámetros de retorno de WebPay:", {
        token_ws,
        tbk_token,
        tbk_orden_compra,
        tbk_id_sesion
      });
      
      // WebPay puede redirigir con TBK_ parámetros cuando hay un rechazo
      if (tbk_token) {
        console.error('Transacción rechazada por WebPay:', { tbk_token, tbk_orden_compra, tbk_id_sesion });
        setError('La transacción fue rechazada por el banco. Por favor, intenta con otro método de pago.');
        toast({
          variant: "destructive",
          title: "Pago rechazado",
          description: "La transacción fue rechazada por el banco. Por favor, intenta con otro método de pago."
        });
        sonnerToast.error("Pago rechazado", {
          description: "La transacción fue rechazada por el banco."
        });
        setTimeout(() => navigate('/'), 5000);
        setIsProcessing(false);
        return;
      }
      
      if (!token_ws) {
        setError('No se recibió el token de la transacción.');
        toast({
          variant: "destructive",
          title: "Error en el pago",
          description: "No se recibió el token de la transacción."
        });
        sonnerToast.error("Error en el pago", {
          description: "No se recibió información de la transacción."
        });
        setTimeout(() => navigate('/'), 5000);
        setIsProcessing(false);
        return;
      }

      try {
        console.log(`Procesando confirmación de pago con token: ${token_ws}`);
        
        // Primero guardar el token en la reserva más reciente para facilitar la búsqueda
        try {
          const { data: latestReservation } = await supabase
            .from('reservations')
            .select('id')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (latestReservation) {
            console.log(`Guardando token ${token_ws} en reserva ${latestReservation.id}`);
            await supabase
              .from('reservations')
              .update({ 
                payment_details: { token: token_ws, updated_at: new Date().toISOString() }
              })
              .eq('id', latestReservation.id);
          }
        } catch (e) {
          console.error('Error al pre-guardar token en reserva:', e);
        }
        
        // Llamar a nuestra Edge Function para confirmar la transacción
        const confirmResponse = await fetch(`${SUPABASE_URL}/functions/v1/webpay-confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ token_ws })
        });

        const responseText = await confirmResponse.text();
        console.log('Respuesta de confirmación (texto):', responseText);
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          console.error('Error al parsear la respuesta JSON:', e);
          throw new Error(`Error al parsear la respuesta: ${responseText}`);
        }
        
        console.log('Respuesta de confirmación (objeto):', responseData);

        if (!confirmResponse.ok) {
          throw new Error(responseData.error || 'Error al confirmar la transacción');
        }

        setTransactionResult(responseData);
        console.log('Resultado de la transacción:', responseData);

        // Procesar el resultado
        if (responseData.response_code === 0) {
          toast({
            title: "¡Pago exitoso!",
            description: `Tu reserva ha sido confirmada. Código de autorización: ${responseData.authorization_code}`
          });
          sonnerToast.success("¡Pago exitoso!", {
            description: "Tu reserva ha sido confirmada."
          });
          
          // Asegurarse de actualizar la reserva a confirmed si no lo hizo la Edge Function
          if (responseData.reservation_id) {
            // Verificar estado actual
            const { data: reservation } = await supabase
              .from('reservations')
              .select('status, unit_id')
              .eq('id', responseData.reservation_id)
              .single();
              
            if (reservation && reservation.status !== 'confirmed') {
              console.log(`Actualizando estado de reserva ${responseData.reservation_id} a confirmed`);
              await supabase
                .from('reservations')
                .update({ 
                  status: 'confirmed',
                  payment_details: responseData
                })
                .eq('id', responseData.reservation_id);
            }
            
            // Redirigir al usuario a la página de la unidad
            setTimeout(() => {
              navigate(`/unit/${reservation?.unit_id}`);
            }, 3000);
          } else {
            // Buscar alguna reserva por buy_order
            if (responseData.buy_order) {
              const { data: reservations } = await supabase
                .from('reservations')
                .select('id, unit_id, status')
                .eq('status', 'pending');
              
              if (reservations && reservations.length > 0) {
                // Actualizar la reserva más reciente
                const latestReservation = reservations[0];
                await supabase
                  .from('reservations')
                  .update({ 
                    status: 'confirmed',
                    payment_details: responseData
                  })
                  .eq('id', latestReservation.id);
                  
                setTimeout(() => {
                  navigate(`/unit/${latestReservation.unit_id}`);
                }, 3000);
              } else {
                setTimeout(() => navigate('/'), 5000);
              }
            } else {
              setTimeout(() => navigate('/'), 5000);
            }
          }
        } else {
          setError(`Pago rechazado. Código: ${responseData.response_code}`);
          toast({
            variant: "destructive",
            title: "Pago rechazado",
            description: `La transacción no pudo ser completada (código ${responseData.response_code}). Por favor, intenta nuevamente.`
          });
          sonnerToast.error("Pago rechazado", {
            description: `Código de respuesta: ${responseData.response_code}`
          });
          setTimeout(() => navigate('/'), 5000);
        }

      } catch (error) {
        console.error('Error al procesar pago:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
        toast({
          variant: "destructive",
          title: "Error en el proceso",
          description: "No se pudo completar el proceso de pago. Por favor, contacta a soporte."
        });
        sonnerToast.error("Error en el proceso de pago", {
          description: "Por favor, contacta a soporte."
        });
        setTimeout(() => navigate('/'), 5000);
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
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-red-600">Error en el pago</h2>
            <p>{error}</p>
            <p className="text-sm text-muted-foreground">Serás redirigido en unos momentos...</p>
          </div>
        ) : transactionResult?.response_code === 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-green-600">¡Pago exitoso!</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <p><span className="font-semibold">Estado:</span> Aprobado</p>
              <p><span className="font-semibold">Código de autorización:</span> {transactionResult.authorization_code}</p>
              <p><span className="font-semibold">Tarjeta:</span> {transactionResult.card_detail?.card_number || "No disponible"}</p>
              <p><span className="font-semibold">Monto:</span> ${transactionResult.amount?.toLocaleString()}</p>
            </div>
            <p className="text-sm text-muted-foreground">Serás redirigido a los detalles de tu reserva en unos momentos...</p>
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

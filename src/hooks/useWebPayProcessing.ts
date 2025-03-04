
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { saveTokenToReservation, confirmTransaction, updateReservationIfNeeded, TransactionResult } from '@/services/webPayService';

export interface WebPayProcessingState {
  isProcessing: boolean;
  error: string | null;
  transactionResult: TransactionResult | null;
}

export function useWebPayProcessing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<WebPayProcessingState>({
    isProcessing: true,
    error: null,
    transactionResult: null
  });

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
        setState({
          isProcessing: false,
          error: 'La transacción fue rechazada por el banco. Por favor, intenta con otro método de pago.',
          transactionResult: null
        });
        
        toast({
          variant: "destructive",
          title: "Pago rechazado",
          description: "La transacción fue rechazada por el banco. Por favor, intenta con otro método de pago."
        });
        
        sonnerToast.error("Pago rechazado", {
          description: "La transacción fue rechazada por el banco."
        });
        
        setTimeout(() => navigate('/'), 5000);
        return;
      }
      
      if (!token_ws) {
        setState({
          isProcessing: false,
          error: 'No se recibió el token de la transacción.',
          transactionResult: null
        });
        
        toast({
          variant: "destructive",
          title: "Error en el pago",
          description: "No se recibió el token de la transacción."
        });
        
        sonnerToast.error("Error en el pago", {
          description: "No se recibió información de la transacción."
        });
        
        setTimeout(() => navigate('/'), 5000);
        return;
      }

      try {
        console.log(`Procesando confirmación de pago con token: ${token_ws}`);
        
        // Guardar el token en la reserva más reciente
        await saveTokenToReservation(token_ws);
        
        // Confirmar la transacción
        const responseData = await confirmTransaction(token_ws);
        
        setState({
          isProcessing: false,
          error: null,
          transactionResult: responseData
        });
        
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
          
          // Actualizar la reserva y obtener unit_id para la redirección
          const unitId = await updateReservationIfNeeded(responseData);
          
          // Redirigir al usuario a la página de la unidad
          if (unitId) {
            setTimeout(() => {
              navigate(`/unit/${unitId}`);
            }, 3000);
          } else {
            setTimeout(() => navigate('/'), 5000);
          }
        } else {
          setState(prev => ({
            ...prev,
            error: `Pago rechazado. Código: ${responseData.response_code}`
          }));
          
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
        
        setState({
          isProcessing: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
          transactionResult: null
        });
        
        toast({
          variant: "destructive",
          title: "Error en el proceso",
          description: "No se pudo completar el proceso de pago. Por favor, contacta a soporte."
        });
        
        sonnerToast.error("Error en el proceso de pago", {
          description: "Por favor, contacta a soporte."
        });
        
        setTimeout(() => navigate('/'), 5000);
      }
    };

    processPayment();
  }, [searchParams, navigate, toast]);

  return state;
}

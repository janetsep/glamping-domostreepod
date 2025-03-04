
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const SUPABASE_URL = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

interface UsePaymentProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const usePayment = ({ setIsLoading }: UsePaymentProps) => {
  const redirectToWebpay = useCallback(async (reservationId: string, amount: number) => {
    console.log(`Iniciando proceso WebPay para la reserva ${reservationId} por $${amount}`);
    
    try {
      setIsLoading(true);
      
      const origin = window.location.origin;
      const requestData = {
        reservationId,
        amount,
        origin
      };
      
      const initResponse = await fetch(`${SUPABASE_URL}/functions/v1/webpay-init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(requestData)
      });

      if (!initResponse.ok) {
        const errorText = await initResponse.text();
        console.error(`Error al iniciar WebPay: ${errorText}`);
        return {
          status: 'error',
          message: `Error al iniciar WebPay: ${initResponse.status}`,
          details: errorText
        };
      }

      const responseText = await initResponse.text();
      let transactionData;
      try {
        transactionData = JSON.parse(responseText);
      } catch (e) {
        console.error(`Error al parsear respuesta JSON: ${e.message}`);
        return {
          status: 'error',
          message: 'Error al parsear respuesta',
          details: null
        };
      }

      if (!transactionData.url || !transactionData.token) {
        console.error(`Respuesta incompleta de WebPay: ${JSON.stringify(transactionData)}`);
        return {
          status: 'error',
          message: 'Respuesta incompleta de WebPay',
          details: null
        };
      }

      // Guardar el token en la reserva para poder identificarla después
      if (!transactionData.is_package_unit) {
        try {
          await supabase
            .from('reservations')
            .update({
              payment_details: {
                token: transactionData.token,
                transaction_created: new Date().toISOString()
              }
            })
            .eq('id', reservationId);
            
          console.log(`Token WebPay ${transactionData.token} guardado en reserva ${reservationId}`);
        } catch (e) {
          console.error(`Error al guardar token en reserva: ${e.message}`);
        }
      }

      // Crear y enviar formulario para redirigir a WebPay
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = transactionData.url;
      form.style.display = 'none';
      
      const tokenField = document.createElement('input');
      tokenField.type = 'hidden';
      tokenField.name = 'token_ws';
      tokenField.value = transactionData.token;
      form.appendChild(tokenField);
      
      document.body.appendChild(form);
      setTimeout(() => {
        form.submit();
      }, 10);
      
      return {
        status: 'pending',
        message: 'Redirigiendo a WebPay Plus',
        details: {
          token: transactionData.token,
          url: transactionData.url
        }
      };
    } catch (error) {
      console.error(`Error en el proceso de pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido en el proceso de pago',
        details: null
      };
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  return { redirectToWebpay };
};

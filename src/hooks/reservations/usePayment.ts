
import { useCallback } from 'react';
import { toast } from 'sonner';

const SUPABASE_URL = 'https://gtxjfmvnzrsuaxryffnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8';

interface UsePaymentProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const usePayment = ({ 
  setIsLoading 
}: UsePaymentProps) => {
  const redirectToWebpay = useCallback(async (
    reservationId: string,
    amount: number,
    isPackageUnit: boolean = false,
    unitId: string = ''
  ) => {
    setIsLoading(true);
    
    try {
      console.log(`Inicializando WebPay para reserva ${reservationId} por $${amount}`);
      
      // Store information for later reference
      localStorage.setItem('current_reservation_id', reservationId);
      if (unitId) {
        localStorage.setItem('current_unit_id', unitId);
      }
      localStorage.setItem('is_package_unit', isPackageUnit ? 'true' : 'false');
      
      // Call WebPay initialization
      const response = await fetch(`${SUPABASE_URL}/functions/v1/webpay-init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          reservationId: reservationId,
          amount: amount,
          origin: window.location.origin,
          unit_id: unitId
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en inicialización de WebPay: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('WebPay initialization response:', data);
      
      if (data.url && data.token) {
        // Create the form dynamically
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.url;
        
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'token_ws';
        tokenInput.value = data.token;
        
        form.appendChild(tokenInput);
        document.body.appendChild(form);
        
        // Submit the form to redirect
        form.submit();
      } else {
        throw new Error('Respuesta inválida de WebPay');
      }
    } catch (error) {
      console.error('Error redirecting to WebPay:', error);
      toast.error('Error al procesar el pago', {
        description: 'No se pudo iniciar el proceso de pago. Por favor, inténtalo de nuevo.'
      });
      setIsLoading(false);
    }
  }, [setIsLoading]);
  
  return { redirectToWebpay };
};

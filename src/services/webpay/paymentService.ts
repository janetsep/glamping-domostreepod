
import { getWebPayInitEndpoint, createHeaders, storeReservationInfo, getClientInfoFromStorage } from './utils';
import { toast } from 'sonner';

export function usePayment(setIsLoading: (isLoading: boolean) => void) {
  const redirectToWebpay = async (
    reservationId: string,
    amount: number,
    isPackageUnit: boolean = false,
    unitId: string = ''
  ) => {
    setIsLoading(true);
    
    try {
      console.log(`Inicializando WebPay para reserva ${reservationId} por $${amount}`);
      
      // Store information for later reference
      storeReservationInfo(reservationId, unitId, isPackageUnit);
      
      // Retrieve client information from localStorage
      const clientInfo = getClientInfoFromStorage();
      console.log(`Información del cliente almacenada: ${clientInfo.name}, ${clientInfo.email}, ${clientInfo.phone}`);
      
      // Verify we have a valid amount
      if (!amount || amount <= 0) {
        throw new Error('El monto de la transacción no es válido');
      }

      // Call WebPay initialization
      const response = await fetch(getWebPayInitEndpoint(), {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({
          reservationId: reservationId,
          amount: Math.round(amount), // Ensure we send an integer
          origin: window.location.origin,
          unit_id: unitId,
          client_info: clientInfo
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
  };
  
  return { redirectToWebpay };
}

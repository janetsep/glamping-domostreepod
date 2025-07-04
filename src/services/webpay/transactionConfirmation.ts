import { TransactionResult } from './types';
import { getWebPayConfirmEndpoint, createHeaders, getClientInfoFromStorage } from './utils';

// Service for confirming WebPay transactions
export async function confirmTransaction(token_ws: string): Promise<TransactionResult> {
  console.log(`🔄 Confirmando transacción con token: ${token_ws}`);
  
  try {
    const endpoint = getWebPayConfirmEndpoint();
    console.log(`📍 Endpoint: ${endpoint}`);
    
    // Hacer la petición directamente sin tests previos
    const confirmResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        ...createHeaders(),
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ 
        token_ws,
        is_package_unit: localStorage.getItem('is_package_unit') === 'true',
        reservation_id: localStorage.getItem('current_reservation_id'),
        client_info: getClientInfoFromStorage()
      })
    });

    console.log(`📊 Status: ${confirmResponse.status}`);
    
    // Leer la respuesta completa
    const responseText = await confirmResponse.text();
    console.log('📝 Respuesta completa:', responseText);
    
    // Intentar parsear como JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      
      if (responseText.includes('404') || responseText.includes('Not Found')) {
        throw new Error('La función de pagos no está disponible.');
      } else if (responseText.includes('502') || responseText.includes('Bad Gateway')) {
        throw new Error('Error temporal del servidor de pagos.');
      } else {
        throw new Error(`Respuesta inválida del servidor: ${responseText.substring(0, 100)}`);
      }
    }
    
    console.log('✅ Datos parseados:', responseData);

    if (!confirmResponse.ok) {
      const errorMessage = responseData?.error || `Error HTTP ${confirmResponse.status}`;
      console.error(`❌ Error en confirmación:`, errorMessage);
      throw new Error(errorMessage);
    }

    return responseData;
    
  } catch (error) {
    console.error('❌ Error general en confirmTransaction:', error);
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor de pagos. Verifica tu conexión a internet.');
    }
    
    throw error;
  }
}
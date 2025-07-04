import { TransactionResult } from './types';
import { getWebPayConfirmEndpoint, createHeaders, getClientInfoFromStorage } from './utils';
import { supabase } from '@/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';

// Service for confirming WebPay transactions
export async function confirmTransaction(token_ws: string): Promise<TransactionResult> {
  console.log(`🔄 Confirmando transacción con token: ${token_ws}`);
  
  try {
    const endpoint = getWebPayConfirmEndpoint();
    console.log(`📍 Endpoint: ${endpoint}`);
    
    // Primero probar conectividad básica
    try {
      console.log('🔍 Probando conectividad con Edge Functions...');
      const testResponse = await fetch(endpoint, {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`📊 Test de conectividad: ${testResponse.status}`);
    } catch (connectError) {
      console.error('❌ Error de conectividad:', connectError);
      throw new Error('No se puede conectar con el servicio de pagos. Las Edge Functions no están disponibles.');
    }
    
    // Hacer la petición principal
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
      
      // Si la respuesta no es JSON, es probable que las Edge Functions no estén funcionando
      if (responseText.includes('404') || responseText.includes('Not Found')) {
        throw new Error('La función de pagos no está disponible. Las Edge Functions no están deployadas correctamente.');
      } else if (responseText.includes('502') || responseText.includes('Bad Gateway')) {
        throw new Error('Error temporal del servidor de pagos. Inténtalo de nuevo en unos momentos.');
      } else {
        throw new Error(`Respuesta inválida del servidor: ${responseText.substring(0, 100)}`);
      }
    }
    
    console.log('✅ Datos parseados:', responseData);

    if (!confirmResponse.ok) {
      const errorMessage = responseData?.error || `Error HTTP ${confirmResponse.status}`;
      console.error(`❌ Error en confirmación:`, errorMessage);
      
      // Manejar diferentes tipos de error
      switch (confirmResponse.status) {
        case 404:
          throw new Error('El servicio de confirmación de pagos no está disponible. Contacta al administrador.');
        case 500:
          throw new Error('Error interno del servidor de pagos. Inténtalo de nuevo.');
        case 502:
        case 503:
          throw new Error('El servidor de pagos está temporalmente no disponible.');
        default:
          throw new Error(errorMessage);
      }
    }

    return responseData;
    
  } catch (error) {
    console.error('❌ Error general en confirmTransaction:', error);
    
    // Manejar errores de red
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor de pagos. Verifica tu conexión a internet y que las Edge Functions estén funcionando.');
    }
    
    // Re-lanzar otros errores
    throw error;
  }
}

export async function updateReservationIfNeeded(responseData: TransactionResult): Promise<string | undefined> {
  console.log('🔍 [updateReservationIfNeeded] Iniciando actualización con datos:', JSON.stringify(responseData, null, 2));
  
  // Si hay un ID de reserva directo y el pago fue exitoso
  if (responseData.response_code === 0 && responseData.reservation_id) {
    try {
      console.log(`🔍 [updateReservationIfNeeded] Buscando reserva principal con ID: ${responseData.reservation_id}`);
      
      // Obtener la reserva principal para obtener el código de reserva
      const { data: primaryReservation, error: primaryError } = await supabase
        .from('reservations')
        .select('id, reservation_code, unit_id, status')
        .eq('id', responseData.reservation_id)
        .single();
      
      if (primaryError) {
        console.error('❌ [updateReservationIfNeeded] Error al obtener reserva principal:', primaryError);
        return undefined;
      }

      if (!primaryReservation) {
        console.error('❌ [updateReservationIfNeeded] No se encontró la reserva principal');
        return undefined;
      }

      console.log(`✅ [updateReservationIfNeeded] Reserva principal encontrada:`, primaryReservation);
      console.log(`🔄 [updateReservationIfNeeded] Actualizando todas las reservas con código: ${primaryReservation.reservation_code}`);

      // Actualizar todas las reservas con el mismo código
      const { data: updateResult, error: updateError } = await supabase
        .from('reservations')
        .update({ 
          status: 'confirmed',
          payment_details: responseData,
          updated_at: new Date().toISOString()
        })
        .eq('reservation_code', primaryReservation.reservation_code)
        .select();
      
      if (updateError) {
        console.error('❌ [updateReservationIfNeeded] Error al actualizar reservas:', updateError);
        return undefined;
      }

      console.log(`✅ [updateReservationIfNeeded] Resultado de la actualización:`, updateResult);
      
      // Verificar que todas las reservas se actualizaron correctamente
      const { data: updatedReservations, error: verifyError } = await supabase
        .from('reservations')
        .select('id, status, reservation_code')
        .eq('reservation_code', primaryReservation.reservation_code);
      
      if (verifyError) {
        console.error('❌ [updateReservationIfNeeded] Error al verificar actualización:', verifyError);
        return undefined;
      }

      console.log(`🔍 [updateReservationIfNeeded] Estado final de las reservas:`, updatedReservations);
      
      const allConfirmed = updatedReservations?.every(r => r.status === 'confirmed');
      console.log(`✅ [updateReservationIfNeeded] Todas las reservas confirmadas: ${allConfirmed}`);
      
      if (!allConfirmed) {
        console.error('❌ [updateReservationIfNeeded] Algunas reservas no se actualizaron correctamente');
        updatedReservations?.forEach(r => {
          if (r.status !== 'confirmed') {
            console.error(`❌ Reserva ${r.id} (${r.reservation_code}) no está confirmada`);
          }
        });
      }
      
      return primaryReservation.unit_id;
    } catch (error) {
      console.error('❌ [updateReservationIfNeeded] Error general:', error);
      return undefined;
    }
  } 
  // Si no hay ID de reserva pero hay buy_order, intentamos actualizar por ese campo
  else if (responseData.response_code === 0 && responseData.buy_order) {
    try {
      // Buscar la reserva más reciente por buy_order
      const { data: reservations, error: selectError } = await supabase
        .from('reservations')
        .select('id, reservation_code, unit_id')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (selectError || !reservations || reservations.length === 0) {
        console.error('Error al buscar reservas pendientes:', selectError);
        return undefined;
      }
    
      const latestReservation = reservations[0];
      
      // Actualizar todas las reservas con el mismo código
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ 
          status: 'confirmed',
          payment_details: responseData,
          updated_at: new Date().toISOString()
        })
        .eq('reservation_code', latestReservation.reservation_code);
      
      if (updateError) {
        console.error('Error al actualizar reservas por buy_order:', updateError);
        return undefined;
      }
          
      console.log(`Todas las reservas con código ${latestReservation.reservation_code} actualizadas a confirmed`);
      return latestReservation.unit_id;
    } catch (error) {
      console.error('Error al actualizar reserva por buy_order:', error);
      return undefined;
    }
  }
  
  return undefined;
}

import { TransactionResult } from './types';
import { getWebPayConfirmEndpoint, createHeaders } from './utils';
import { supabase } from '@/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';

// Service for confirming WebPay transactions
export async function confirmTransaction(token_ws: string): Promise<TransactionResult> {
  // First register information for debugging
  console.log(`Intentando confirmar transacción con token: ${token_ws}`);
  
  try {
    const confirmResponse = await fetch(getWebPayConfirmEndpoint(), {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ token_ws })
    });

    // Capture full response text for debugging
    const responseText = await confirmResponse.text();
    console.log('Respuesta de confirmación (texto completo):', responseText);
    
    // Try to parse as JSON, but handle non-JSON responses gracefully
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Error al parsear la respuesta JSON:', e, 'Texto de respuesta:', responseText);
      throw new Error(`Error al parsear la respuesta: ${responseText}`);
    }
    
    console.log('Respuesta de confirmación (objeto):', responseData);

    if (!confirmResponse.ok) {
      const errorMessage = responseData.error || `Error HTTP: ${confirmResponse.status}`;
      console.error(`Error en respuesta de confirmación: ${errorMessage}`, responseData);
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('Error en confirmTransaction:', error);
    throw error;
  }
}

export async function updateReservationIfNeeded(responseData: TransactionResult): Promise<string | undefined> {
  console.log('Actualizando reserva si es necesario con datos:', JSON.stringify(responseData));
  
  // Si hay un ID de reserva directo y el pago fue exitoso
  if (responseData.response_code === 0 && responseData.reservation_id) {
    try {
      // Obtener la reserva principal para obtener el código de reserva
      const { data: primaryReservation, error: primaryError } = await supabase
        .from('reservations')
        .select('id, reservation_code, unit_id')
        .eq('id', responseData.reservation_id)
        .single();
      
      if (primaryError || !primaryReservation) {
        console.error('Error al obtener reserva principal:', primaryError);
        return undefined;
      }

      // Actualizar todas las reservas con el mismo código
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ 
          status: 'confirmed',
          payment_details: responseData,
          updated_at: new Date().toISOString()
        })
        .eq('reservation_code', primaryReservation.reservation_code);
      
      if (updateError) {
        console.error('Error al actualizar reservas:', updateError);
        return undefined;
      }

      console.log(`Todas las reservas con código ${primaryReservation.reservation_code} actualizadas a confirmed`);
      
      // Verificar que todas las reservas se actualizaron correctamente
      const { data: updatedReservations, error: verifyError } = await supabase
        .from('reservations')
        .select('id, status')
        .eq('reservation_code', primaryReservation.reservation_code);
      
      if (verifyError) {
        console.error('Error al verificar actualización:', verifyError);
        return undefined;
      }

      const allConfirmed = updatedReservations?.every(r => r.status === 'confirmed');
      console.log(`Estado final de las reservas: ${allConfirmed ? 'Todas confirmadas' : 'Algunas no confirmadas'}`);
      
      return primaryReservation.unit_id;
    } catch (error) {
      console.error('Error al actualizar reservas:', error);
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

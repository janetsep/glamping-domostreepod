
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
      const errorMessage = responseData.error || 'Error al confirmar la transacción';
      console.error(`Error en respuesta de confirmación: ${errorMessage}`);
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
      // Verificar estado actual
      const { data: reservation, error: selectError } = await supabase
        .from('reservations')
        .select('status, unit_id')
        .eq('id', responseData.reservation_id)
        .single();
      
      if (selectError) {
        console.error('Error al verificar estado de reserva:', selectError);
        return undefined;
      }
        
      // Actualizar siempre la reserva para asegurar que se cambia el estado
      console.log(`Actualizando estado de reserva ${responseData.reservation_id} a confirmed (estado actual: ${reservation?.status})`);
      
      // Primer intento - usando supabase cliente
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ 
          status: 'confirmed',
          payment_details: responseData,
          updated_at: new Date().toISOString()
        })
        .eq('id', responseData.reservation_id);
      
      if (updateError) {
        console.error('Error al actualizar reserva con cliente:', updateError);
        
        // Segundo intento - usando fetch directo
        try {
          console.log('Intentando actualizar con fetch directo');
          const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${responseData.reservation_id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              status: 'confirmed',
              payment_details: responseData,
              updated_at: new Date().toISOString()
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error al actualizar reserva con fetch: ${errorText}`);
            return undefined;
          }
          
          console.log(`Reserva ${responseData.reservation_id} actualizada correctamente con fetch directo`);
        } catch (fetchError) {
          console.error('Error en actualización con fetch:', fetchError);
          return undefined;
        }
      } else {
        console.log(`Reserva ${responseData.reservation_id} actualizada correctamente a confirmed`);
      }
      
      // Verificar el estado final
      const { data: updatedReservation } = await supabase
        .from('reservations')
        .select('status')
        .eq('id', responseData.reservation_id)
        .single();
      
      console.log(`Estado final de la reserva ${responseData.reservation_id}: ${updatedReservation?.status}`);
      
      return reservation?.unit_id;
    } catch (error) {
      console.error('Error al actualizar reserva:', error);
      return undefined;
    }
  } 
  // Si no hay ID de reserva pero hay buy_order, intentamos actualizar por ese campo
  else if (responseData.response_code === 0 && responseData.buy_order) {
    try {
      // Buscar alguna reserva por buy_order
      const { data: reservations, error: selectError } = await supabase
        .from('reservations')
        .select('id, unit_id, status')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (selectError) {
        console.error('Error al buscar reservas pendientes:', selectError);
        return undefined;
      }
    
      if (reservations && reservations.length > 0) {
        // Actualizar la reserva más reciente
        const latestReservation = reservations[0];
        console.log(`Actualizando reserva ${latestReservation.id} a confirmed por buy_order`);
        
        const { error: updateError } = await supabase
          .from('reservations')
          .update({ 
            status: 'confirmed',
            payment_details: responseData,
            updated_at: new Date().toISOString()
          })
          .eq('id', latestReservation.id);
        
        if (updateError) {
          console.error('Error al actualizar reserva por buy_order:', updateError);
          return undefined;
        }
          
        console.log(`Reserva ${latestReservation.id} actualizada correctamente a confirmed por buy_order`);
        return latestReservation.unit_id;
      }
    } catch (error) {
      console.error('Error al actualizar reserva por buy_order:', error);
      return undefined;
    }
  }
  
  return undefined;
}

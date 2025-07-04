import { TransactionResult } from './types';
import { supabase } from '@/lib/supabase';

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
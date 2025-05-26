// Handle reservation status updates and verification
import { WebPayResponse } from "../types.ts";
import { 
  updateReservationStatus, 
  updatePaymentDetails 
} from "./reservationUpdates.ts";
import { processClientInfo } from "./clientInfoProcessor.ts";
import { supabase } from "../lib/supabase.ts";
import { TransactionResult } from "../types.ts";

export async function updateReservationWithPaymentResult(
  reservationId: string,
  paymentResult: TransactionResult
): Promise<boolean> {
  console.log(`🔄 [updateReservationWithPaymentResult] Iniciando actualización para reserva ${reservationId}`);
  console.log('📝 Datos de pago:', JSON.stringify(paymentResult, null, 2));
  
  if (paymentResult.response_code !== 0) {
    console.log('⚠️ [updateReservationWithPaymentResult] Pago no exitoso, no se actualiza estado');
    return false;
  }

  try {
    // Obtener el código de reserva primero
    console.log('🔍 [updateReservationWithPaymentResult] Buscando código de reserva...');
    const { data: primaryReservation, error: fetchError } = await supabase
      .from('reservations')
      .select('reservation_code, status')
      .eq('id', reservationId)
      .single();

    if (fetchError) {
      console.error('❌ [updateReservationWithPaymentResult] Error al obtener código de reserva:', fetchError);
      return false;
    }

    if (!primaryReservation?.reservation_code) {
      console.error('❌ [updateReservationWithPaymentResult] No se encontró el código de reserva');
      return false;
    }

    console.log(`✅ [updateReservationWithPaymentResult] Código de reserva encontrado: ${primaryReservation.reservation_code}`);
    console.log(`📊 [updateReservationWithPaymentResult] Estado actual: ${primaryReservation.status}`);

    // Obtener todas las reservas asociadas antes de actualizar
    console.log('🔍 [updateReservationWithPaymentResult] Buscando reservas asociadas...');
    const { data: associatedReservations, error: fetchAssociatedError } = await supabase
      .from('reservations')
      .select('id, status, reservation_code')
      .eq('reservation_code', primaryReservation.reservation_code);

    if (fetchAssociatedError) {
      console.error('❌ [updateReservationWithPaymentResult] Error al obtener reservas asociadas:', fetchAssociatedError);
      return false;
    }

    console.log(`📊 [updateReservationWithPaymentResult] Reservas asociadas encontradas:`, associatedReservations);

    // Intentar actualizar usando updateReservationStatus primero
    console.log('🔄 [updateReservationWithPaymentResult] Actualizando reservas...');
    const { data: updateResult, error: updateError } = await supabase
      .from('reservations')
      .update({ 
        status: 'confirmed',
        payment_details: paymentResult,
        updated_at: new Date().toISOString()
      })
      .eq('reservation_code', primaryReservation.reservation_code)
      .select();

    if (updateError) {
      console.error('❌ [updateReservationWithPaymentResult] Error en actualización principal:', updateError);
      
      // Intentar actualización directa como fallback
      console.log('🔄 [updateReservationWithPaymentResult] Intentando actualización directa...');
      const { error: directError } = await supabase
        .from('reservations')
        .update({ 
          status: 'confirmed',
          payment_details: paymentResult,
          updated_at: new Date().toISOString()
        })
        .eq('reservation_code', primaryReservation.reservation_code);

      if (directError) {
        console.error('❌ [updateReservationWithPaymentResult] Error en actualización directa:', directError);
        return false;
      }
    }

    console.log('✅ [updateReservationWithPaymentResult] Resultado de la actualización:', updateResult);

    // Verificar que todas las reservas se actualizaron
    console.log('🔍 [updateReservationWithPaymentResult] Verificando actualización...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('reservations')
      .select('id, status, reservation_code')
      .eq('reservation_code', primaryReservation.reservation_code);

    if (verifyError) {
      console.error('❌ [updateReservationWithPaymentResult] Error al verificar actualización:', verifyError);
      return false;
    }

    const allConfirmed = verifyData?.every(r => r.status === 'confirmed');
    console.log('📊 [updateReservationWithPaymentResult] Verificación final:', {
      totalReservas: verifyData?.length,
      todasConfirmadas: allConfirmed,
      detalles: verifyData
    });

    if (!allConfirmed) {
      const noConfirmadas = verifyData?.filter(r => r.status !== 'confirmed');
      console.error('❌ [updateReservationWithPaymentResult] Reservas no actualizadas:', noConfirmadas);
      return false;
    }

    console.log('✅ [updateReservationWithPaymentResult] Todas las reservas actualizadas correctamente');
    return true;
  } catch (error) {
    console.error('❌ [updateReservationWithPaymentResult] Error general:', error);
    return false;
  }
}

export async function verifyFinalReservationState(
  supabaseUrl: string,
  supabaseKey: string,
  reservationId: string
): Promise<{ status?: string; client_name?: string; client_email?: string } | null> {
  try {
    const verifyResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}&select=status,client_name,client_email`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    });
    
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      if (verifyData.length > 0) {
        console.log(`Estado final de la reserva ${reservationId}: ${verifyData[0].status}`);
        console.log(`Información del cliente: ${verifyData[0].client_name} (${verifyData[0].client_email})`);
        return verifyData[0];
      }
    }
    return null;
  } catch (verifyError) {
    console.error(`Error al verificar estado final: ${verifyError}`);
    return null;
  }
}

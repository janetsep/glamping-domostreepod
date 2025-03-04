
import { supabase } from '@/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';

export interface TransactionResult {
  authorization_code?: string;
  buy_order?: string;
  amount?: number;
  response_code: number;
  card_detail?: {
    card_number?: string;
  };
  status?: string;
  reservation_id?: string;
}

export async function saveTokenToReservation(token_ws: string): Promise<void> {
  try {
    const { data: latestReservation } = await supabase
      .from('reservations')
      .select('id')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (latestReservation) {
      console.log(`Guardando token ${token_ws} en reserva ${latestReservation.id}`);
      await supabase
        .from('reservations')
        .update({ 
          payment_details: { token: token_ws, updated_at: new Date().toISOString() }
        })
        .eq('id', latestReservation.id);
    }
  } catch (e) {
    console.error('Error al pre-guardar token en reserva:', e);
  }
}

export async function confirmTransaction(token_ws: string): Promise<TransactionResult> {
  const confirmResponse = await fetch(`${SUPABASE_URL}/functions/v1/webpay-confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
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
    throw new Error(responseData.error || 'Error al confirmar la transacción');
  }

  return responseData;
}

export async function updateReservationIfNeeded(responseData: TransactionResult): Promise<string | undefined> {
  if (responseData.response_code === 0 && responseData.reservation_id) {
    // Verificar estado actual
    const { data: reservation } = await supabase
      .from('reservations')
      .select('status, unit_id')
      .eq('id', responseData.reservation_id)
      .single();
      
    if (reservation && reservation.status !== 'confirmed') {
      console.log(`Actualizando estado de reserva ${responseData.reservation_id} a confirmed`);
      await supabase
        .from('reservations')
        .update({ 
          status: 'confirmed',
          payment_details: responseData
        })
        .eq('id', responseData.reservation_id);
    }
    
    return reservation?.unit_id;
  } else if (responseData.response_code === 0 && responseData.buy_order) {
    // Buscar alguna reserva por buy_order
    const { data: reservations } = await supabase
      .from('reservations')
      .select('id, unit_id, status')
      .eq('status', 'pending');
    
    if (reservations && reservations.length > 0) {
      // Actualizar la reserva más reciente
      const latestReservation = reservations[0];
      await supabase
        .from('reservations')
        .update({ 
          status: 'confirmed',
          payment_details: responseData
        })
        .eq('id', latestReservation.id);
        
      return latestReservation.unit_id;
    }
  }
  
  return undefined;
}

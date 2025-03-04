
import { supabase } from '@/lib/supabase';
import { storeClientInfo } from './utils';

// Service for managing WebPay tokens
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


import { supabase } from '@/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';

/**
 * Attempt to update reservation data using Supabase client first,
 * fallback to direct fetch if client fails
 */
export const updateReservationData = async (
  reservationId: string,
  updateData: any
): Promise<boolean> => {
  try {
    // First attempt: Use Supabase client
    try {
      const { error: supabaseError } = await supabase
        .from('reservations')
        .update(updateData)
        .eq('id', reservationId);
        
      if (supabaseError) {
        console.error('Error con cliente supabase:', supabaseError);
        throw supabaseError;
      }
      
      console.log(`Operación completada correctamente usando cliente supabase`);
      return true;
    } catch (clientError) {
      console.warn('Fallo con cliente supabase, intentando con fetch directo:', clientError);
      
      // Second attempt: Use direct fetch
      const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al actualizar datos (HTTP ${response.status}):`, errorText);
        throw new Error(`Error al actualizar datos: ${response.status} ${errorText}`);
      }

      console.log(`Operación completada correctamente usando fetch directo`);
      return true;
    }
  } catch (err) {
    console.error('Error al actualizar datos:', err);
    return false;
  }
};

/**
 * Verify that the reservation status updated correctly
 */
export const verifyReservationUpdate = async (reservationId: string): Promise<void> => {
  try {
    const verifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${reservationId}&select=status`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      if (verifyData.length > 0) {
        console.log(`Estado actual de la reserva ${reservationId}: ${verifyData[0].status}`);
      }
    }
  } catch (verifyError) {
    console.error('Error al verificar estado final:', verifyError);
  }
};

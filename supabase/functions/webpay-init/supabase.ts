
// Operaciones con Supabase para webpay-init
import { WebPayInitResponse } from "./types.ts";

// Verifica si hay credenciales de Supabase disponibles
export function hasSupabaseCredentials(): boolean {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  return !!supabaseUrl && !!supabaseKey;
}

// Actualiza los detalles de pago en la reserva
export async function updateReservationPaymentDetails(
  reservationId: string,
  token: string,
  buyOrder: string,
  sessionId: string
): Promise<boolean> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  if (!supabaseUrl || !supabaseKey) {
    console.log("[webpay-init] No se encontraron credenciales de Supabase");
    return false;
  }
  
  try {
    const updateData = {
      payment_details: {
        token: token,
        buy_order: buyOrder,
        session_id: sessionId,
        transaction_initiation: new Date().toISOString()
      }
    };
    
    console.log(`[webpay-init] Actualizando reserva ${reservationId} con datos: ${JSON.stringify(updateData)}`);
    
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!updateResponse.ok) {
      const updateResponseText = await updateResponse.text();
      console.error(`[webpay-init] Error al actualizar reserva: ${updateResponseText}`);
      return false;
    }
    
    console.log(`[webpay-init] Reserva ${reservationId} actualizada correctamente`);
    return true;
  } catch (error) {
    console.error(`[webpay-init] Error al actualizar reserva: ${error.message}`);
    return false;
  }
}

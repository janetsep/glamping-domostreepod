
// Handle reservation status updates and verification
import { WebPayResponse } from "../types.ts";
import { 
  updateReservationStatus, 
  updatePaymentDetails 
} from "./reservationUpdates.ts";
import { processClientInfo } from "./clientInfoProcessor.ts";

export async function updateReservationWithPaymentResult(
  supabaseUrl: string,
  supabaseKey: string,
  reservationId: string,
  responseData: WebPayResponse,
  clientInfo?: { name?: string; email?: string; phone?: string }
): Promise<boolean> {
  try {
    // Actualizar estado de la reserva si el pago fue exitoso
    if (responseData.response_code === 0) {
      console.log(`Actualizando estado de reserva ${reservationId} a 'confirmed'`);
      
      // Primer intento de actualización
      const updateSuccess = await updateReservationStatus(supabaseUrl, supabaseKey, reservationId, 'confirmed', responseData);
      
      if (updateSuccess) {
        console.log(`Reserva ${reservationId} actualizada correctamente a 'confirmed'`);
      } else {
        console.error(`No se pudo actualizar la reserva ${reservationId}`);
        
        // Intentar actualizar nuevamente con un método alternativo
        try {
          console.log(`Intentando actualización alternativa para ${reservationId}`);
          const directUpdateResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              status: 'confirmed',
              payment_details: responseData,
              updated_at: new Date().toISOString()
            })
          });
          
          if (directUpdateResponse.ok) {
            console.log(`Reserva ${reservationId} actualizada correctamente con método alternativo`);
          } else {
            console.error(`Error al actualizar reserva con método alternativo: ${await directUpdateResponse.text()}`);
            
            // Tercer intento con otro endpoint
            console.log(`Intentando tercer método de actualización para ${reservationId}`);
            const thirdAttemptResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/update_reservation_status`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey
              },
              body: JSON.stringify({
                p_reservation_id: reservationId,
                p_status: 'confirmed',
                p_payment_details: responseData
              })
            });
            
            if (!thirdAttemptResponse.ok) {
              console.error(`Error en tercer intento: ${await thirdAttemptResponse.text()}`);
              return false;
            } else {
              console.log(`Reserva actualizada con tercer método`);
            }
          }
        } catch (directUpdateError) {
          console.error(`Error en actualización alternativa: ${directUpdateError}`);
          return false;
        }
      }
      
      // Si hay información de cliente, actualizarla
      if (clientInfo && (clientInfo.name || clientInfo.email || clientInfo.phone)) {
        await processClientInfo(supabaseUrl, supabaseKey, reservationId, clientInfo);
      }
    } else {
      // Actualizar con los detalles del pago fallido pero sin cambiar estado
      console.log(`Actualizando detalles de pago para reserva ${reservationId} (pago fallido)`);
      await updatePaymentDetails(supabaseUrl, supabaseKey, reservationId, responseData);
    }
    
    return true;
  } catch (error) {
    console.error(`Error al actualizar reserva: ${error}`);
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

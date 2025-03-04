
// Lógica principal de procesamiento para webpay-confirm
import { WebPayResponse, TransactionResult } from "./types.ts";
import { getWebPayConfig, confirmWebPayTransaction } from "./transbank.ts";
import { 
  findReservationByToken, 
  findReservationByBuyOrder,
  findReservationByIdDirect,
  findLatestPendingReservation,
  updateReservationStatus,
  updatePaymentDetails,
  updateClientInformation
} from "./supabase.ts";

// Procesa la confirmación de WebPay y actualiza la reserva
export async function processWebPayConfirmation(
  token: string,
  isPackageUnit: boolean,
  reservationId?: string,
  clientInfo?: {name?: string; email?: string; phone?: string}
): Promise<TransactionResult> {
  // Confirmar transacción con WebPay
  const webpayConfig = getWebPayConfig();
  const responseData = await confirmWebPayTransaction(token, webpayConfig);
  
  let foundReservationId = reservationId || null;
  
  // Solo actualizar reserva en Supabase si no es una unidad de paquete
  if (!isPackageUnit) {
    // Obtener credenciales de Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidas");
      throw new Error("Error de configuración del servidor");
    }
    
    try {
      let reservations = [];
      
      // Primero intentamos con el ID directo si está disponible
      if (foundReservationId) {
        console.log(`Buscando reserva por ID directo: ${foundReservationId}`);
        reservations = await findReservationByIdDirect(supabaseUrl, supabaseKey, foundReservationId);
      }
      
      // Si no encontramos por ID directo, buscamos por token
      if (!reservations || reservations.length === 0) {
        console.log(`Buscando reserva por token: ${token}`);
        reservations = await findReservationByToken(supabaseUrl, supabaseKey, token);
      }
      
      // Si no encontramos por token, intentamos por buy_order
      if (!reservations || reservations.length === 0) {
        if (responseData.buy_order) {
          console.log(`Buscando reserva por buy_order: ${responseData.buy_order}`);
          reservations = await findReservationByBuyOrder(supabaseUrl, supabaseKey, responseData.buy_order);
        }
      }
      
      // Si encontramos reserva, actualizamos su estado
      if (reservations && reservations.length > 0) {
        foundReservationId = reservations[0].id;
        console.log(`Encontrada reserva con ID ${foundReservationId} para el token ${token}`);
        
        // Actualizar estado de la reserva si el pago fue exitoso
        if (responseData.response_code === 0) { // 0 = pago exitoso en WebPay
          console.log(`Actualizando estado de reserva ${foundReservationId} a 'confirmed'`);
          const updateSuccess = await updateReservationStatus(supabaseUrl, supabaseKey, foundReservationId, 'confirmed', responseData);
          
          if (updateSuccess) {
            console.log(`Reserva ${foundReservationId} actualizada correctamente a 'confirmed'`);
          } else {
            console.error(`No se pudo actualizar la reserva ${foundReservationId}`);
            
            // Intentar actualizar nuevamente con un método alternativo
            try {
              const directUpdateResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${foundReservationId}`, {
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
                console.log(`Reserva ${foundReservationId} actualizada correctamente con método alternativo`);
              } else {
                console.error(`Error al actualizar reserva con método alternativo: ${await directUpdateResponse.text()}`);
              }
            } catch (directUpdateError) {
              console.error(`Error en actualización alternativa: ${directUpdateError}`);
            }
          }
          
          // Si hay información de cliente, actualizarla
          if (clientInfo && (clientInfo.name || clientInfo.email || clientInfo.phone)) {
            console.log(`Actualizando información del cliente para reserva ${foundReservationId}`);
            await updateClientInformation(supabaseUrl, supabaseKey, foundReservationId, clientInfo);
          }
        } else {
          // Actualizar con los detalles del pago fallido pero sin cambiar estado
          console.log(`Actualizando detalles de pago para reserva ${foundReservationId} (pago fallido)`);
          await updatePaymentDetails(supabaseUrl, supabaseKey, foundReservationId, responseData);
        }
      } else {
        console.log(`No se encontró reserva para el token ${token} ni buy_order ${responseData.buy_order}`);
        
        // Intentar buscar la reserva más reciente en estado 'pending'
        const pendingReservations = await findLatestPendingReservation(supabaseUrl, supabaseKey);
        
        if (pendingReservations && pendingReservations.length > 0) {
          foundReservationId = pendingReservations[0].id;
          console.log(`Usando reserva más reciente en estado pending: ${foundReservationId}`);
          
          if (responseData.response_code === 0) {
            await updateReservationStatus(supabaseUrl, supabaseKey, foundReservationId, 'confirmed', responseData);
            
            // Si hay información de cliente, actualizarla
            if (clientInfo && (clientInfo.name || clientInfo.email || clientInfo.phone)) {
              console.log(`Actualizando información del cliente para reserva ${foundReservationId}`);
              await updateClientInformation(supabaseUrl, supabaseKey, foundReservationId, clientInfo);
            }
          } else {
            await updatePaymentDetails(supabaseUrl, supabaseKey, foundReservationId, responseData);
          }
        }
      }
      
      // Después de intentar actualizar, verificar el estado actual
      if (foundReservationId) {
        try {
          const verifyResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${foundReservationId}&select=status`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey
            }
          });
          
          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            if (verifyData.length > 0) {
              console.log(`Estado final de la reserva ${foundReservationId}: ${verifyData[0].status}`);
            }
          }
        } catch (verifyError) {
          console.error(`Error al verificar estado final: ${verifyError}`);
        }
      }
    } catch (error) {
      console.error(`Error al procesar reserva en Supabase: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  } else {
    console.log("Reserva de paquete temporal, no se busca en la base de datos");
    // Para reservas de paquete, usamos un ID fijo o generado en la respuesta
    foundReservationId = reservationId || "package-reservation";
  }
  
  // Añadir el ID de la reserva a la respuesta para facilitar la redirección
  return {
    ...responseData,
    reservation_id: foundReservationId,
    is_package_unit: !!isPackageUnit
  };
}


// Lógica principal de procesamiento para webpay-confirm
import { WebPayResponse, TransactionResult } from "./types.ts";
import { getWebPayConfig, confirmWebPayTransaction } from "./transbank.ts";
import { 
  findReservationByToken, 
  findReservationByBuyOrder,
  findLatestPendingReservation,
  updateReservationStatus,
  updatePaymentDetails
} from "./supabase.ts";

// Procesa la confirmación de WebPay y actualiza la reserva
export async function processWebPayConfirmation(
  token: string,
  isPackageUnit: boolean
): Promise<TransactionResult> {
  // Confirmar transacción con WebPay
  const webpayConfig = getWebPayConfig();
  const responseData = await confirmWebPayTransaction(token, webpayConfig);
  
  let reservationId = null;
  
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
      // Buscar reserva asociada al token
      let reservations = await findReservationByToken(supabaseUrl, supabaseKey, token);
      
      // Si no encontramos por token, intentamos por buy_order
      if (!reservations || reservations.length === 0) {
        if (responseData.buy_order) {
          reservations = await findReservationByBuyOrder(supabaseUrl, supabaseKey, responseData.buy_order);
        }
      }
      
      // Si encontramos reserva, actualizamos su estado
      if (reservations && reservations.length > 0) {
        reservationId = reservations[0].id;
        console.log(`Encontrada reserva con ID ${reservationId} para el token ${token}`);
        
        // Actualizar estado de la reserva si el pago fue exitoso
        if (responseData.response_code === 0) { // 0 = pago exitoso en WebPay
          await updateReservationStatus(supabaseUrl, supabaseKey, reservationId, 'confirmed', responseData);
        } else {
          // Actualizar con los detalles del pago fallido pero sin cambiar estado
          await updatePaymentDetails(supabaseUrl, supabaseKey, reservationId, responseData);
        }
      } else {
        console.log(`No se encontró reserva para el token ${token} ni buy_order ${responseData.buy_order}`);
        
        // Intentar buscar la reserva más reciente en estado 'pending'
        const pendingReservations = await findLatestPendingReservation(supabaseUrl, supabaseKey);
        
        if (pendingReservations && pendingReservations.length > 0) {
          reservationId = pendingReservations[0].id;
          console.log(`Usando reserva más reciente en estado pending: ${reservationId}`);
          
          if (responseData.response_code === 0) {
            await updateReservationStatus(supabaseUrl, supabaseKey, reservationId, 'confirmed', responseData);
          } else {
            await updatePaymentDetails(supabaseUrl, supabaseKey, reservationId, responseData);
          }
        }
      }
    } catch (error) {
      console.error(`Error al procesar reserva en Supabase: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  } else {
    console.log("Reserva de paquete temporal, no se busca en la base de datos");
    // Para reservas de paquete, usamos un ID fijo o generado en la respuesta
    reservationId = "package-reservation";
  }
  
  // Añadir el ID de la reserva a la respuesta para facilitar la redirección
  return {
    ...responseData,
    reservation_id: reservationId,
    is_package_unit: !!isPackageUnit
  };
}


// Main transaction processing logic
import { WebPayResponse, TransactionResult } from "../types.ts";
import { getWebPayConfig, confirmWebPayTransaction } from "../transbank.ts";
import { findReservation } from "./reservationFinder.ts";
import { updateReservationWithPaymentResult, verifyFinalReservationState } from "./reservationProcessor.ts";

export async function processTransaction(
  token: string,
  isPackageUnit: boolean,
  reservationId?: string,
  clientInfo?: { name?: string; email?: string; phone?: string }
): Promise<TransactionResult> {
  try {
    // Confirmar transacción con WebPay
    const webpayConfig = getWebPayConfig();
    const responseData = await confirmWebPayTransaction(token, webpayConfig);
    
    console.log(`Respuesta de confirmación de WebPay: ${JSON.stringify(responseData)}`);
    
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
      
      // Buscar la reserva usando diferentes métodos
      foundReservationId = await findReservation(supabaseUrl, supabaseKey, token, responseData, reservationId);
      
      // Si encontramos una reserva, actualizarla
      if (foundReservationId) {
        await updateReservationWithPaymentResult(
          supabaseUrl, 
          supabaseKey, 
          foundReservationId, 
          responseData, 
          clientInfo
        );
        
        // Verificar el estado final
        await verifyFinalReservationState(supabaseUrl, supabaseKey, foundReservationId);
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
  } catch (error) {
    console.error(`Error en processTransaction: ${error.message || 'Error desconocido'}`);
    throw error;
  }
}

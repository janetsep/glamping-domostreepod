
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
    let reservationData = {};
    
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
      
      // Si encontramos una reserva, actualizarla y obtener sus datos
      if (foundReservationId) {
        await updateReservationWithPaymentResult(
          supabaseUrl, 
          supabaseKey, 
          foundReservationId, 
          responseData, 
          clientInfo
        );
        
        // Verificar el estado final y obtener datos adicionales de la reserva
        const reservationInfo = await verifyFinalReservationState(supabaseUrl, supabaseKey, foundReservationId);
        
        if (reservationInfo) {
          console.log("Información completa de la reserva:", reservationInfo);
          
          // Obtener datos adicionales de la reserva para incluirlos en la respuesta
          try {
            const reservationResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${foundReservationId}&select=*`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey
              }
            });
            
            if (reservationResponse.ok) {
              const reservations = await reservationResponse.json();
              if (reservations.length > 0) {
                const fullReservationData = reservations[0];
                console.log("Datos completos de la reserva:", fullReservationData);
                
                // Extraer datos para la respuesta
                reservationData = {
                  unit_name: fullReservationData.unit_id,
                  check_in: fullReservationData.check_in,
                  check_out: fullReservationData.check_out,
                  guests: fullReservationData.guests,
                  pets: fullReservationData.pets,
                  pets_price: fullReservationData.pets_price,
                  selected_activities: fullReservationData.selected_activities,
                  selected_packages: fullReservationData.selected_packages,
                  activities_total: 0, // Calcular si es necesario
                  packages_total: 0, // Calcular si es necesario
                  reservation_code: fullReservationData.reservation_code
                };
              }
            }
          } catch (dataError) {
            console.error("Error al obtener datos adicionales de la reserva:", dataError);
          }
        }
      }
    } else {
      console.log("Reserva de paquete temporal, no se busca en la base de datos");
      // Para reservas de paquete, usamos un ID fijo o generado en la respuesta
      foundReservationId = reservationId || "package-reservation";
    }
    
    // Añadir el ID de la reserva y los datos a la respuesta para facilitar la redirección
    return {
      ...responseData,
      reservation_id: foundReservationId,
      is_package_unit: !!isPackageUnit,
      reservation_data: reservationData
    };
  } catch (error) {
    console.error(`Error en processTransaction: ${error.message || 'Error desconocido'}`);
    throw error;
  }
}

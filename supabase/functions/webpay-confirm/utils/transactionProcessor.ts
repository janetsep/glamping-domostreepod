
// Main transaction processing logic - simplificado y robusto
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
  console.log(`🔄 [processTransaction] Iniciando procesamiento con token: ${token}`);
  
  try {
    // 1. Confirmar transacción con WebPay
    console.log('🔄 [processTransaction] Confirmando con WebPay...');
    const webpayConfig = getWebPayConfig();
    const responseData = await confirmWebPayTransaction(token, webpayConfig);
    
    console.log(`✅ [processTransaction] WebPay confirmado. Código: ${responseData.response_code}`);
    
    // 2. Si es unidad de paquete, devolver resultado inmediatamente
    if (isPackageUnit) {
      console.log('📦 [processTransaction] Unidad de paquete, no se actualiza base de datos');
      return {
        ...responseData,
        reservation_id: reservationId || "package-reservation",
        is_package_unit: true,
        reservation_data: {}
      };
    }
    
    // 3. Solo procesar reservas en Supabase si el pago fue exitoso
    if (responseData.response_code !== 0) {
      console.log(`⚠️ [processTransaction] Pago no exitoso: ${responseData.response_code}`);
      return {
        ...responseData,
        reservation_id: reservationId,
        is_package_unit: false,
        reservation_data: {}
      };
    }
    
    // 4. Obtener credenciales de Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Configuración de Supabase no disponible");
    }
    
    // 5. Buscar la reserva
    const foundReservationId = await findReservation(
      supabaseUrl, 
      supabaseKey, 
      token, 
      responseData, 
      reservationId
    );
    
    if (!foundReservationId) {
      console.log('⚠️ [processTransaction] No se encontró reserva, pero pago exitoso');
      return {
        ...responseData,
        reservation_id: null,
        is_package_unit: false,
        reservation_data: {}
      };
    }
    
    // 6. Actualizar reserva(s)
    await updateReservationWithPaymentResult(
      supabaseUrl,
      supabaseKey,
      foundReservationId,
      responseData,
      clientInfo
    );
    
    // 7. Verificar estado final
    const verificationResult = await verifyFinalReservationState(
      supabaseUrl,
      supabaseKey,
      foundReservationId
    );
    
    console.log(`✅ [processTransaction] Procesamiento completo: reserva ${foundReservationId}`);
    
    return {
      ...responseData,
      reservation_id: foundReservationId,
      is_package_unit: false,
      reservation_data: {
        total_reservations: verificationResult.totalReservations,
        all_confirmed: verificationResult.allConfirmed
      }
    };
    
  } catch (error) {
    console.error(`❌ [processTransaction] Error:`, error);
    throw error;
  }
}

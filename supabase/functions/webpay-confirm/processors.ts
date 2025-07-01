
// Lógica principal de procesamiento para webpay-confirm - simplificada
import { TransactionResult } from "./types.ts";
import { processTransaction } from "./utils/transactionProcessor.ts";

// Procesa la confirmación de WebPay y actualiza la reserva
export async function processWebPayConfirmation(
  token: string,
  isPackageUnit: boolean,
  reservationId?: string,
  clientInfo?: {name?: string; email?: string; phone?: string}
): Promise<TransactionResult> {
  console.log(`🔄 [processWebPayConfirmation] Token: ${token}, Package: ${isPackageUnit}, ID: ${reservationId}`);
  
  try {
    const result = await processTransaction(token, isPackageUnit, reservationId, clientInfo);
    console.log(`✅ [processWebPayConfirmation] Procesamiento exitoso`);
    return result;
  } catch (error) {
    console.error(`❌ [processWebPayConfirmation] Error: ${error.message}`);
    throw error;
  }
}

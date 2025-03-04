
// Lógica principal de procesamiento para webpay-confirm
import { TransactionResult } from "./types.ts";
import { processTransaction } from "./utils/transactionProcessor.ts";

// Procesa la confirmación de WebPay y actualiza la reserva
export async function processWebPayConfirmation(
  token: string,
  isPackageUnit: boolean,
  reservationId?: string,
  clientInfo?: {name?: string; email?: string; phone?: string}
): Promise<TransactionResult> {
  try {
    return await processTransaction(token, isPackageUnit, reservationId, clientInfo);
  } catch (error) {
    console.error(`Error en processWebPayConfirmation: ${error.message || 'Error desconocido'}`);
    throw error;
  }
}

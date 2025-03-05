
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
    console.log(`Procesando confirmación de WebPay con token: ${token}`);
    console.log(`ID de reserva proporcionado: ${reservationId || 'No proporcionado'}`);
    console.log(`Información de cliente:`, clientInfo || 'No proporcionada');
    
    // Procesar la transacción y actualizar la información del cliente si corresponde
    const result = await processTransaction(token, isPackageUnit, reservationId, clientInfo);
    
    return result;
  } catch (error) {
    console.error(`Error en processWebPayConfirmation: ${error.message || 'Error desconocido'}`);
    throw error;
  }
}

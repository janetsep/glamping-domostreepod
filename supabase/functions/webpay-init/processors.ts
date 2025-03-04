
// Lógica principal de procesamiento para webpay-init
import { TransactionInitData, InitResponsePayload, CreateTransactionData } from "./types.ts";
import { getWebPayConfig, generateBuyOrder, generateSessionId, createWebPayTransaction } from "./transbank.ts";
import { updateReservationPaymentDetails } from "./supabase.ts";

// Procesa la inicialización de WebPay
export async function processWebPayInit(data: TransactionInitData): Promise<InitResponsePayload> {
  console.log(`[webpay-init] Iniciando transacción para reserva ${data.reservationId}, Monto: ${data.amount}, Origen: ${data.origin}`);
  
  // Generar datos de la transacción
  const buyOrder = generateBuyOrder(data.reservationId);
  const sessionId = generateSessionId();
  const returnUrl = `${data.origin}/webpay-return`;
  
  console.log(`[webpay-init] Buy Order: ${buyOrder}, Session ID: ${sessionId}, Return URL: ${returnUrl}`);
  
  // Configuración de WebPay
  const webpayConfig = getWebPayConfig();
  
  // Datos para crear la transacción
  const transactionData: CreateTransactionData = {
    buy_order: buyOrder,
    session_id: sessionId,
    amount: data.amount,
    return_url: returnUrl
  };
  
  // Crear transacción en WebPay
  const webpayResponse = await createWebPayTransaction(transactionData, webpayConfig);
  
  // Verificar si es una unidad de paquete
  const isPackageUnit = data.reservationId.startsWith('temp-');
  
  // Guardar detalles en Supabase para unidades no de paquete
  if (!isPackageUnit) {
    await updateReservationPaymentDetails(data.reservationId, webpayResponse.token, buyOrder, sessionId);
  } else {
    console.log(`[webpay-init] Reserva temporal (paquete), no se actualiza en la base de datos`);
  }
  
  // Construir respuesta
  const responsePayload: InitResponsePayload = {
    token: webpayResponse.token,
    url: webpayResponse.url,
    buy_order: buyOrder,
    is_package_unit: isPackageUnit
  };
  
  console.log(`[webpay-init] Datos de respuesta: ${JSON.stringify(responsePayload)}`);
  
  return responsePayload;
}

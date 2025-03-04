
// Comunicación con WebPay/Transbank
import { WebPayConfig, CreateTransactionData, WebPayInitResponse } from "./types.ts";

// Configuración para el entorno de integración de WebPay
export function getWebPayConfig(): WebPayConfig {
  return {
    commerceCode: "597055555532",
    apiKey: "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
    baseUrl: "https://webpay3gint.transbank.cl"
  };
}

// Genera una orden de compra única
export function generateBuyOrder(reservationId: string): string {
  return `BO-${Date.now()}-${reservationId.substring(0, 6)}`;
}

// Genera un ID de sesión único
export function generateSessionId(): string {
  return `SI-${Date.now()}`;
}

// Crea una transacción en WebPay
export async function createWebPayTransaction(
  transactionData: CreateTransactionData,
  config: WebPayConfig
): Promise<WebPayInitResponse> {
  console.log(`[webpay-init] Datos de creación de transacción: ${JSON.stringify(transactionData)}`);
  
  const createTransactionUrl = `${config.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions`;
  
  const response = await fetch(createTransactionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Tbk-Api-Key-Id": config.commerceCode,
      "Tbk-Api-Key-Secret": config.apiKey
    },
    body: JSON.stringify(transactionData)
  });
  
  const responseText = await response.text();
  console.log(`[webpay-init] Respuesta al crear transacción (texto): ${responseText}`);
  
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    console.error(`[webpay-init] Error al parsear respuesta: ${e.message}`);
    throw new Error(`Error al parsear respuesta de Webpay: ${responseText}`);
  }
  
  if (!response.ok) {
    console.error(`[webpay-init] Error al crear transacción: ${JSON.stringify(responseData)}`);
    throw new Error(`Error al crear transacción en Webpay: ${responseText}`);
  }
  
  // Validar que la respuesta contiene los campos esperados
  if (!responseData.token || !responseData.url) {
    console.error(`[webpay-init] Respuesta de Webpay incompleta: ${JSON.stringify(responseData)}`);
    throw new Error('Respuesta de Webpay incompleta');
  }
  
  return responseData;
}

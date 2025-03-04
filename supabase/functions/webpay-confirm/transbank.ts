
// Comunicación con WebPay/Transbank
import { WebPayConfig, WebPayResponse } from "./types.ts";

// Configuración para el entorno de pruebas de WebPay
export const getWebPayConfig = (): WebPayConfig => {
  return {
    endpoint: "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions",
    apiKey: "597055555532", // Código de comercio de prueba
    sharedSecret: "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C", // Clave secreta de prueba
  };
};

// Confirma la transacción con WebPay
export async function confirmWebPayTransaction(
  token: string, 
  config: WebPayConfig
): Promise<WebPayResponse> {
  console.log(`Confirmando transacción WebPay con token: ${token}`);

  try {
    // Llamada a WebPay para confirmar la transacción
    const response = await fetch(`${config.endpoint}/${token}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Tbk-Api-Key-Id': config.apiKey,
        'Tbk-Api-Key-Secret': config.sharedSecret,
      },
      body: JSON.stringify({})
    });
    
    // Capturar respuesta completa para depuración
    let responseText = '';
    
    try {
      responseText = await response.text();
      console.log("Respuesta de WebPay (texto completo):", responseText);
    } catch (textError) {
      console.error("Error al leer el texto de la respuesta:", textError);
      throw new Error("Error al leer respuesta de WebPay");
    }
    
    // Intentar parsear como JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error al parsear JSON de WebPay:", parseError, "Texto recibido:", responseText);
      throw new Error(`Error al parsear respuesta de WebPay: ${responseText}`);
    }
    
    console.log("Respuesta de confirmación de WebPay (objeto):", responseData);
    
    if (!response.ok) {
      console.error("Error en la respuesta de WebPay:", response.status, responseData);
      throw new Error(`Error en respuesta de WebPay: ${response.status} - ${responseText}`);
    }
    
    return responseData;
  } catch (error) {
    console.error("Error completo en confirmWebPayTransaction:", error);
    throw error;
  }
}

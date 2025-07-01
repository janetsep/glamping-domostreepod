
// Configuración y utilidades para Transbank WebPay

interface WebPayConfig {
  apiUrl: string;
  commerceCode: string;
  apiKey: string;
}

export function getWebPayConfig(): WebPayConfig {
  const isProduction = Deno.env.get("ENVIRONMENT") === "production";
  
  if (isProduction) {
    return {
      apiUrl: "https://webpay3g.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions",
      commerceCode: Deno.env.get("WEBPAY_COMMERCE_CODE") || "",
      apiKey: Deno.env.get("WEBPAY_API_KEY") || ""
    };
  } else {
    return {
      apiUrl: "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions",
      commerceCode: "597055555532",
      apiKey: "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"
    };
  }
}

export async function confirmWebPayTransaction(token: string, config: WebPayConfig) {
  console.log(`🔄 [WebPay] Confirmando transacción con token: ${token}`);
  
  const response = await fetch(`${config.apiUrl}/${token}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Tbk-Api-Key-Id': config.commerceCode,
      'Tbk-Api-Key-Secret': config.apiKey
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en WebPay: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  console.log(`✅ [WebPay] Transacción confirmada:`, data);
  
  return data;
}

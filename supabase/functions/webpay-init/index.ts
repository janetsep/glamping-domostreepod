
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

interface WebPayConfig {
  apiUrl: string;
  commerceCode: string;
  apiKey: string;
}

function getWebPayConfig(): WebPayConfig {
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

function generateValidBuyOrder(reservationId: string): string {
  // WebPay requiere buy_order alfanumérico, máximo 26 caracteres
  // Usar timestamp + parte del reservationId para asegurar unicidad
  const timestamp = Date.now().toString();
  const reservationPart = reservationId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
  const buyOrder = `${timestamp.substring(-10)}${reservationPart}`.substring(0, 26);
  
  console.log(`🔧 [webpay-init] Buy order generado: ${buyOrder} (longitud: ${buyOrder.length})`);
  return buyOrder;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Solo se permite método POST' }),
      { 
        status: 405, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }

  try {
    const { reservationId, amount, origin, unit_id, client_info } = await req.json();
    
    console.log(`🚀 [webpay-init] Iniciando WebPay para reserva ${reservationId}:`, {
      amount,
      origin,
      unit_id,
      client_info: client_info ? 'Presente' : 'Ausente'
    });

    // Validar parámetros requeridos
    if (!reservationId || !amount || !origin) {
      return new Response(
        JSON.stringify({ 
          error: 'Faltan parámetros requeridos: reservationId, amount, origin' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Validar que el monto sea válido
    if (amount <= 0) {
      return new Response(
        JSON.stringify({ 
          error: 'El monto debe ser mayor a cero' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const config = getWebPayConfig();
    const buyOrder = generateValidBuyOrder(reservationId);
    const sessionId = `SES-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    // URLs de retorno
    const returnUrl = `${origin}/webpay/return`;

    // Preparar datos para WebPay
    const webpayData = {
      buy_order: buyOrder,
      session_id: sessionId,
      amount: Math.round(amount),
      return_url: returnUrl
    };

    console.log(`📤 [webpay-init] Enviando datos a WebPay:`, {
      ...webpayData,
      buy_order_length: buyOrder.length
    });

    // Llamar a WebPay
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Tbk-Api-Key-Id': config.commerceCode,
        'Tbk-Api-Key-Secret': config.apiKey
      },
      body: JSON.stringify(webpayData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [webpay-init] Error de WebPay:`, errorText);
      throw new Error(`Error en WebPay: ${response.status} - ${errorText}`);
    }

    const webpayResponse = await response.json();
    console.log(`✅ [webpay-init] Respuesta de WebPay:`, webpayResponse);

    // Verificar que la respuesta tenga los campos necesarios
    if (!webpayResponse.url || !webpayResponse.token) {
      throw new Error('Respuesta inválida de WebPay: faltan url o token');
    }

    // Respuesta exitosa
    const result = {
      url: webpayResponse.url,
      token: webpayResponse.token,
      buy_order: buyOrder,
      session_id: sessionId,
      amount: webpayData.amount,
      reservation_id: reservationId,
      unit_id: unit_id
    };

    console.log(`✅ [webpay-init] Inicialización exitosa para reserva ${reservationId}`);

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error(`❌ [webpay-init] Error:`, error);
    
    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message || 'Error desconocido'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});

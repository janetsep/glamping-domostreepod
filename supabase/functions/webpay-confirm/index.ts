import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Configuración WebPay para testing
const WEBPAY_CONFIG = {
  apiUrl: "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions",
  commerceCode: "597055555532",
  apiKey: "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"
};

serve(async (req) => {
  console.log(`🚀 [webpay-confirm] ${req.method} - ${new Date().toISOString()}`);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ [webpay-confirm] CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }
  
  if (req.method !== 'POST') {
    console.log(`❌ [webpay-confirm] Método no permitido: ${req.method}`);
    return new Response(
      JSON.stringify({ error: 'Solo se permite método POST' }),
      { 
        status: 405, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }

  try {
    console.log('🔄 [webpay-confirm] Parseando body...');
    const body = await req.json();
    const { token_ws } = body;
    
    console.log(`🔄 [webpay-confirm] Token: ${token_ws}`);
    
    if (!token_ws) {
      return new Response(
        JSON.stringify({ error: 'Falta parámetro token_ws' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Confirmar transacción con WebPay
    console.log('🔄 [webpay-confirm] Confirmando con WebPay...');
    const webpayUrl = `${WEBPAY_CONFIG.apiUrl}/${token_ws}`;
    
    const webpayResponse = await fetch(webpayUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Tbk-Api-Key-Id': WEBPAY_CONFIG.commerceCode,
        'Tbk-Api-Key-Secret': WEBPAY_CONFIG.apiKey
      }
    });
    
    console.log(`📊 [webpay-confirm] WebPay status: ${webpayResponse.status}`);

    if (!webpayResponse.ok) {
      const errorText = await webpayResponse.text();
      console.error(`❌ [webpay-confirm] Error WebPay: ${webpayResponse.status} - ${errorText}`);
      return new Response(
        JSON.stringify({
          error: `Error WebPay: ${webpayResponse.status}`,
          details: errorText,
          response_code: -1
        }),
        { 
          status: 502, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const webpayData = await webpayResponse.json();
    console.log(`✅ [webpay-confirm] WebPay confirmado:`, webpayData);

    // Respuesta exitosa
    const result = {
      ...webpayData,
      reservation_id: body.reservation_id || null,
      is_package_unit: body.is_package_unit || false,
      processed_at: new Date().toISOString()
    };

    console.log(`✅ [webpay-confirm] Procesamiento completo`);
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error(`❌ [webpay-confirm] Error:`, error);
    
    return new Response(
      JSON.stringify({
        error: 'Error procesando pago',
        details: error.message,
        response_code: -1
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
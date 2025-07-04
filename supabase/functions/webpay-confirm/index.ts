
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
  // Añadir timeout y logging mejorado
  const timeout = setTimeout(() => {
    console.error('❌ [webpay-confirm] Timeout - función tardó más de 25 segundos');
  }, 25000);

  try {
    console.log(`🚀 [webpay-confirm] Nueva petición: ${req.method} - ${new Date().toISOString()}`);
    
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      console.log('✅ [webpay-confirm] Respondiendo CORS preflight');
      clearTimeout(timeout);
      return new Response(null, { headers: corsHeaders });
    }
    
    if (req.method !== 'POST') {
      console.log(`❌ [webpay-confirm] Método no permitido: ${req.method}`);
      clearTimeout(timeout);
      return new Response(
        JSON.stringify({ error: 'Solo se permite método POST' }),
        { 
          status: 405, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Parsear el body de la petición con timeout
    console.log('🔄 [webpay-confirm] Parseando body...');
    let body;
    try {
      body = await req.json();
      console.log('✅ [webpay-confirm] Body parseado correctamente');
    } catch (parseError) {
      console.error('❌ [webpay-confirm] Error parseando body:', parseError);
      clearTimeout(timeout);
      return new Response(
        JSON.stringify({ error: 'Body inválido', details: parseError.message }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const { token_ws } = body;
    console.log(`🔄 [webpay-confirm] Procesando token: ${token_ws}`);
    
    if (!token_ws) {
      console.log('❌ [webpay-confirm] Falta token_ws');
      clearTimeout(timeout);
      return new Response(
        JSON.stringify({ error: 'Falta parámetro token_ws' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Confirmar transacción con WebPay con timeout personalizado
    console.log('🔄 [webpay-confirm] Confirmando con WebPay...');
    const webpayUrl = `${WEBPAY_CONFIG.apiUrl}/${token_ws}`;
    console.log(`📍 [webpay-confirm] URL WebPay: ${webpayUrl}`);

    let webpayResponse;
    try {
      webpayResponse = await fetch(webpayUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Tbk-Api-Key-Id': WEBPAY_CONFIG.commerceCode,
          'Tbk-Api-Key-Secret': WEBPAY_CONFIG.apiKey
        }
      });
      console.log(`📊 [webpay-confirm] WebPay respondió con status: ${webpayResponse.status}`);
    } catch (fetchError) {
      console.error('❌ [webpay-confirm] Error en fetch a WebPay:', fetchError);
      clearTimeout(timeout);
      return new Response(
        JSON.stringify({
          error: 'Error conectando con WebPay',
          details: fetchError.message,
          response_code: -1
        }),
        { 
          status: 502, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    if (!webpayResponse.ok) {
      const errorText = await webpayResponse.text();
      console.error(`❌ [webpay-confirm] Error WebPay: ${webpayResponse.status} - ${errorText}`);
      clearTimeout(timeout);
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

    let webpayData;
    try {
      webpayData = await webpayResponse.json();
      console.log(`✅ [webpay-confirm] Respuesta WebPay parseada:`, JSON.stringify(webpayData, null, 2));
    } catch (jsonError) {
      console.error('❌ [webpay-confirm] Error parseando respuesta WebPay:', jsonError);
      clearTimeout(timeout);
      return new Response(
        JSON.stringify({
          error: 'Error parseando respuesta de WebPay',
          details: jsonError.message,
          response_code: -1
        }),
        { 
          status: 502, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Respuesta exitosa
    const result = {
      ...webpayData,
      reservation_id: body.reservation_id || null,
      is_package_unit: body.is_package_unit || false,
      processed_at: new Date().toISOString()
    };

    console.log(`✅ [webpay-confirm] Procesamiento completado exitosamente en ${new Date().toISOString()}`);
    
    clearTimeout(timeout);
    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error(`❌ [webpay-confirm] Error general:`, error);
    console.error(`❌ [webpay-confirm] Stack trace:`, error.stack);
    
    clearTimeout(timeout);
    return new Response(
      JSON.stringify({
        error: 'Error procesando pago',
        details: error.message,
        response_code: -1,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});

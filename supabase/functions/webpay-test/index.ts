import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  console.log(`🔧 [webpay-test] Nueva petición: ${req.method}`);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ [webpay-test] Respondiendo CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const result = {
      status: 'ok',
      message: 'Edge Functions están funcionando correctamente',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    };

    console.log(`✅ [webpay-test] Respuesta exitosa:`, result);
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error(`❌ [webpay-test] Error:`, error);
    
    return new Response(
      JSON.stringify({
        error: 'Error en la función de prueba',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
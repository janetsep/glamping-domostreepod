import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log(`🚀 [webpay-confirm] ${req.method} - ${new Date().toISOString()}`);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ [webpay-confirm] CORS preflight OK');
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
    console.log('🔄 [webpay-confirm] Body recibido:', JSON.stringify(body));
    
    // RESPUESTA SIMULADA PARA TESTING
    const mockResult = {
      vci: "TSY",
      amount: 15000,
      status: "AUTHORIZED",
      buy_order: "O-" + Date.now(),
      session_id: "S-" + Date.now(),
      card_detail: {
        card_number: "6623"
      },
      accounting_date: "0522",
      transaction_date: new Date().toISOString(),
      authorization_code: "1213",
      payment_type_code: "VN",
      response_code: 0,
      installments_amount: 0,
      installments_number: 0,
      balance: 0,
      reservation_id: body.reservation_id || null,
      is_package_unit: body.is_package_unit || false,
      processed_at: new Date().toISOString()
    };

    console.log(`✅ [webpay-confirm] Enviando respuesta simulada`);
    
    return new Response(
      JSON.stringify(mockResult),
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
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  console.log(`🧪 [simple-test] ${req.method} request received`);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ [simple-test] CORS preflight OK');
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const result = {
      status: 'success',
      message: 'Simple test function working',
      method: req.method,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ [simple-test] Response:`, result);
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error(`❌ [simple-test] Error:`, error);
    
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
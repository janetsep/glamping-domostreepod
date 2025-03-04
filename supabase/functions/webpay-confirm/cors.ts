
// Gestión de CORS para la función webpay-confirm

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Maneja las solicitudes de preflight OPTIONS
export function handleCorsOptions() {
  return new Response(null, { 
    headers: corsHeaders 
  });
}

// Añade las cabeceras CORS a cualquier respuesta
export function createResponse(body: any, status: number = 200) {
  return new Response(JSON.stringify(body), { 
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
  });
}

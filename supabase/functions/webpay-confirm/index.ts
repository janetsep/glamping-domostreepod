
// Punto de entrada para la función webpay-confirm
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsOptions, createResponse } from "./cors.ts";
import { processWebPayConfirmation } from "./processors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsOptions();
  }
  
  try {
    // Solo permitimos método POST
    if (req.method !== 'POST') {
      return createResponse({ error: 'Método no permitido, solo POST' }, 405);
    }
    
    // Parsear el cuerpo de la solicitud
    const requestData = await req.json();
    const { token_ws, is_package_unit } = requestData;
    
    if (!token_ws) {
      return createResponse({ error: 'Falta el token de la transacción' }, 400);
    }
    
    // Procesar la confirmación
    const result = await processWebPayConfirmation(token_ws, is_package_unit);
    
    // Devolver el resultado
    return createResponse(result);
    
  } catch (error) {
    console.error("Error en el procesamiento de confirmación:", error);
    return createResponse(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' }, 
      500
    );
  }
});

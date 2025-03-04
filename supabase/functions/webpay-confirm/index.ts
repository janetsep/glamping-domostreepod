
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
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      return createResponse({ error: 'Formato de solicitud inválido' }, 400);
    }
    
    const { token_ws, is_package_unit, reservation_id, client_info } = requestData;
    
    if (!token_ws) {
      return createResponse({ 
        error: 'Falta el parámetro requerido: token_ws' 
      }, 400);
    }
    
    console.log(`[webpay-confirm] Procesando token: ${token_ws}`);
    console.log(`[webpay-confirm] ID Reserva: ${reservation_id || 'No proporcionado'}`);
    console.log(`[webpay-confirm] Información del cliente:`, client_info || 'No proporcionada');
    
    // Procesar la confirmación
    const result = await processWebPayConfirmation(
      token_ws, 
      !!is_package_unit,
      reservation_id,
      client_info
    );
    
    // Devolver el resultado
    return createResponse(result);
    
  } catch (error) {
    console.error(`[webpay-confirm] Error general: ${error.message}`);
    console.error(error.stack);
    return createResponse({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    }, 500);
  }
});


// Punto de entrada para la función webpay-init
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsOptions, createResponse } from "./cors.ts";
import { processWebPayInit } from "./processors.ts";
import { TransactionInitData } from "./types.ts";

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
    let requestData: TransactionInitData;
    try {
      requestData = await req.json();
    } catch (e) {
      return createResponse({ error: 'Formato de solicitud inválido' }, 400);
    }
    
    const { reservationId, amount, origin, unit_id, client_info } = requestData;
    
    if (!reservationId || !amount || !origin) {
      return createResponse({ 
        error: 'Faltan parámetros requeridos: reservationId, amount y origin' 
      }, 400);
    }
    
    console.log(`[webpay-init] Recibida solicitud para reserva ${reservationId}`);
    if (client_info) {
      console.log(`[webpay-init] Información del cliente recibida:`, client_info);
    }
    
    // Procesar la inicialización
    const result = await processWebPayInit(requestData);
    
    // Devolver el resultado
    return createResponse(result);
    
  } catch (error) {
    console.error(`[webpay-init] Error general: ${error.message}`);
    console.error(error.stack);
    return createResponse({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    }, 500);
  }
});

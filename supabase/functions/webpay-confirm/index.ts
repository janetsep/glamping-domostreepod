
// Punto de entrada para la función webpay-confirm - simplificado
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsOptions, createResponse } from "./cors.ts";
import { processWebPayConfirmation } from "./processors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsOptions();
  }
  
  try {
    if (req.method !== 'POST') {
      return createResponse({ error: 'Solo se permite método POST' }, 405);
    }
    
    // Parsear solicitud
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error("❌ Error parseando JSON:", e);
      return createResponse({ 
        error: 'Formato de solicitud inválido',
        details: e.message
      }, 400);
    }
    
    const { token_ws, is_package_unit, reservation_id, client_info } = requestData;
    
    if (!token_ws) {
      console.error("❌ Falta token_ws");
      return createResponse({ 
        error: 'Falta el parámetro requerido: token_ws'
      }, 400);
    }
    
    console.log(`✅ [webpay-confirm] Procesando: ${token_ws}`);
    
    // Procesar la confirmación
    const result = await processWebPayConfirmation(
      token_ws, 
      !!is_package_unit,
      reservation_id,
      client_info
    );
    
    console.log(`✅ [webpay-confirm] Resultado: ${result.response_code === 0 ? 'Exitoso' : 'Fallido'}`);
    return createResponse(result);
    
  } catch (error) {
    console.error(`❌ [webpay-confirm] Error general:`, error);
    
    // Manejo especial para transacciones ya procesadas
    if (error.message?.includes("Transaction already locked")) {
      return createResponse({
        error: "Transacción ya procesada",
        details: "Esta transacción ya fue confirmada anteriormente",
        already_processing: true
      }, 409);
    }
    
    return createResponse({
      error: 'Error interno del servidor',
      details: error.message || 'Error desconocido'
    }, 500);
  }
});


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
      console.error("Error al parsear JSON de la solicitud:", e);
      const bodyText = await req.text();
      console.error("Cuerpo de la solicitud:", bodyText);
      return createResponse({ 
        error: 'Formato de solicitud inválido', 
        details: e.message,
        body: bodyText.substring(0, 200) // Truncar para evitar logs muy largos
      }, 400);
    }
    
    const { token_ws, is_package_unit, reservation_id, client_info } = requestData;
    
    if (!token_ws) {
      console.error("Solicitud sin token_ws", requestData);
      return createResponse({ 
        error: 'Falta el parámetro requerido: token_ws',
        received: requestData 
      }, 400);
    }
    
    console.log(`[webpay-confirm] Procesando token: ${token_ws}`);
    console.log(`[webpay-confirm] ID Reserva: ${reservation_id || 'No proporcionado'}`);
    console.log(`[webpay-confirm] Información del cliente:`, client_info || 'No proporcionada');
    
    // Procesar la confirmación
    try {
      const result = await processWebPayConfirmation(
        token_ws, 
        !!is_package_unit,
        reservation_id,
        client_info
      );
      
      // Devolver el resultado
      return createResponse(result);
    } catch (processingError) {
      console.error(`[webpay-confirm] Error en procesamiento:`, processingError);
      
      // Manejo especial para error de "Transaction already locked"
      if (processingError.message && processingError.message.includes("Transaction already locked")) {
        console.log("[webpay-confirm] La transacción ya está siendo procesada por otro proceso");
        
        // Devolver un mensaje más amigable e indicando que puede no ser un error real
        return createResponse({
          error: "La transacción ya está siendo procesada",
          details: processingError.message,
          already_processing: true,
          reservation_id: reservation_id
        }, 409); // Código 409 Conflict
      }
      
      return createResponse({
        error: processingError.message || 'Error al procesar la confirmación con WebPay',
        details: typeof processingError === 'object' ? JSON.stringify(processingError) : String(processingError)
      }, 500);
    }
    
  } catch (error) {
    console.error(`[webpay-confirm] Error general:`, error);
    console.error(error.stack);
    return createResponse({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor',
      details: error instanceof Error ? error.stack : 'Sin detalles'
    }, 500);
  }
});

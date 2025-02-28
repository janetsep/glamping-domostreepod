
// Implementación basada en la documentación oficial de Transbank
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Credenciales de prueba de Transbank (ambiente de integración)
const WEBPAY_COMMERCE_CODE = "597055555532";
const WEBPAY_API_KEY = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";
const WEBPAY_BASE_URL = "https://webpay3gint.transbank.cl";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    });
  }
  
  try {
    // Solo permitimos método POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método no permitido, solo POST' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Parsear el cuerpo de la solicitud
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Formato de solicitud inválido' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    const { reservationId, amount, origin } = requestData;
    
    if (!reservationId || !amount || !origin) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros requeridos: reservationId, amount y origin' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    console.log(`[webpay-init] Iniciando transacción para reserva ${reservationId}, Monto: ${amount}, Origen: ${origin}`);
    
    // Generar orden de compra única
    const buyOrder = `BO-${Date.now()}-${reservationId.substring(0, 6)}`;
    const sessionId = `SI-${Date.now()}`;
    const returnUrl = `${origin}/webpay/return`;
    
    console.log(`[webpay-init] Buy Order: ${buyOrder}, Session ID: ${sessionId}, Return URL: ${returnUrl}`);
    
    // Crear transacción - Siguiendo exactamente la documentación de Transbank
    const createTransactionUrl = `${WEBPAY_BASE_URL}/rswebpaytransaction/api/webpay/v1.2/transactions`;
    
    const transactionData = {
      buy_order: buyOrder,
      session_id: sessionId,
      amount: amount,
      return_url: returnUrl
    };
    
    console.log(`[webpay-init] Datos de creación de transacción: ${JSON.stringify(transactionData)}`);
    
    const createTransactionResponse = await fetch(createTransactionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Tbk-Api-Key-Id": WEBPAY_COMMERCE_CODE,
        "Tbk-Api-Key-Secret": WEBPAY_API_KEY
      },
      body: JSON.stringify(transactionData)
    });
    
    const createTransactionResponseText = await createTransactionResponse.text();
    console.log(`[webpay-init] Respuesta al crear transacción (texto): ${createTransactionResponseText}`);
    
    let responseData;
    try {
      responseData = JSON.parse(createTransactionResponseText);
    } catch (e) {
      console.error(`[webpay-init] Error al parsear respuesta: ${e.message}`);
      return new Response(JSON.stringify({ 
        error: 'Error al parsear respuesta de Webpay', 
        details: createTransactionResponseText 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    if (!createTransactionResponse.ok) {
      console.error(`[webpay-init] Error al crear transacción: ${JSON.stringify(responseData)}`);
      return new Response(JSON.stringify({ 
        error: 'Error al crear transacción en Webpay', 
        details: responseData 
      }), { 
        status: createTransactionResponse.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Validar que la respuesta contiene los campos esperados
    if (!responseData.token || !responseData.url) {
      console.error(`[webpay-init] Respuesta de Webpay incompleta: ${JSON.stringify(responseData)}`);
      return new Response(JSON.stringify({ 
        error: 'Respuesta de Webpay incompleta', 
        details: responseData 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Guardar detalles en Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (supabaseUrl && supabaseKey) {
      try {
        const updateData = {
          payment_details: {
            token: responseData.token,
            buy_order: buyOrder,
            session_id: sessionId,
            transaction_initiation: new Date().toISOString()
          }
        };
        
        console.log(`[webpay-init] Actualizando reserva ${reservationId} con datos: ${JSON.stringify(updateData)}`);
        
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(updateData)
        });
        
        if (!updateResponse.ok) {
          const updateResponseText = await updateResponse.text();
          console.error(`[webpay-init] Error al actualizar reserva: ${updateResponseText}`);
          // Continuamos aunque falle la actualización
        } else {
          console.log(`[webpay-init] Reserva ${reservationId} actualizada correctamente`);
        }
      } catch (error) {
        console.error(`[webpay-init] Error al actualizar reserva: ${error.message}`);
        // Continuamos aunque falle la actualización
      }
    }
    
    // Retornar datos de la transacción
    const responsePayload = {
      token: responseData.token,
      url: responseData.url,
      buy_order: buyOrder
    };
    
    console.log(`[webpay-init] Datos de respuesta: ${JSON.stringify(responsePayload)}`);
    
    return new Response(JSON.stringify(responsePayload), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error(`[webpay-init] Error general: ${error.message}`);
    console.error(error.stack);
    return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

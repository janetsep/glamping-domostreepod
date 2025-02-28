
// En esta función, implementamos la inicialización de WebPay Plus
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Para el entorno de pruebas
const WEBPAY_ENDPOINT = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions";
// Para producción usar: "https://webpay3g.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions"

const WEBPAY_API_KEY = "597055555532"; // Código de comercio de prueba
const WEBPAY_SHARED_SECRET = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"; // Clave secreta de prueba

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
    const requestData = await req.json();
    const { reservationId, amount, origin } = requestData;
    
    if (!reservationId || !amount || !origin) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros requeridos: reservationId, amount y origin' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    console.log(`Iniciando transacción WebPay: Reserva ${reservationId}, Monto: ${amount}, Origen: ${origin}`);
    
    // Crear la sesión WebPay
    const buyOrder = `BO-${Date.now()}-${reservationId.substring(0, 8)}`;
    const sessionId = `SESSION-${Date.now()}-${reservationId.substring(0, 8)}`;
    const returnUrl = `${origin}/webpay/return`;
    
    console.log(`Buy Order: ${buyOrder}, Session ID: ${sessionId}, Return URL: ${returnUrl}`);
    
    // Datos para iniciar la transacción
    const transactionData = {
      buy_order: buyOrder,
      session_id: sessionId,
      amount: amount,
      return_url: returnUrl,
    };
    
    console.log("Enviando datos a WebPay:", JSON.stringify(transactionData));
    
    // Llamada a WebPay
    const response = await fetch(WEBPAY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Tbk-Api-Key-Id': WEBPAY_API_KEY,
        'Tbk-Api-Key-Secret': WEBPAY_SHARED_SECRET,
      },
      body: JSON.stringify(transactionData),
    });
    
    // Verificar respuesta
    const responseData = await response.json();
    console.log("Respuesta de WebPay:", JSON.stringify(responseData));
    
    if (!response.ok) {
      console.error("Error en la respuesta de WebPay:", responseData);
      return new Response(JSON.stringify({ 
        error: 'Error al iniciar la transacción con WebPay', 
        details: responseData 
      }), { 
        status: response.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Actualizamos los detalles en la base de datos
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (supabaseUrl && supabaseKey) {
      try {
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            payment_details: {
              token: responseData.token,
              buy_order: buyOrder,
              session_id: sessionId,
              transaction_initiation: new Date().toISOString()
            },
          })
        });
        
        if (!updateResponse.ok) {
          console.error("Error al actualizar la reserva en Supabase:", await updateResponse.text());
        } else {
          console.log("Reserva actualizada correctamente en Supabase");
        }
      } catch (error) {
        console.error("Error al conectar con Supabase:", error);
      }
    }
    
    // Retornar los datos necesarios para redireccionar al usuario
    return new Response(JSON.stringify({
      token: responseData.token,
      url: responseData.url
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error("Error en el procesamiento:", error);
    return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

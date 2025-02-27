
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Credenciales de prueba de WebPay (Ambiente de integración)
const ENVIRONMENT = "TEST"; // TEST o LIVE
const COMMERCE_CODE = ENVIRONMENT === "TEST" ? "597055555532" : "YOUR_LIVE_COMMERCE_CODE";
const API_KEY = ENVIRONMENT === "TEST" ? "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C" : "YOUR_LIVE_API_KEY";
const WEBPAY_ENDPOINT = ENVIRONMENT === "TEST" 
  ? "https://webpay3gint.transbank.cl" 
  : "https://webpay3g.transbank.cl";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reservationId, amount, origin } = await req.json();
    console.log(`Iniciando transacción para reserva ${reservationId}, monto: ${amount}, origen: ${origin}`);

    if (!reservationId || !amount || !origin) {
      return new Response(
        JSON.stringify({ error: "Faltan parámetros requeridos (reservationId, amount, origin)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Formatear los valores correctamente
    const formattedAmount = Math.round(amount); // WebPay requiere un número entero
    const buyOrder = `BO-${reservationId}`;
    const sessionId = `session-${Date.now()}`;
    const returnUrl = `${origin}/webpay/return`;

    console.log(`Datos formateados: buyOrder=${buyOrder}, sessionId=${sessionId}, amount=${formattedAmount}, returnUrl=${returnUrl}`);

    // Iniciar transacción con WebPay usando la API REST
    const initResponse = await fetch(`${WEBPAY_ENDPOINT}/rswebpaytransaction/api/webpay/v1.2/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Tbk-Api-Key-Id": COMMERCE_CODE,
        "Tbk-Api-Key-Secret": API_KEY,
      },
      body: JSON.stringify({
        buy_order: buyOrder,
        session_id: sessionId,
        amount: formattedAmount,
        return_url: returnUrl,
      }),
    });

    // Capturar el cuerpo de la respuesta
    const responseBody = await initResponse.text();
    console.log(`Respuesta de WebPay (status ${initResponse.status}): ${responseBody}`);

    // Verificar si la respuesta es exitosa
    if (!initResponse.ok) {
      console.error(`Error al iniciar transacción con WebPay: ${responseBody}`);
      return new Response(
        JSON.stringify({ 
          error: "Error al iniciar transacción con WebPay", 
          details: responseBody,
          status: initResponse.status
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transformar la respuesta de WebPay
    const transactionData = JSON.parse(responseBody);
    console.log("Transacción iniciada con éxito:", transactionData);

    // Actualizar la reserva con el token de la transacción
    try {
      // Crear cliente de Supabase
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      
      if (!supabaseUrl || !supabaseKey) {
        console.error("Faltan variables de entorno para Supabase");
      } else {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase
          .from("reservations")
          .update({ 
            payment_details: { 
              token: transactionData.token,
              transaction_initiation: new Date().toISOString()
            }
          })
          .eq("id", reservationId);

        if (error) {
          console.error("Error al actualizar la reserva:", error);
        }
      }
    } catch (error) {
      console.error("Error al actualizar la reserva en Supabase:", error);
    }

    return new Response(JSON.stringify(transactionData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en la función webpay-init:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error interno del servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

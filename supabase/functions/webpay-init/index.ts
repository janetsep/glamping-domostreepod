
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
    console.log(`Iniciando transacción WebPay para reserva ${reservationId} por $${amount} desde ${origin}`);

    if (!reservationId || !amount || !origin) {
      console.error("Faltan parámetros necesarios:", { reservationId, amount, origin });
      return new Response(
        JSON.stringify({ error: "Faltan parámetros obligatorios (reservationId, amount, origin)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generamos un número de orden único y simple (solo números y letras)
    // Transbank requiere un buy_order alfanumérico sin caracteres especiales
    const buyOrder = `R${Date.now()}`;
    const sessionId = `S${Date.now()}`;
    
    // La URL de retorno debe ser /webpay/return (no incluyas origin/)
    const returnUrl = `${origin.endsWith("/") ? origin.slice(0, -1) : origin}/webpay/return`;

    console.log("Parámetros de inicio de transacción:", {
      buy_order: buyOrder,
      session_id: sessionId,
      amount,
      return_url: returnUrl
    });

    // Iniciar transacción en WebPay
    const response = await fetch(`${WEBPAY_ENDPOINT}/rswebpaytransaction/api/webpay/v1.2/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Tbk-Api-Key-Id": COMMERCE_CODE,
        "Tbk-Api-Key-Secret": API_KEY,
      },
      body: JSON.stringify({
        buy_order: buyOrder,
        session_id: sessionId,
        amount: amount,
        return_url: returnUrl,
      }),
    });

    const responseBody = await response.text();
    console.log(`Respuesta de WebPay (status ${response.status}): ${responseBody}`);

    if (!response.ok) {
      console.error(`Error al iniciar transacción: ${responseBody}`);
      return new Response(
        JSON.stringify({ error: "Error al iniciar transacción con WebPay", details: responseBody, status: response.status }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let transactionData;
    try {
      transactionData = JSON.parse(responseBody);
    } catch (e) {
      console.error("Error al parsear respuesta JSON de WebPay:", e);
      return new Response(
        JSON.stringify({ error: "Error al procesar respuesta de WebPay", details: responseBody }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Transacción iniciada con éxito:", transactionData);

    // Actualizar la reserva con los datos de inicio de transacción
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase
          .from("reservations")
          .update({
            payment_details: { 
              token: transactionData.token,
              url: transactionData.url,
              buy_order: buyOrder,
              session_id: sessionId,
              transaction_initiation: new Date().toISOString()
            }
          })
          .eq("id", reservationId);

        if (error) {
          console.error("Error al actualizar la reserva con datos de inicio de transacción:", error);
        } else {
          console.log(`Reserva ${reservationId} actualizada con datos de transacción`);
        }
      }
    } catch (error) {
      console.error("Error al actualizar la reserva:", error);
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


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
    const { token_ws } = await req.json();
    console.log(`Confirmando transacción con token: ${token_ws}`);

    if (!token_ws) {
      return new Response(
        JSON.stringify({ error: "Falta el token de la transacción" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Confirmar la transacción con WebPay
    const confirmResponse = await fetch(`${WEBPAY_ENDPOINT}/rswebpaytransaction/api/webpay/v1.2/transactions/${token_ws}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Tbk-Api-Key-Id": COMMERCE_CODE,
        "Tbk-Api-Key-Secret": API_KEY,
      },
    });

    // Capturar el cuerpo de la respuesta
    const responseBody = await confirmResponse.text();
    console.log(`Respuesta de confirmación de WebPay (status ${confirmResponse.status}): ${responseBody}`);

    if (!confirmResponse.ok) {
      console.error(`Error al confirmar transacción con WebPay: ${responseBody}`);
      return new Response(
        JSON.stringify({ 
          error: "Error al confirmar transacción con WebPay", 
          details: responseBody,
          status: confirmResponse.status
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transformar la respuesta de WebPay
    const transactionResult = JSON.parse(responseBody);
    console.log("Transacción confirmada:", transactionResult);

    // Actualizar la reserva en la base de datos
    if (transactionResult.buy_order) {
      try {
        const reservationId = transactionResult.buy_order.replace("BO-", "");
        console.log(`Actualizando reserva ${reservationId} con resultado de transacción`);
        
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
              status: transactionResult.response_code === 0 ? "confirmed" : "failed",
              payment_details: transactionResult,
            })
            .eq("id", reservationId);

          if (error) {
            console.error("Error al actualizar la reserva:", error);
          } else {
            console.log(`Reserva ${reservationId} actualizada correctamente`);
          }
        }
      } catch (updateError) {
        console.error("Error al procesar la actualización de la reserva:", updateError);
      }
    }

    return new Response(JSON.stringify(transactionResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en la función webpay-confirm:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error interno del servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

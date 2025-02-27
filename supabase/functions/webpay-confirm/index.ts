
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WEBPAY_URL = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions";
const TBK_API_KEY_ID = "597055555532";
const TBK_API_KEY_SECRET = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { token_ws } = await req.json();

    if (!token_ws) {
      return new Response(
        JSON.stringify({ error: "Falta el token de la transacción" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Confirmar la transacción con WebPay
    const confirmResponse = await fetch(`${WEBPAY_URL}/${token_ws}`, {
      method: "PUT",
      headers: {
        "Tbk-Api-Key-Id": TBK_API_KEY_ID,
        "Tbk-Api-Key-Secret": TBK_API_KEY_SECRET,
      },
    });

    if (!confirmResponse.ok) {
      const errorText = await confirmResponse.text();
      console.error("Error al confirmar transacción con WebPay:", errorText);
      return new Response(
        JSON.stringify({ error: "Error al confirmar transacción con WebPay", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Obtener resultado de la transacción
    const transactionResult = await confirmResponse.json();
    console.log("Transacción confirmada:", transactionResult);

    // Actualizar la reserva en la base de datos
    if (transactionResult.buy_order) {
      const reservationId = transactionResult.buy_order.replace("BO-", "");
      
      // Crear cliente de Supabase
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Actualizar la reserva
      const { error } = await supabase
        .from("reservations")
        .update({
          status: transactionResult.response_code === 0 ? "confirmed" : "failed",
          payment_details: transactionResult,
        })
        .eq("id", reservationId);

      if (error) {
        console.error("Error al actualizar la reserva:", error);
      }
    }

    return new Response(JSON.stringify(transactionResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en la función webpay-confirm:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

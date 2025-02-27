
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const WEBPAY_URL = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions";
const TBK_API_KEY_ID = "597055555532"; // Credenciales de prueba de WebPay
const TBK_API_KEY_SECRET = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Manejar la solicitud OPTIONS para CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { reservationId, amount, origin } = await req.json();

    if (!reservationId || !amount || !origin) {
      return new Response(
        JSON.stringify({ error: "Faltan parámetros requeridos (reservationId, amount, origin)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Iniciar transacción con WebPay
    const initResponse = await fetch(WEBPAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Tbk-Api-Key-Id": TBK_API_KEY_ID,
        "Tbk-Api-Key-Secret": TBK_API_KEY_SECRET,
      },
      body: JSON.stringify({
        buy_order: `BO-${reservationId}`,
        session_id: `session-${Date.now()}`,
        amount: amount,
        return_url: `${origin}/webpay/return`,
      }),
    });

    // Verificar si la respuesta es exitosa
    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      console.error("Error al iniciar transacción con WebPay:", errorText);
      return new Response(
        JSON.stringify({ error: "Error al iniciar transacción con WebPay", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transformar la respuesta de WebPay
    const transactionData = await initResponse.json();
    console.log("Transacción iniciada con éxito:", transactionData);

    return new Response(JSON.stringify(transactionData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en la función webpay-init:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

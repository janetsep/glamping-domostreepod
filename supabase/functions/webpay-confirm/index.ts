
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

    // Extraer el ID de reserva del buy_order
    // El formato buy_order ahora es "BO" seguido del ID de reserva sin caracteres especiales
    // Necesitamos recuperar el ID original de la BD
    try {
      const buyOrder = transactionResult.buy_order;
      console.log(`Buy order recibido: ${buyOrder}`);
      
      if (!buyOrder || !buyOrder.startsWith("BO")) {
        console.error("Formato de buy_order inválido:", buyOrder);
        return new Response(
          JSON.stringify({ error: "Formato de buy_order inválido", buy_order: buyOrder }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Crear cliente de Supabase
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      
      if (!supabaseUrl || !supabaseKey) {
        console.error("Faltan variables de entorno para Supabase");
        return new Response(
          JSON.stringify({ error: "Error de configuración del servidor" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Buscar la reserva que tiene este buy_order en sus payment_details
      const { data: reservations, error: searchError } = await supabase
        .from("reservations")
        .select("id, payment_details")
        .eq("status", "pending");
      
      if (searchError) {
        console.error("Error al buscar la reserva:", searchError);
        return new Response(
          JSON.stringify({ error: "Error al buscar la reserva", details: searchError }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Encontrar la reserva que coincide con el buy_order
      const reservation = reservations.find(r => 
        r.payment_details && r.payment_details.buy_order === buyOrder
      );
      
      if (!reservation) {
        console.error("No se encontró reserva con buy_order:", buyOrder);
        console.log("Reservas pendientes:", reservations);
        return new Response(
          JSON.stringify({ error: "No se encontró la reserva asociada a esta transacción" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const reservationId = reservation.id;
      console.log(`Reserva encontrada con ID: ${reservationId}`);
      
      // Actualizar la reserva
      const { error: updateError } = await supabase
        .from("reservations")
        .update({
          status: transactionResult.response_code === 0 ? "confirmed" : "failed",
          payment_details: {
            ...reservation.payment_details,
            ...transactionResult,
            confirmation_timestamp: new Date().toISOString()
          },
        })
        .eq("id", reservationId);

      if (updateError) {
        console.error("Error al actualizar la reserva:", updateError);
        return new Response(
          JSON.stringify({ error: "Error al actualizar la reserva", details: updateError }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log(`Reserva ${reservationId} actualizada correctamente`);
      
      // Añadir el ID de reserva al resultado
      transactionResult.reservation_id = reservationId;
      
    } catch (processError) {
      console.error("Error al procesar la confirmación:", processError);
      return new Response(
        JSON.stringify({ error: "Error al procesar la confirmación de pago", details: processError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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

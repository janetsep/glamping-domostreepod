
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
    console.log("Recibida solicitud de confirmación WebPay");
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
    let transactionResult;
    try {
      transactionResult = JSON.parse(responseBody);
    } catch (e) {
      console.error("Error al parsear respuesta JSON de WebPay:", e);
      return new Response(
        JSON.stringify({ error: "Error al procesar respuesta de WebPay", details: responseBody }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Transacción confirmada:", transactionResult);

    // Buscar la reserva por buy_order
    try {
      const buyOrder = transactionResult.buy_order;
      console.log(`Buy order recibido: ${buyOrder}`);
      
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
      
      // Buscar todas las reservas pendientes
      const { data: pendingReservations, error: fetchError } = await supabase
        .from("reservations")
        .select("id, payment_details")
        .eq("status", "pending");
        
      if (fetchError) {
        console.error("Error al buscar reservas pendientes:", fetchError);
        return new Response(
          JSON.stringify({ error: "Error al buscar reservas", details: fetchError }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log(`Encontradas ${pendingReservations.length} reservas pendientes`);
      
      // Encontrar la reserva correspondiente
      let reservationId = null;
      for (const reservation of pendingReservations) {
        if (reservation.payment_details && reservation.payment_details.buy_order === buyOrder) {
          reservationId = reservation.id;
          break;
        }
      }
      
      if (!reservationId) {
        console.error("No se encontró reserva con buy_order:", buyOrder);
        // Devolvemos el resultado de la transacción sin actualizar la BD
        return new Response(
          JSON.stringify(transactionResult),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log(`Reserva encontrada con ID: ${reservationId}`);
      
      // Actualizar la reserva
      const { error: updateError } = await supabase
        .from("reservations")
        .update({
          status: transactionResult.response_code === 0 ? "confirmed" : "failed",
          payment_details: {
            ...transactionResult,
            confirmation_timestamp: new Date().toISOString()
          },
        })
        .eq("id", reservationId);

      if (updateError) {
        console.error("Error al actualizar la reserva:", updateError);
      } else {
        console.log(`Reserva ${reservationId} actualizada correctamente`);
      }
      
      // Añadir el ID de reserva al resultado
      transactionResult.reservation_id = reservationId;
      
    } catch (processError) {
      console.error("Error al procesar la confirmación:", processError);
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

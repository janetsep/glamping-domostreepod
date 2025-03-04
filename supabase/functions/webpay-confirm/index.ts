
// En esta función, procesamos la confirmación del pago en WebPay Plus
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { token_ws, is_package_unit } = requestData;
    
    if (!token_ws) {
      return new Response(JSON.stringify({ error: 'Falta el token de la transacción' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    console.log(`Confirmando transacción WebPay con token: ${token_ws}`);
    
    // Llamada a WebPay para confirmar la transacción
    const response = await fetch(`${WEBPAY_ENDPOINT}/${token_ws}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Tbk-Api-Key-Id': WEBPAY_API_KEY,
        'Tbk-Api-Key-Secret': WEBPAY_SHARED_SECRET,
      },
      body: JSON.stringify({})
    });
    
    // Verificar respuesta
    const responseData = await response.json();
    console.log("Respuesta de confirmación de WebPay:", JSON.stringify(responseData));
    
    if (!response.ok) {
      console.error("Error en la respuesta de confirmación WebPay:", responseData);
      return new Response(JSON.stringify({ 
        error: 'Error al confirmar la transacción con WebPay', 
        details: responseData 
      }), { 
        status: response.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    let reservationId = null;
    
    // Buscar y actualizar la reserva en Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidas");
      return new Response(JSON.stringify({ error: 'Error de configuración del servidor' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Solo actualizar reserva en Supabase si no es una unidad de paquete
    if (!is_package_unit) {
      try {
        console.log(`Buscando reserva asociada al token: ${token_ws}`);
        
        // Buscar la reserva por el token en payment_details
        const searchResponse = await fetch(
          `${supabaseUrl}/rest/v1/reservations?select=id,status&payment_details->>token=eq.${token_ws}`, 
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!searchResponse.ok) {
          const errorText = await searchResponse.text();
          console.error(`Error al buscar la reserva: ${errorText}`);
          throw new Error(`Error en la búsqueda: ${searchResponse.status}`);
        }
        
        const reservations = await searchResponse.json();
        console.log(`Reservaciones encontradas: ${JSON.stringify(reservations)}`);
        
        if (reservations && reservations.length > 0) {
          reservationId = reservations[0].id;
          console.log(`Encontrada reserva con ID ${reservationId} para el token ${token_ws}`);
          
          // Actualizar estado de la reserva si el pago fue exitoso
          if (responseData.response_code === 0) { // 0 = pago exitoso en WebPay
            console.log(`Actualizando estado de reserva ${reservationId} a 'confirmed'`);
            
            const updateData = {
              status: 'confirmed',
              payment_details: {
                ...responseData,
                transaction_confirmed: new Date().toISOString()
              }
            };
            
            console.log(`Datos de actualización: ${JSON.stringify(updateData)}`);
            
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
              const errorText = await updateResponse.text();
              console.error(`Error al actualizar estado de la reserva: ${errorText}`);
              throw new Error(`Error en la actualización: ${updateResponse.status}`);
            } else {
              console.log(`Reserva ${reservationId} actualizada correctamente a estado 'confirmed'`);
            }
          } else {
            console.log(`Pago no exitoso, código de respuesta: ${responseData.response_code}. No se actualiza estado.`);
          }
        } else {
          console.log(`No se encontró reserva para el token ${token_ws}`);
        }
      } catch (error) {
        console.error(`Error al conectar con Supabase: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    } else {
      console.log("Reserva de paquete temporal, no se busca en la base de datos");
      // Para reservas de paquete, usamos un ID fijo o generado en la respuesta
      reservationId = "package-reservation";
    }
    
    // Añadir el ID de la reserva a la respuesta para facilitar la redirección
    return new Response(JSON.stringify({
      ...responseData,
      reservation_id: reservationId,
      is_package_unit: !!is_package_unit
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error("Error en el procesamiento de confirmación:", error);
    return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

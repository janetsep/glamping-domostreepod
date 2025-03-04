
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    });
  }
  
  try {
    // Only allow POST method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método no permitido, solo POST' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Parse the request body
    const requestData = await req.json();
    const { email, phone, name, reservationId } = requestData;
    
    if (!email || !phone || !name || !reservationId) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    console.log(`Procesando correo para reserva ${reservationId}`);
    
    // Obtener los detalles de la reserva
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    }
    
    // Buscar la reserva
    const reservationResponse = await fetch(
      `${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}&select=*,unit_id`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!reservationResponse.ok) {
      throw new Error(`Error al obtener detalles de la reserva: ${reservationResponse.status}`);
    }
    
    const reservations = await reservationResponse.json();
    
    if (!reservations || reservations.length === 0) {
      throw new Error(`No se encontró la reserva con ID ${reservationId}`);
    }
    
    const reservation = reservations[0];
    
    // Obtener detalles de la unidad
    let unitName = "Unidad desconocida";
    
    if (reservation.unit_id) {
      const unitResponse = await fetch(
        `${supabaseUrl}/rest/v1/glamping_units?id=eq.${reservation.unit_id}&select=name`, 
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (unitResponse.ok) {
        const units = await unitResponse.json();
        if (units && units.length > 0) {
          unitName = units[0].name;
        }
      }
    }
    
    // Formatear fechas
    const checkIn = new Date(reservation.check_in).toLocaleDateString('es-CL');
    const checkOut = new Date(reservation.check_out).toLocaleDateString('es-CL');
    
    // Aquí implementaríamos el envío real del correo
    console.log(`Enviando correo a ${email} con los detalles de la reserva:`);
    console.log({
      reservationId,
      unitName,
      checkIn,
      checkOut,
      guests: reservation.guests,
      totalPrice: reservation.total_price,
      status: reservation.status
    });
    
    // Registrar la comunicación en la base de datos
    await fetch(
      `${supabaseUrl}/rest/v1/reservation_communications`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email,
          phone,
          type: 'confirmation',
          reservation_details: {
            id: reservationId,
            unit_name: unitName,
            check_in: checkIn,
            check_out: checkOut,
            guests: reservation.guests,
            total_price: reservation.total_price,
            status: reservation.status
          }
        })
      }
    );
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Correo de confirmación procesado correctamente"
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error("Error en el procesamiento del correo:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

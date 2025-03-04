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
    const { email, phone, name, reservationDetails } = requestData;
    
    if (!email || !phone || !name) {
      return new Response(JSON.stringify({ error: 'Faltan datos del cliente' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Here you would implement the logic to send the email
    // For example, using a third-party email service
    console.log(`Enviando correo a ${email} con los detalles de la reserva:`, reservationDetails);
    
    // Simulate email sending
    // await emailService.sendEmail(email, name, reservationDetails);
    
    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error("Error en el procesamiento de la solicitud:", error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

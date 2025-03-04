
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReservationDetails {
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  paymentDetails: {
    authorization_code: string;
    card_number: string;
    status: string;
  };
}

interface EmailRequest {
  email: string;
  phone: string;
  reservationDetails: ReservationDetails;
}

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
    
    // Parse request body
    const { email, phone, reservationDetails }: EmailRequest = await req.json();
    
    if (!email || !phone || !reservationDetails) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    console.log(`Enviando confirmación de reserva a: ${email}, teléfono: ${phone}`);
    console.log('Detalles de la reserva:', JSON.stringify(reservationDetails));
    
    // Format dates for display
    const startDate = new Date(reservationDetails.startDate).toLocaleDateString('es-CL');
    const endDate = new Date(reservationDetails.endDate).toLocaleDateString('es-CL');
    
    // Generate email content
    const emailContent = {
      to: email,
      subject: "Confirmación de reserva - Domos TreePod",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0ea5e9;">¡Reserva Confirmada!</h1>
            <p style="font-size: 18px;">Gracias por elegir Domos TreePod para tu estadía</p>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 5px;">
            <h2 style="color: #0f172a; margin-top: 0;">Detalles de tu reserva:</h2>
            <p><strong>Fecha de entrada:</strong> ${startDate}</p>
            <p><strong>Fecha de salida:</strong> ${endDate}</p>
            <p><strong>Número de huéspedes:</strong> ${reservationDetails.guests}</p>
            <p><strong>Total pagado:</strong> $${reservationDetails.totalPrice.toLocaleString('es-CL')}</p>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 5px;">
            <h2 style="color: #0f172a; margin-top: 0;">Información del pago:</h2>
            <p><strong>Método de pago:</strong> WebPay Plus</p>
            <p><strong>Tarjeta:</strong> ${reservationDetails.paymentDetails.card_number || 'No disponible'}</p>
            <p><strong>Código de autorización:</strong> ${reservationDetails.paymentDetails.authorization_code || 'No disponible'}</p>
            <p><strong>Estado:</strong> ${reservationDetails.paymentDetails.status || 'No disponible'}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1; text-align: center;">
            <p style="margin-bottom: 5px;">¿Tienes alguna pregunta?</p>
            <p>Contáctanos al <a href="https://wa.me/56912345678" style="color: #0ea5e9; text-decoration: none;">+56 9 1234 5678</a> o responde a este correo</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #64748b;">
            <p>© 2023 Domos TreePod. Todos los derechos reservados.</p>
          </div>
        </div>
      `
    };
    
    // Log the attempt to send the email
    console.log(`Intentando enviar correo a ${email}`);
    
    // For now, just simulate sending the email since we don't have a configured email service
    // In a real implementation, we would use a service like SendGrid, Resend, or Gmail API
    // This simulation helps with testing the frontend without actual email sending
    
    console.log("Simulando envío de correo electrónico:");
    console.log("Destinatario:", emailContent.to);
    console.log("Asunto:", emailContent.subject);
    
    // Store the reservation email details in the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (supabaseUrl && supabaseKey) {
      // Store the communication in the reservation_communications table
      try {
        console.log("Guardando detalles de comunicación en la base de datos");
        const response = await fetch(`${supabaseUrl}/rest/v1/reservation_communications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            email,
            phone,
            type: 'confirmation',
            sent_at: new Date().toISOString(),
            reservation_details: reservationDetails
          })
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Error al guardar la comunicación: ${errorData}`);
        } else {
          console.log("Comunicación guardada correctamente en la base de datos");
        }
      } catch (error) {
        console.error("Error al guardar detalles de comunicación:", error);
      }
    } else {
      console.error("Variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidas");
    }
    
    // Return success response  
    return new Response(JSON.stringify({ 
      success: true,
      message: "Email simulado enviado correctamente. En producción se usaría un servicio de correo."
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error("Error en el procesamiento:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

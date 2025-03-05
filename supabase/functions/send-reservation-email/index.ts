
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Use the correct import for date formatting
import { format } from "https://deno.land/std@0.207.0/datetime/format.ts";

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
    // Get request body
    const { email, name, phone, reservationId } = await req.json();
    
    if (!email || !reservationId) {
      return new Response(
        JSON.stringify({ error: 'Email y ID de reserva son requeridos' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Get reservation details from the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Error de configuración del servidor' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Fetch reservation data
    const response = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}&select=*,units(*)`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener datos de la reserva: ${response.status}`);
    }
    
    const reservations = await response.json();
    
    if (!reservations || reservations.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Reserva no encontrada' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const reservation = reservations[0];
    const unit = reservation.units;
    
    // Create email content with detailed information about the reservation
    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #056571; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .reservation-details { margin: 20px 0; }
        .detail-row { display: flex; margin-bottom: 10px; }
        .detail-label { font-weight: bold; width: 150px; }
        .highlight { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #056571; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirmación de Reserva</h1>
        </div>
        <div class="content">
          <p>Estimado/a ${name || 'Cliente'},</p>
          <p>¡Gracias por elegir Glamping Chile! Tu reserva ha sido confirmada con éxito.</p>
          
          <div class="highlight">
            <p><strong>ID de Reserva:</strong> ${reservation.id}</p>
            <p><strong>Estado:</strong> Confirmado</p>
          </div>
          
          <div class="reservation-details">
            <h2>Detalles de la Unidad</h2>
            <div class="detail-row">
              <div class="detail-label">Unidad:</div>
              <div>${unit?.name || 'No disponible'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Check-in:</div>
              <div>${reservation.check_in ? new Date(reservation.check_in).toLocaleDateString('es-CL') : 'No disponible'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Check-out:</div>
              <div>${reservation.check_out ? new Date(reservation.check_out).toLocaleDateString('es-CL') : 'No disponible'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Huéspedes:</div>
              <div>${reservation.guests || 'No disponible'}</div>
            </div>
          </div>
          
          <div class="reservation-details">
            <h2>Detalles del Pago</h2>
            <div class="detail-row">
              <div class="detail-label">Monto Total:</div>
              <div>$${reservation.total_price ? reservation.total_price.toLocaleString('es-CL') : 'No disponible'}</div>
            </div>
            ${reservation.payment_details?.authorization_code ? `
            <div class="detail-row">
              <div class="detail-label">Código de Autorización:</div>
              <div>${reservation.payment_details.authorization_code}</div>
            </div>` : ''}
            ${reservation.payment_details?.card_detail?.card_number ? `
            <div class="detail-row">
              <div class="detail-label">Tarjeta:</div>
              <div>${reservation.payment_details.card_detail.card_number}</div>
            </div>` : ''}
          </div>
          
          <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>
          <p>¡Esperamos recibirte pronto!</p>
          <p>Saludos cordiales,<br>Equipo de Glamping Chile</p>
        </div>
        <div class="footer">
          <p>Este es un correo automático, por favor no responder directamente a este mensaje.</p>
          <p>© ${new Date().getFullYear()} Glamping Chile. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    // In a real scenario, you would use an email service like SendGrid, Resend, etc.
    // For demo purposes, we'll just return success
    
    console.log(`Simulando envío de correo a ${email} para la reserva ${reservationId}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Correo enviado correctamente',
        to: email,
        reservation_id: reservationId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error en la función send-reservation-email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error interno del servidor',
        details: typeof error === 'object' ? JSON.stringify(error) : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

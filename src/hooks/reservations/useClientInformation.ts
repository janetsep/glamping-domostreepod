
import { useState } from 'react';
import { updateReservationData, verifyReservationUpdate } from './utils/supabaseUtils';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export interface ClientInformation {
  name: string;
  email: string;
  phone: string;
}

export const useClientInformation = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveClientInformation = async (
    reservationId: string,
    clientInfo: ClientInformation
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      console.log(`Guardando información del cliente para la reserva ${reservationId}:`, clientInfo);
      
      // Verificar si la reserva existe
      const { data: existingReservation, error: checkError } = await supabase
        .from('reservations')
        .select('id, client_name, client_email, client_phone')
        .eq('id', reservationId)
        .single();
        
      if (checkError) {
        console.error('Error al verificar la reserva:', checkError);
      } else if (existingReservation) {
        console.log('Reserva encontrada:', existingReservation);
      }
      
      // Update client information in reservation
      const success = await updateReservationData(reservationId, {
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_phone: clientInfo.phone,
        updated_at: new Date().toISOString()
      });
      
      if (!success) {
        // Intentar método alternativo directo si falla el principal
        console.log('Método principal falló, intentando método alternativo directo');
        
        try {
          const { error: directError } = await supabase
            .from('reservations')
            .update({
              client_name: clientInfo.name,
              client_email: clientInfo.email,
              client_phone: clientInfo.phone,
              updated_at: new Date().toISOString()
            })
            .eq('id', reservationId);
            
          if (directError) {
            console.error('Error en método alternativo:', directError);
            throw new Error('Error al guardar información del cliente');
          } else {
            console.log('Información guardada correctamente con método alternativo');
          }
        } catch (directErr) {
          console.error('Error en método alternativo directo:', directErr);
          throw new Error('Error al guardar información del cliente');
        }
      }

      // Verificar que la información se guardó correctamente
      await verifyReservationUpdate(reservationId);

      // Register the communication
      try {
        const logCommunicationResponse = await fetch(`${SUPABASE_URL}/rest/v1/reservation_communications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            email: clientInfo.email,
            phone: clientInfo.phone,
            type: 'reservation_confirmation',
            reservation_details: {
              reservation_id: reservationId,
              client_name: clientInfo.name,
              created_at: new Date().toISOString()
            }
          })
        });
        
        if (!logCommunicationResponse.ok) {
          console.warn('No se pudo registrar la comunicación pero continuamos el proceso');
        }
      } catch (logError) {
        console.warn('Error al registrar comunicación:', logError);
      }

      // Send confirmation email
      try {
        const emailResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-reservation-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            email: clientInfo.email,
            name: clientInfo.name,
            phone: clientInfo.phone,
            reservationId
          })
        });

        if (!emailResponse.ok) {
          console.error('Error al enviar correo:', await emailResponse.text());
        } else {
          console.log('Correo de confirmación enviado correctamente');
        }
      } catch (emailErr) {
        // Do not interrupt the main flow if email sending fails
        console.error('Error al enviar correo de confirmación:', emailErr);
      }

      return true;
    } catch (err: any) {
      console.error('Error al guardar información del cliente:', err);
      setError(err.message || 'Error al guardar información del cliente');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    saveClientInformation,
    isUpdating,
    error
  };
};

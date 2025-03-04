
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';

export interface ClientInformation {
  name: string;
  email: string;
  phone: string;
}

export const useMutateReservationStatus = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReservation = async (
    reservationId: string, 
    status: 'pending' | 'confirmed' | 'cancelled',
    paymentDetails?: any
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      console.log(`Intentando actualizar reserva ${reservationId} al estado "${status}"`);
      
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (paymentDetails) {
        updateData.payment_details = paymentDetails;
      }

      // Primer intento: Usar cliente supabase
      try {
        const { error: supabaseError } = await supabase
          .from('reservations')
          .update(updateData)
          .eq('id', reservationId);
          
        if (supabaseError) {
          console.error('Error con cliente supabase:', supabaseError);
          throw supabaseError;
        }
        
        console.log(`Reserva ${reservationId} actualizada correctamente usando cliente supabase`);
      } catch (clientError) {
        console.warn('Fallo con cliente supabase, intentando con fetch directo:', clientError);
        
        // Segundo intento: Usar fetch directo
        const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${reservationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error al actualizar reserva (HTTP ${response.status}):`, errorText);
          throw new Error(`Error al actualizar reserva: ${response.status} ${errorText}`);
        }

        console.log(`Reserva ${reservationId} actualizada correctamente usando fetch directo`);
      }
      
      // Verificar que el estado se haya actualizado correctamente
      try {
        const verifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${reservationId}&select=status`, {
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        
        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          if (verifyData.length > 0) {
            console.log(`Estado actual de la reserva ${reservationId}: ${verifyData[0].status}`);
          }
        }
      } catch (verifyError) {
        console.error('Error al verificar estado final:', verifyError);
      }

      return true;
    } catch (err: any) {
      console.error('Error actualizando reserva:', err);
      setError(err.message || 'Error al actualizar la reserva');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const saveClientInformation = async (
    reservationId: string,
    clientInfo: ClientInformation
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      console.log(`Guardando información del cliente para la reserva ${reservationId}:`, clientInfo);
      
      // Primer intento: Cliente supabase
      try {
        const { error: supabaseError } = await supabase
          .from('reservations')
          .update({
            client_name: clientInfo.name,
            client_email: clientInfo.email,
            client_phone: clientInfo.phone,
            updated_at: new Date().toISOString()
          })
          .eq('id', reservationId);
          
        if (supabaseError) {
          console.error('Error con cliente supabase:', supabaseError);
          throw supabaseError;
        }
        
        console.log(`Información del cliente guardada con supabase cliente para reserva ${reservationId}`);
      } catch (clientError) {
        console.warn('Fallo con cliente supabase, intentando con fetch directo:', clientError);
      
        // Segundo intento: Fetch directo
        const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${reservationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            client_name: clientInfo.name,
            client_email: clientInfo.email,
            client_phone: clientInfo.phone,
            updated_at: new Date().toISOString()
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error al actualizar información del cliente (HTTP ${response.status}):`, errorText);
          throw new Error(`Error al actualizar información del cliente: ${response.status} ${errorText}`);
        }

        console.log(`Información del cliente guardada con fetch directo para la reserva ${reservationId}`);
      }

      // Registrar también la comunicación enviada
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

      // Enviar correo de confirmación
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
        // No interrumpimos el flujo principal si falla el envío del correo
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
    updateReservation,
    saveClientInformation,
    isUpdating,
    error
  };
};

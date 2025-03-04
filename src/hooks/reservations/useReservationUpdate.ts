
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

      // Usar directamente fetch para asegurar que se realiza la actualización
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

      console.log(`Reserva ${reservationId} actualizada correctamente a "${status}"`);
      
      // Verificar que el estado se haya actualizado correctamente
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

      return true;
    } catch (err: any) {
      console.error('Error actualizing reservation:', err);
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
      
      // Actualizar directamente la reserva para establecer la información del cliente
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

      console.log(`Información del cliente guardada correctamente para la reserva ${reservationId}`);

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

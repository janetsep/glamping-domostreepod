
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
      const updateData: any = { status };
      
      if (paymentDetails) {
        updateData.payment_details = paymentDetails;
      }

      const { error } = await supabase
        .from('reservations')
        .update(updateData)
        .eq('id', reservationId);

      if (error) {
        throw error;
      }

      return true;
    } catch (err: any) {
      console.error('Error updating reservation:', err);
      setError(err.message || 'Error updating reservation');
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
      
      // Primero actualizamos la tabla de clientes
      const { error: clientError } = await supabase
        .from('reservation_clients')
        .insert({
          id: reservationId,  // Usando el ID de la reserva como identificador
          name: clientInfo.name,
          email: clientInfo.email,
          phone: clientInfo.phone
        });

      if (clientError) {
        console.error('Error al guardar información del cliente:', clientError);
        throw clientError;
      }

      // Luego actualizamos la reserva para establecer la relación con el cliente
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({
          client_email: clientInfo.email,
          client_name: clientInfo.name,
          client_phone: clientInfo.phone
        })
        .eq('id', reservationId);

      if (reservationError) {
        console.error('Error al actualizar la reserva con información del cliente:', reservationError);
        throw reservationError;
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


import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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
      const { error } = await supabase
        .from('reservation_clients')
        .insert({
          id: reservationId,
          name: clientInfo.name,
          email: clientInfo.email,
          phone: clientInfo.phone
        });

      if (error) {
        throw error;
      }

      return true;
    } catch (err: any) {
      console.error('Error saving client information:', err);
      setError(err.message || 'Error saving client information');
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

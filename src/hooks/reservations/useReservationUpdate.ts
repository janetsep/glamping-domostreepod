
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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

  return {
    updateReservation,
    isUpdating,
    error
  };
};

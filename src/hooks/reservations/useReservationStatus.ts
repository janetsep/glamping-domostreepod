
import { useState } from 'react';
import { updateReservationData, verifyReservationUpdate } from './utils/supabaseUtils';

export const useReservationStatus = () => {
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

      const success = await updateReservationData(reservationId, updateData);
      
      if (!success) {
        throw new Error('Error al actualizar reserva');
      }
      
      // Verify update was successful
      await verifyReservationUpdate(reservationId);

      return true;
    } catch (err: any) {
      console.error('Error actualizando reserva:', err);
      setError(err.message || 'Error al actualizar la reserva');
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

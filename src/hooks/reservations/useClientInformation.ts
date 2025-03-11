
import { useState } from 'react';
import { updateReservationData, verifyReservationUpdate } from './utils/supabaseUtils';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
      console.log(`Starting to save client information for reservation ${reservationId}:`, clientInfo);
      
      // First attempt: Direct update with client
      try {
        const { data, error: updateError } = await supabase
          .from('reservations')
          .update({
            client_name: clientInfo.name,
            client_email: clientInfo.email,
            client_phone: clientInfo.phone,
            updated_at: new Date().toISOString()
          })
          .eq('id', reservationId)
          .select();
        
        if (updateError) {
          console.error('Direct update failed:', updateError);
          throw updateError;
        }

        console.log('Update successful:', data);
        
        // Verify the update
        const { data: verifyData, error: verifyError } = await supabase
          .from('reservations')
          .select('client_name, client_email, client_phone')
          .eq('id', reservationId)
          .single();
        
        if (verifyError) {
          console.error('Verification failed:', verifyError);
          throw verifyError;
        }

        console.log('Verification successful:', verifyData);
        
        // Show success toast
        toast.success('Información guardada correctamente', {
          description: 'Los datos del cliente han sido actualizados'
        });

        return true;
      } catch (directError) {
        console.error('Error in direct update:', directError);
        
        // Second attempt: Using fetch
        console.log('Attempting alternative update method');
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
          console.error('Alternative update failed:', errorText);
          throw new Error(`Error en actualización alternativa: ${errorText}`);
        }

        console.log('Alternative update successful');
        return true;
      }
    } catch (err: any) {
      console.error('Final error in saveClientInformation:', err);
      setError(err.message || 'Error al guardar información del cliente');
      
      // Show error toast
      toast.error('Error al guardar', {
        description: 'No se pudo guardar la información del cliente. Por favor, intenta nuevamente.'
      });
      
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

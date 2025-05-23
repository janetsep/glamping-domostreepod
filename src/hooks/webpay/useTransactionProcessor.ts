
import { useState } from 'react';
import { TransactionResult, confirmTransaction, updateReservationIfNeeded } from '@/services/webpay';
import { useMutateReservationStatus } from '@/hooks/reservations/useReservationUpdate';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export interface TransactionProcessingState {
  isLoading: boolean;
  transactionResult: TransactionResult | null;
  error: string | null;
  reservationId: string | null;
  isPackage: boolean;
}

export const useTransactionProcessor = () => {
  const [state, setState] = useState<TransactionProcessingState>({
    isLoading: true,
    transactionResult: null,
    error: null,
    reservationId: null,
    isPackage: false
  });
  
  const { updateReservation } = useMutateReservationStatus();

  const processTransaction = async (token: string) => {
    try {
      if (!token) {
        // Clear loading state if there's no token, likely a direct page load
        setState(prev => ({ ...prev, isLoading: false, error: 'No se encontró el token de la transacción' }));
        throw new Error('No se encontró el token de la transacción');
      }

      // Get stored data
      const isPackageUnit = localStorage.getItem('is_package_unit') === 'true';
      const storedReservationId = localStorage.getItem('current_reservation_id');
      const unitId = localStorage.getItem('current_unit_id');
      
      console.log('Processing transaction with data:', {
        token,
        isPackageUnit,
        storedReservationId,
        unitId
      });

      if (storedReservationId) {
        setState(prev => ({ ...prev, reservationId: storedReservationId, isPackage: isPackageUnit }));
        console.log(`Found reservation ID in localStorage: ${storedReservationId}`);
      }

      // Get client information
      const clientInfo = {
        name: localStorage.getItem('client_name'),
        email: localStorage.getItem('client_email'),
        phone: localStorage.getItem('client_phone')
      };
      
      console.log('Retrieved client info:', clientInfo);

      try {
        // Timeout to cancel the request if it takes too long
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('La solicitud ha caducado')), 20000);
        });

        // Get the SUPABASE_ANON_KEY from environment or constants
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
        
        // Call edge function to confirm payment
        const responsePromise = fetch('https://gtxjfmvnzrsuaxryffnt.supabase.co/functions/v1/webpay-confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify({
            token_ws: token,
            is_package_unit: isPackageUnit,
            reservation_id: storedReservationId,
            client_info: clientInfo
          })
        });
        
        // Race between the request and the timeout
        const response = await Promise.race([responsePromise, timeoutPromise]) as Response;

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response from edge function:', errorData);
          
          // Check if transaction was aborted
          if (errorData.error?.includes('Transaction has an invalid finished state: aborted')) {
            throw new Error('La transacción fue cancelada por el usuario o el banco');
          }
          
          throw new Error(errorData.error || `Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Transaction confirmed:', data);

        // Update reservation status if payment was successful
        if (data.response_code === 0 && data.reservation_id) {
          console.log(`Updating reservation ${data.reservation_id} status to confirmed`);
          
          try {
            // First attempt with updateReservation
            const success = await updateReservation(data.reservation_id, 'confirmed', data);
            
            if (!success) {
              console.warn('updateReservation failed, trying direct update');
              
              // Try direct update
              const { error: updateError } = await supabase
                .from('reservations')
                .update({ 
                  status: 'confirmed',
                  payment_details: data,
                  updated_at: new Date().toISOString()
                })
                .eq('id', data.reservation_id);
              
              if (updateError) {
                console.error('Direct update failed:', updateError);
                throw updateError;
              }
            }
            
            // Verify the update
            const { data: verifyData, error: verifyError } = await supabase
              .from('reservations')
              .select('status, payment_details')
              .eq('id', data.reservation_id)
              .single();
            
            if (verifyError) {
              console.error('Verification failed:', verifyError);
            } else {
              console.log('Verification successful:', verifyData);
            }
            
          } catch (updateError) {
            console.error('Error updating reservation status:', updateError);
          }
        }
        
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          transactionResult: data 
        }));
        
        return data;
        
      } catch (error: any) {
        console.error('Error processing transaction:', error);
        throw error;
      }
    } catch (err) {
      console.error('Final error in processTransaction:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      
      // Set a more user-friendly error message
      let userErrorMessage = 'Error en la transacción';
      if (errorMessage.includes('cancelada por el usuario')) {
        userErrorMessage = 'La transacción fue cancelada';
      } else if (errorMessage.includes('422')) {
        userErrorMessage = 'La transacción no pudo ser completada';
      } else if (errorMessage.includes('caducado')) {
        userErrorMessage = 'La solicitud ha caducado';
      }
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      toast.error(userErrorMessage, {
        description: errorMessage,
      });
      
      return null;
    }
  };

  const resetState = () => {
    setState({
      isLoading: false,
      transactionResult: null,
      error: null,
      reservationId: null,
      isPackage: false
    });
  };

  return {
    state,
    processTransaction,
    resetState
  };
};

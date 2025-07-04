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
    console.log('🔄 [processTransaction] Iniciando procesamiento de transacción con token:', token);
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Agregar timeout y manejo mejorado de errores
      console.log('🔄 [processTransaction] Confirmando transacción con WebPay...');
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: La confirmación tardó demasiado')), 30000)
      );

      const data = await Promise.race([
        confirmTransaction(token),
        timeoutPromise
      ]) as TransactionResult;
      
      console.log('✅ [processTransaction] Transacción confirmada:', JSON.stringify(data, null, 2));

      // Check if transaction was cancelled or failed
      if (data.response_code !== 0) {
        console.log('⚠️ [processTransaction] Transacción no exitosa:', data.response_code);
        
        // Handle different response codes with better messages
        let errorMessage = `Error en el pago: Código ${data.response_code}`;
        
        switch (data.response_code) {
          case -1:
            errorMessage = 'Transacción cancelada por el usuario';
            break;
          case -2:
            errorMessage = 'Transacción fallida';
            break;
          case -3:
            errorMessage = 'Error en el procesamiento';
            break;
          case -4:
            errorMessage = 'Transacción rechazada por el banco';
            break;
          case -5:
            errorMessage = 'Transacción anulada por tiempo de espera';
            break;
          default:
            if (data.response_code < 0) {
              errorMessage = 'Transacción cancelada o rechazada';
            }
        }
        
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorMessage,
          transactionResult: data
        }));
        return data;
      }

      // Usar el servicio simplificado para actualizar reservas
      if (data.response_code === 0) {
        console.log('🔄 [processTransaction] Actualizando estado de reservas...');
        await updateReservationIfNeeded(data);
      }
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        transactionResult: data 
      }));
      
      return data;
    } catch (error) {
      console.error('❌ [processTransaction] Error general:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage
      }));
      toast.error('Error en la transacción', {
        description: errorMessage
      });
      throw error;
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

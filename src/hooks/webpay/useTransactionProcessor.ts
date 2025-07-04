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
      // Confirmar la transacción con WebPay
      console.log('🔄 [processTransaction] Confirmando transacción con WebPay...');
      const data = await confirmTransaction(token);
      console.log('✅ [processTransaction] Transacción confirmada:', JSON.stringify(data, null, 2));

      // Check if transaction was cancelled or failed
      if (data.response_code !== 0) {
        console.log('⚠️ [processTransaction] Transacción no exitosa:', data.response_code);
        
        // Handle different response codes
        let errorMessage = `Error en el pago: Código ${data.response_code}`;
        
        // Common WebPay response codes
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

      // Update reservation status if payment was successful
      if (data.response_code === 0 && data.reservation_id) {
        console.log(`🔄 [processTransaction] Actualizando reserva ${data.reservation_id} a estado confirmed`);
        
        try {
          // Obtener el código de reserva primero
          console.log('🔍 [processTransaction] Buscando código de reserva...');
          const { data: primaryReservation, error: fetchError } = await supabase
            .from('reservations')
            .select('reservation_code, status')
            .eq('id', data.reservation_id)
            .single();

          if (fetchError) {
            console.error('❌ [processTransaction] Error al obtener código de reserva:', fetchError);
            throw new Error(`Error al obtener código de reserva: ${fetchError.message}`);
          }

          if (!primaryReservation?.reservation_code) {
            console.error('❌ [processTransaction] No se encontró el código de reserva');
            throw new Error('No se encontró el código de reserva');
          }

          console.log(`✅ [processTransaction] Código de reserva encontrado: ${primaryReservation.reservation_code}`);
          console.log(`📊 [processTransaction] Estado actual: ${primaryReservation.status}`);

          // Obtener todas las reservas asociadas antes de actualizar
          console.log('🔍 [processTransaction] Buscando reservas asociadas...');
          const { data: associatedReservations, error: fetchAssociatedError } = await supabase
            .from('reservations')
            .select('id, status, reservation_code')
            .eq('reservation_code', primaryReservation.reservation_code);

          if (fetchAssociatedError) {
            console.error('❌ [processTransaction] Error al obtener reservas asociadas:', fetchAssociatedError);
            throw new Error(`Error al obtener reservas asociadas: ${fetchAssociatedError.message}`);
          }

          console.log(`📊 [processTransaction] Reservas asociadas encontradas:`, associatedReservations);

          // Actualizar todas las reservas con el mismo código
          console.log('🔄 [processTransaction] Actualizando reservas...');
          const { data: updateResult, error: updateError } = await supabase
            .from('reservations')
            .update({ 
              status: 'confirmed',
              payment_details: data,
              updated_at: new Date().toISOString()
            })
            .eq('reservation_code', primaryReservation.reservation_code)
            .select();

          if (updateError) {
            console.error('❌ [processTransaction] Error al actualizar reservas:', updateError);
            throw new Error(`Error al actualizar reservas: ${updateError.message}`);
          }

          console.log('✅ [processTransaction] Resultado de la actualización:', updateResult);

          // Verificar que todas las reservas se actualizaron
          console.log('🔍 [processTransaction] Verificando actualización...');
          const { data: verifyData, error: verifyError } = await supabase
            .from('reservations')
            .select('id, status, reservation_code')
            .eq('reservation_code', primaryReservation.reservation_code);

          if (verifyError) {
            console.error('❌ [processTransaction] Error al verificar actualización:', verifyError);
            throw new Error(`Error al verificar actualización: ${verifyError.message}`);
          }

          const allConfirmed = verifyData?.every(r => r.status === 'confirmed');
          console.log('📊 [processTransaction] Verificación final:', {
            totalReservas: verifyData?.length,
            todasConfirmadas: allConfirmed,
            detalles: verifyData
          });

          if (!allConfirmed) {
            const noConfirmadas = verifyData?.filter(r => r.status !== 'confirmed');
            console.error('❌ [processTransaction] Reservas no actualizadas:', noConfirmadas);
            throw new Error(`Algunas reservas no se actualizaron: ${JSON.stringify(noConfirmadas)}`);
          }

          console.log('✅ [processTransaction] Todas las reservas actualizadas correctamente');
        } catch (updateError) {
          console.error('❌ [processTransaction] Error en actualización:', updateError);
          toast.error('Error al actualizar reservas', {
            description: updateError instanceof Error ? updateError.message : 'Error desconocido'
          });
          throw updateError;
        }
      } else {
        console.log('⚠️ [processTransaction] Pago no exitoso o sin ID de reserva:', data);
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

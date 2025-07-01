
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useReservationCreation } from "@/hooks/reservations/useReservationCreation";
import { usePayment } from "@/hooks/reservations/usePayment";
import { useUnifiedAvailabilityChecker } from "@/hooks/reservations/useUnifiedAvailabilityChecker";
import { temporaryLockManager } from "@/hooks/reservations/utils/temporaryLockManager";

export const useReservationActions = (state: any) => {
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  
  const { redirectToWebpay } = usePayment({
    setIsLoading: state.setIsProcessingPayment
  });

  const { reserveWithLock } = useUnifiedAvailabilityChecker();

  const { createReservation } = useReservationCreation({
    onSuccess: (data) => {
      console.log('✅ [useReservationActions] Reserva creada exitosamente:', data);
      
      try {
        redirectToWebpay(data.reservationId, data.amount, false, state.displayUnit?.id || '');
        console.log('✅ [useReservationActions] Redirección a WebPay iniciada');
      } catch (redirectError) {
        console.error('❌ [useReservationActions] Error en redirección a WebPay:', redirectError);
        state.setIsProcessingPayment(false);
        toast.error("Error al iniciar el pago", {
          description: "No se pudo redirigir a WebPay. Por favor, inténtalo de nuevo."
        });
      }
    },
    onError: (error) => {
      console.error('❌ [useReservationActions] Error creando reserva:', error);
      // Liberar bloqueo en caso de error
      if (state.startDate && state.endDate && state.lockedUnits) {
        temporaryLockManager.releaseLock(
          state.lockedUnits,
          state.startDate,
          state.endDate,
          sessionId
        );
      }
      state.setIsProcessingPayment(false);
      toast.error("Error al crear la reserva", {
        description: error.message
      });
    }
  });

  const handleConfirmReservation = useCallback(async () => {
    console.log('🔍 [useReservationActions] Iniciando confirmación de reserva con bloqueo temporal');
    
    if (!state.startDate || !state.endDate || !state.displayUnit) {
      toast.error("Datos incompletos para crear la reserva");
      return;
    }

    try {
      state.setIsProcessingPayment(true);

      // 1. Intentar reservar unidades con bloqueo temporal
      const lockResult = await reserveWithLock(
        state.startDate,
        state.endDate,
        state.requiredDomos,
        sessionId
      );

      if (!lockResult.success) {
        throw new Error(lockResult.error || 'No se pudieron bloquear las unidades');
      }

      console.log('🔒 [useReservationActions] Unidades bloqueadas temporalmente:', {
        unidades: lockResult.reservedUnits,
        sessionId: lockResult.sessionId
      });

      // 2. Calcular precio total
      const baseTotal = state.quote?.totalPrice || 0;
      const finalTotal = baseTotal + state.activitiesTotal + state.packagesTotal;

      // 3. Crear reserva con unidades bloqueadas
      await createReservation(
        lockResult.reservedUnits!, // Usar unidades específicamente bloqueadas
        state.startDate,
        state.endDate,
        state.guests,
        finalTotal,
        'webpay',
        state.selectedActivities.map(a => a.id),
        state.selectedPackages.map(p => p.id),
        state.requiredDomos,
        lockResult.reservedUnits, // Confirmar unidades bloqueadas
        {
          name: localStorage.getItem('client_name') || '',
          email: localStorage.getItem('client_email') || '',
          phone: localStorage.getItem('client_phone') || ''
        }
      );

    } catch (error) {
      console.error('❌ [useReservationActions] Error en handleConfirmReservation:', error);
      
      // Liberar bloqueo en caso de error
      if (state.startDate && state.endDate) {
        temporaryLockManager.releaseLock(
          state.lockedUnits || [],
          state.startDate,
          state.endDate,
          sessionId
        );
      }
      
      state.setIsProcessingPayment(false);
      toast.error("Error al procesar la reserva", {
        description: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }, [state, createReservation, reserveWithLock, sessionId]);

  return {
    handleConfirmReservation,
    sessionId
  };
};

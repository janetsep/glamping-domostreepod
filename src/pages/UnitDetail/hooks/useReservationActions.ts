
import { useCallback } from "react";
import { toast } from "sonner";
import { useReservationCreation } from "@/hooks/reservations/useReservationCreation";
import { usePayment } from "@/hooks/reservations/usePayment";

export const useReservationActions = (state: any) => {
  const { createReservation } = useReservationCreation({
    onSuccess: (data) => {
      console.log('✅ [useReservationActions] Reserva creada exitosamente:', data);
      // Redirigir a WebPay con el ID y monto de la reserva
      redirectToWebpay(data.reservationId, data.amount, false, state.displayUnit?.id || '');
    },
    onError: (error) => {
      console.error('❌ [useReservationActions] Error creando reserva:', error);
      state.setIsProcessingPayment(false);
      toast.error("Error al crear la reserva", {
        description: error.message
      });
    }
  });

  const { redirectToWebpay } = usePayment({
    setIsLoading: state.setIsProcessingPayment
  });

  const handleReservation = useCallback(async () => {
    console.log('🔍 [useReservationActions] handleReservation iniciado');
    
    if (!state.startDate || !state.endDate || !state.displayUnit) {
      toast.error("Datos incompletos para crear la reserva");
      return;
    }

    try {
      state.setIsProcessingPayment(true);

      // Calcular el precio total incluyendo extras
      const baseTotal = state.quote?.totalPrice || 0;
      const finalTotal = baseTotal + state.activitiesTotal + state.packagesTotal;

      console.log('🔍 [useReservationActions] Creando reserva con datos:', {
        unitId: state.displayUnit.id,
        checkIn: state.startDate.toISOString(),
        checkOut: state.endDate.toISOString(),
        guests: state.guests,
        finalTotal,
        requiredDomos: state.requiredDomos
      });

      // Crear la reserva primero
      await createReservation(
        [state.displayUnit.id],
        state.startDate,
        state.endDate,
        state.guests,
        finalTotal,
        'webpay',
        state.selectedActivities.map(a => a.id),
        state.selectedPackages.map(p => p.id),
        state.requiredDomos,
        [state.displayUnit.id],
        {
          name: localStorage.getItem('client_name') || '',
          email: localStorage.getItem('client_email') || '',
          phone: localStorage.getItem('client_phone') || ''
        }
      );
    } catch (error) {
      console.error('❌ [useReservationActions] Error en handleReservation:', error);
      state.setIsProcessingPayment(false);
      toast.error("Error al procesar la reserva");
    }
  }, [state, createReservation, redirectToWebpay]);

  const handleConfirmReservation = useCallback(async () => {
    console.log('🔍 [useReservationActions] handleConfirmReservation - Iniciando pago con WebPay');
    await handleReservation();
  }, [handleReservation]);

  return {
    handleReservation,
    handleConfirmReservation
  };
};

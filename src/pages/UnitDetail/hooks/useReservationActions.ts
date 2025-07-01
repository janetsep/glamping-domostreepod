
import { useCallback } from "react";
import { toast } from "sonner";
import { useReservationCreation } from "@/hooks/reservations/useReservationCreation";
import { usePayment } from "@/hooks/reservations/usePayment";
import { useAvailabilityManager } from "@/hooks/reservations/useAvailabilityManager";

export const useReservationActions = (state: any) => {
  const { redirectToWebpay } = usePayment({
    setIsLoading: state.setIsProcessingPayment
  });

  const { checkRealTimeAvailability } = useAvailabilityManager();

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
      state.setIsProcessingPayment(false);
      toast.error("Error al crear la reserva", {
        description: error.message
      });
    }
  });

  const handleConfirmReservation = useCallback(async () => {
    console.log('🔍 [useReservationActions] Iniciando confirmación de reserva');
    
    if (!state.startDate || !state.endDate || !state.displayUnit) {
      toast.error("Datos incompletos para crear la reserva");
      return;
    }

    try {
      state.setIsProcessingPayment(true);

      // Verificar disponibilidad en tiempo real antes de proceder
      const availability = await checkRealTimeAvailability(
        state.startDate,
        state.endDate,
        state.requiredDomos
      );

      if (!availability.isAvailable) {
        throw new Error(
          `No hay suficientes domos disponibles. Se necesitan ${state.requiredDomos}, solo hay ${availability.availableUnits} disponibles.`
        );
      }

      // Calcular precio total
      const baseTotal = state.quote?.totalPrice || 0;
      const finalTotal = baseTotal + state.activitiesTotal + state.packagesTotal;

      console.log('🔍 [useReservationActions] Creando reserva con verificación:', {
        requiredDomos: state.requiredDomos,
        availableUnits: availability.availableUnits,
        finalTotal,
        availableUnitIds: availability.availableUnitIds
      });

      // Crear reserva con unidades verificadas
      await createReservation(
        [], // Array vacío - el sistema usará availableUnitIds
        state.startDate,
        state.endDate,
        state.guests,
        finalTotal,
        'webpay',
        state.selectedActivities.map(a => a.id),
        state.selectedPackages.map(p => p.id),
        state.requiredDomos,
        availability.availableUnitIds, // Pasar unidades verificadas
        {
          name: localStorage.getItem('client_name') || '',
          email: localStorage.getItem('client_email') || '',
          phone: localStorage.getItem('client_phone') || ''
        }
      );

    } catch (error) {
      console.error('❌ [useReservationActions] Error en handleConfirmReservation:', error);
      state.setIsProcessingPayment(false);
      toast.error("Error al procesar la reserva", {
        description: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }, [state, createReservation, checkRealTimeAvailability]);

  return {
    handleConfirmReservation
  };
};

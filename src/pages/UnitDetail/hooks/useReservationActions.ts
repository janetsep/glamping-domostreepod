
import { useCallback } from "react";
import { toast } from "sonner";
import { useReservationCreation } from "@/hooks/reservations/useReservationCreation";
import { usePayment } from "@/hooks/reservations/usePayment";

export const useReservationActions = (state: any) => {
  const { redirectToWebpay } = usePayment({
    setIsLoading: state.setIsProcessingPayment
  });

  const { createReservation } = useReservationCreation({
    onSuccess: (data) => {
      console.log('✅ [useReservationActions] Reserva creada exitosamente:', data);
      console.log('🔄 [useReservationActions] Iniciando redirección a WebPay...');
      
      // Redirigir a WebPay inmediatamente después de crear la reserva
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
    console.log('🔍 [useReservationActions] handleConfirmReservation - Iniciando reserva múltiple');
    
    if (!state.startDate || !state.endDate || !state.displayUnit) {
      toast.error("Datos incompletos para crear la reserva");
      return;
    }

    // Verificar disponibilidad antes de proceder
    if (state.availableDomos !== undefined && state.requiredDomos > state.availableDomos) {
      toast.error(`No hay suficientes domos disponibles. Se necesitan ${state.requiredDomos} domos, pero solo hay ${state.availableDomos} disponibles.`);
      return;
    }

    try {
      state.setIsProcessingPayment(true);

      // Calcular el precio total incluyendo extras
      const baseTotal = state.quote?.totalPrice || 0;
      const finalTotal = baseTotal + state.activitiesTotal + state.packagesTotal;

      console.log('🔍 [useReservationActions] Creando reserva múltiple con datos:', {
        requiredDomos: state.requiredDomos,
        availableDomos: state.availableDomos,
        checkIn: state.startDate.toISOString(),
        checkOut: state.endDate.toISOString(),
        guests: state.guests,
        finalTotal
      });

      // CAMBIO IMPORTANTE: En lugar de pasar solo displayUnit.id, 
      // pasamos un array vacío para que el sistema seleccione automáticamente
      // las unidades disponibles según requiredDomos
      await createReservation(
        [], // Array vacío para que el sistema seleccione automáticamente
        state.startDate,
        state.endDate,
        state.guests,
        finalTotal,
        'webpay',
        state.selectedActivities.map(a => a.id),
        state.selectedPackages.map(p => p.id),
        state.requiredDomos, // Pasar el número correcto de domos requeridos
        undefined, // No pre-especificar unidades disponibles
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
  }, [state, createReservation]);

  return {
    handleConfirmReservation
  };
};

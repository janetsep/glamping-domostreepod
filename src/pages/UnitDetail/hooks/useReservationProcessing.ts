import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";

type ReservationState = {
  displayUnit: any;
  startDate?: Date;
  endDate?: Date;
  guests: number;
  requiredDomos?: number;
  quote: any;
  selectedActivities: any[];
  selectedPackages: any[];
  createReservation: any;
  redirectToWebpay: any;
  setIsProcessingPayment: (isProcessing: boolean) => void;
  refetchAvailability: () => void;
};

export const useReservationProcessing = (state: ReservationState) => {
  const handleConfirmReservation = async () => {
    if (!state.displayUnit || !state.startDate || !state.endDate || !state.quote) return;

    try {
      state.setIsProcessingPayment(true);
      clearAllToasts();
      toast.dismiss();
      
      const requiredDomos = state.requiredDomos || 1;
      
      // Eliminamos las validaciones que involucran adultos y niños
      
      const activityIds = state.selectedActivities.map(a => a.id);
      const packageIds = state.selectedPackages.map(p => p.id);
      
      // CORRECCIÓN: Crear UNA sola reserva con la cantidad total de huéspedes y precio total.
      // La lógica de asociar a domos específicos debe ocurrir en el backend/AvailabilityManager.
      const reservation = await state.createReservation(
        state.displayUnit.id,
        state.startDate,
        state.endDate,
        state.guests, // Pasar el total de huéspedes
        state.quote.totalPrice, // Pasar el precio total
        'webpay',
        activityIds,
        packageIds,
        requiredDomos // Asegurarse de pasar requiredDomos
      );
      
      // Redirigir a Webpay si la reserva fue creada exitosamente
      if (reservation) {
        state.redirectToWebpay(reservation.reservationId, reservation.amount);
        // Forzar un refresco de los datos de disponibilidad después de crear la reserva
        // Esto actualizará el calendario y otras vistas que usen estos datos.
        state.refetchAvailability();
      }
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
    } finally {
      state.setIsProcessingPayment(false);
    }
  };

  return {
    handleConfirmReservation
  };
};

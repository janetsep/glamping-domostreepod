
import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";

type ReservationState = {
  displayUnit: any;
  startDate?: Date;
  endDate?: Date;
  guests: number;
  adults?: number;
  requiredDomos?: number;
  quote: any;
  selectedActivities: any[];
  selectedPackages: any[];
  createReservation: any;
  redirectToWebpay: any;
  setIsProcessingPayment: (isProcessing: boolean) => void;
};

export const useReservationProcessing = (state: ReservationState) => {
  const handleConfirmReservation = async () => {
    if (!state.displayUnit || !state.startDate || !state.endDate || !state.quote) return;

    try {
      state.setIsProcessingPayment(true);
      clearAllToasts();
      toast.dismiss();
      
      const requiredDomos = state.requiredDomos || 1;
      
      // Validar que haya al menos un adulto por domo requerido
      if ((state.adults || 0) < requiredDomos) {
        toast.error(`Se necesitan ${requiredDomos} domos. Debe haber al menos ${requiredDomos} adultos (uno por domo).`);
        state.setIsProcessingPayment(false);
        return;
      }
      
      // Validar que si hay 16 huéspedes, al menos 4 sean adultos
      if (state.guests === 16 && (state.adults || 0) < 4) {
        toast.error("Para 16 huéspedes, se requieren al menos 4 adultos (uno por domo).");
        state.setIsProcessingPayment(false);
        return;
      }
      
      const activityIds = state.selectedActivities.map(a => a.id);
      const packageIds = state.selectedPackages.map(p => p.id);
      
      const reservations = [];
      for (let i = 0; i < requiredDomos; i++) {
        const individualQuotePrice = state.quote.totalPrice / requiredDomos;
        
        const reservation = await state.createReservation(
          state.displayUnit.id,
          state.startDate,
          state.endDate,
          Math.ceil(state.guests / requiredDomos),
          individualQuotePrice,
          'webpay',
          i === 0 ? activityIds : [],
          i === 0 ? packageIds : []
        );
        
        if (reservation) {
          reservations.push(reservation);
        }
      }
      
      if (reservations.length > 0) {
        state.redirectToWebpay(reservations[0].id, state.quote.totalPrice);
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


import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { UnitDetailState } from "./useUnitDetailState";

export const useQuoteCalculation = (state: UnitDetailState) => {
  const checkAvailabilityAndQuote = async () => {
    if (!state.startDate || !state.endDate || !state.displayUnit) return;

    const requiredDomos = state.requiredDomos || 1;
    
    // Validar que haya al menos un adulto por domo requerido
    if (state.adults < requiredDomos) {
      toast.error(`Se necesitan ${requiredDomos} domos. Debe haber al menos ${requiredDomos} adultos (uno por domo).`);
      return;
    }
    
    // Validar que si hay 16 huéspedes, al menos 4 sean adultos
    if (state.guests === 16 && (state.adults || 0) < 4) {
      toast.error("Para 16 huéspedes, se requieren al menos 4 adultos (uno por domo).");
      return;
    }

    let quoteDetails = state.calculateQuote(
      state.displayUnit.prices,
      state.startDate,
      state.endDate,
      state.guests
    );
    
    quoteDetails.basePrice = quoteDetails.basePrice * requiredDomos;
    quoteDetails.totalPrice = quoteDetails.totalPrice * requiredDomos;
    quoteDetails.requiredDomos = requiredDomos;
    
    if (state.selectedActivities.length > 0 || state.selectedPackages.length > 0) {
      const totalWithExtras = quoteDetails.totalPrice + state.activitiesTotal + state.packagesTotal;
      
      quoteDetails = {
        ...quoteDetails,
        totalPrice: totalWithExtras
      };
    }
    
    state.setQuote(quoteDetails);
    state.setShowQuote(true);
    state.setReservationTab("summary");
  };

  return {
    checkAvailabilityAndQuote
  };
};

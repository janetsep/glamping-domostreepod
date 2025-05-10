
import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { QuoteState } from "./useQuoteBase";

export const useQuoteCalculation = (state: QuoteState) => {
  const checkAvailabilityAndQuote = async () => {
    if (!state.startDate || !state.endDate || !state.displayUnit) return;

    const requiredDomos = state.requiredDomos || 1;

    let quoteDetails = state.calculateQuote(
      state.displayUnit.prices,
      state.startDate,
      state.endDate,
      state.guests,
      requiredDomos
    );
    
    // Ya no necesitamos multiplicar el precio base por el número de domos aquí
    // porque ahora lo hacemos directamente en calculateQuote con el cálculo preciso
    // basado en la distribución de huéspedes
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

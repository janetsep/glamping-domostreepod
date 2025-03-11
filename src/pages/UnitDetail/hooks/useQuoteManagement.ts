
import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Activity, ThemedPackage } from "@/types";

type QuoteState = {
  startDate?: Date;
  endDate?: Date;
  displayUnit: any;
  guests: number;
  adults?: number;
  isAvailable: boolean | null;
  requiredDomos?: number;
  calculateQuote: any;
  setQuote: (quote: any) => void;
  setShowQuote: (show: boolean) => void;
  setReservationTab: (tab: string) => void;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  activitiesTotal: number;
  packagesTotal: number;
};

export const useQuoteManagement = (state: QuoteState) => {
  const handleNewQuote = () => {
    state.setShowQuote(false);
    state.setReservationTab("dates");
  };

  const getUpdatedQuoteTotal = () => {
    if (!state.quote) return 0;
    return state.quote.totalPrice + state.activitiesTotal + state.packagesTotal;
  };

  const checkAvailabilityAndQuote = async () => {
    if (!state.startDate || !state.endDate || !state.displayUnit) return;

    const requiredDomos = state.requiredDomos || 1;
    
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
    handleNewQuote,
    getUpdatedQuoteTotal,
    checkAvailabilityAndQuote
  };
};

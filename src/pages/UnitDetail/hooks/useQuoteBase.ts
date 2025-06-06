
import { Activity, ThemedPackage } from "@/types";

export type QuoteState = {
  startDate?: Date;
  endDate?: Date;
  displayUnit: any;
  guests: number;
  isAvailable: boolean | null;
  requiredDomos?: number;
  availableDomos?: number; // Añadimos esta propiedad para rastrear el número de domos disponibles
  calculateQuote: any;
  setQuote: (quote: any) => void;
  setShowQuote: (show: boolean) => void;
  setReservationTab: (tab: string) => void;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  activitiesTotal: number;
  packagesTotal: number;
  quote: any;
};

export const useQuoteBase = (state: QuoteState) => {
  const getUpdatedQuoteTotal = () => {
    if (!state.quote) return 0;
    return state.quote.totalPrice + state.activitiesTotal + state.packagesTotal;
  };

  return {
    getUpdatedQuoteTotal
  };
};

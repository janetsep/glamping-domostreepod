
import { QuoteState } from "./useQuoteBase";

export const useQuoteNavigation = (state: QuoteState) => {
  const handleNewQuote = () => {
    state.setShowQuote(false);
    state.setReservationTab("dates");
    
    // Mantenemos las fechas y datos de huéspedes al crear una nueva cotización
    // Los valores ya persisten en el estado del componente principal
  };

  return {
    handleNewQuote
  };
};

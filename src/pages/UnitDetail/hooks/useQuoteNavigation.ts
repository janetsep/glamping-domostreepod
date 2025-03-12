
import { QuoteState } from "./useQuoteBase";

export const useQuoteNavigation = (state: QuoteState) => {
  const handleNewQuote = () => {
    state.setShowQuote(false);
    state.setReservationTab("dates");
  };

  return {
    handleNewQuote
  };
};

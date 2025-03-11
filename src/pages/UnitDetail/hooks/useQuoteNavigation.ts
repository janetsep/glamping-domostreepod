
import { UnitDetailState } from "./useUnitDetailState";

export const useQuoteNavigation = (state: UnitDetailState) => {
  const handleNewQuote = () => {
    state.setShowQuote(false);
    state.setReservationTab("dates");
  };

  return {
    handleNewQuote
  };
};

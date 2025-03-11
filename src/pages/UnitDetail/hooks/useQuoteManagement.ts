
import { UnitDetailState } from "./useUnitDetailState";
import { useQuoteBase } from "./useQuoteBase";
import { useQuoteNavigation } from "./useQuoteNavigation";
import { useQuoteCalculation } from "./useQuoteCalculation";

export const useQuoteManagement = (state: UnitDetailState) => {
  const { getUpdatedQuoteTotal } = useQuoteBase(state);
  const { handleNewQuote } = useQuoteNavigation(state);
  const { checkAvailabilityAndQuote } = useQuoteCalculation(state);

  return {
    handleNewQuote,
    getUpdatedQuoteTotal,
    checkAvailabilityAndQuote
  };
};

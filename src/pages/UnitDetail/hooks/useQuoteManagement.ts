
import { Activity, ThemedPackage } from "@/types";
import { useQuoteBase, QuoteState } from "./useQuoteBase";
import { useQuoteNavigation } from "./useQuoteNavigation";
import { useQuoteCalculation } from "./useQuoteCalculation";

export const useQuoteManagement = (state: QuoteState) => {
  const { getUpdatedQuoteTotal } = useQuoteBase(state);
  const { handleNewQuote } = useQuoteNavigation(state);
  const { checkAvailabilityAndQuote } = useQuoteCalculation(state);

  return {
    handleNewQuote,
    getUpdatedQuoteTotal,
    checkAvailabilityAndQuote
  };
};

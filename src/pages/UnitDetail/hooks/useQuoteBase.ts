
import { toast } from "sonner";
import { UnitDetailState } from "./useUnitDetailState";

export const useQuoteBase = (state: UnitDetailState) => {
  const getUpdatedQuoteTotal = () => {
    if (!state.quote) return 0;
    return state.quote.totalPrice + state.activitiesTotal + state.packagesTotal;
  };

  return {
    getUpdatedQuoteTotal
  };
};

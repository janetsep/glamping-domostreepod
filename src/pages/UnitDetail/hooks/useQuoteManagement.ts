
import { useQuoteState } from "./quote/useQuoteState";
import { useQuoteTotal } from "./quote/useQuoteTotal";
import { useQuoteAvailability } from "./quote/useQuoteAvailability";

type ReservationState = {
  startDate?: Date;
  endDate?: Date;
  displayUnit: any;
  quote: any;
  setQuote: (quote: any) => void;
  setShowQuote: (show: boolean) => void;
  activitiesTotal: number;
  packagesTotal: number;
};

export const useQuoteManagement = (state: ReservationState) => {
  const { handleNewQuote } = useQuoteState({
    quote: state.quote,
    setQuote: state.setQuote,
    setShowQuote: state.setShowQuote
  });

  const { getUpdatedQuoteTotal } = useQuoteTotal({
    quote: state.quote,
    activitiesTotal: state.activitiesTotal,
    packagesTotal: state.packagesTotal
  });

  const { checkAvailabilityAndQuote } = useQuoteAvailability({
    startDate: state.startDate,
    endDate: state.endDate,
    displayUnit: state.displayUnit,
    setQuote: state.setQuote,
    setShowQuote: state.setShowQuote
  });

  return {
    handleNewQuote,
    getUpdatedQuoteTotal,
    checkAvailabilityAndQuote,
  };
};

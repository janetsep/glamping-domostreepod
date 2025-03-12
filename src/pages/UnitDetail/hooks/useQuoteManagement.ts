import { toast } from "sonner";

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
  const { startDate, endDate, displayUnit, quote, setQuote, setShowQuote } = state;

  const handleNewQuote = () => {
    setQuote(null);
    setShowQuote(false);
  };

  const getUpdatedQuoteTotal = () => {
    if (!quote) return 0;
    return quote.totalPrice + state.activitiesTotal + state.packagesTotal;
  };

  const checkAvailabilityAndQuote = async () => {
    if (!startDate || !endDate || !displayUnit) {
      toast.error("Por favor selecciona las fechas de entrada y salida");
      return;
    }

    // Calculate number of nights (can be 1 for one-night stays)
    const nights = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const basePrice = displayUnit.prices.base_price || 0;
    const totalPrice = basePrice * nights;

    const newQuote = {
      nights,
      pricePerNight: basePrice,
      totalPrice,
      breakdown: [
        {
          description: `${nights} ${nights === 1 ? 'noche' : 'noches'} x ${basePrice.toLocaleString('es-CL')}`,
          amount: totalPrice,
        },
      ],
    };

    setQuote(newQuote);
    setShowQuote(true);

    toast.success("Cotización actualizada");
  };

  return {
    handleNewQuote,
    getUpdatedQuoteTotal,
    checkAvailabilityAndQuote,
  };
};

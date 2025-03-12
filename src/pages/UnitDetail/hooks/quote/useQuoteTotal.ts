
type QuoteTotalProps = {
  quote: any;
  activitiesTotal: number;
  packagesTotal: number;
};

export const useQuoteTotal = ({ quote, activitiesTotal, packagesTotal }: QuoteTotalProps) => {
  const getUpdatedQuoteTotal = () => {
    if (!quote) return 0;
    return quote.totalPrice + activitiesTotal + packagesTotal;
  };

  return {
    getUpdatedQuoteTotal
  };
};

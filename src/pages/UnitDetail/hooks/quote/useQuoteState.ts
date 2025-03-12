
import { toast } from "sonner";

type QuoteStateProps = {
  quote: any;
  setQuote: (quote: any) => void;
  setShowQuote: (show: boolean) => void;
};

export const useQuoteState = ({ quote, setQuote, setShowQuote }: QuoteStateProps) => {
  const handleNewQuote = () => {
    setQuote(null);
    setShowQuote(false);
  };

  return {
    handleNewQuote
  };
};

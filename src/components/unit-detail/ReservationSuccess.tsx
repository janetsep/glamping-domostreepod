
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { reservationSuccessContent } from "@/data/siteContent";

interface ReservationSuccessProps {
  onNewQuote: () => void;
}

export const ReservationSuccess: React.FC<ReservationSuccessProps> = ({ onNewQuote }) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-green-600 mb-4">
        {reservationSuccessContent.successMessage}
      </p>
      <Button onClick={onNewQuote} variant="outline" className="flex items-center gap-2">
        <RefreshCcw size={16} />
        {reservationSuccessContent.newReservationButton}
      </Button>
    </div>
  );
};

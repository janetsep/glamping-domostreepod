
import { useState } from "react";

export const useReservationState = () => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isReservationConfirmed, setIsReservationConfirmed] = useState(false);
  const [confirmedReservationId, setConfirmedReservationId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [reservationTab, setReservationTab] = useState("dates");
  const [checkedAvailability, setCheckedAvailability] = useState(false);

  const getCurrentStep = (showQuote: boolean): number => {
    if (isReservationConfirmed) return 4;
    if (showQuote) return 3;
    if (checkedAvailability) return 2;
    return 1;
  };

  return {
    isProcessingPayment,
    isReservationConfirmed,
    confirmedReservationId,
    paymentDetails,
    reservationTab,
    checkedAvailability,
    setIsProcessingPayment,
    setIsReservationConfirmed,
    setReservationTab,
    setCheckedAvailability,
    getCurrentStep
  };
};

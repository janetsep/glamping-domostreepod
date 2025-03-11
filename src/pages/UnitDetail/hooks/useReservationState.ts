
import { useState, useRef } from "react";

export const useReservationState = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(1);
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [requiredDomos, setRequiredDomos] = useState<number>(1);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [showQuote, setShowQuote] = useState(false);
  const [isReservationConfirmed, setIsReservationConfirmed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkedAvailability, setCheckedAvailability] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [reservationTab, setReservationTab] = useState("dates");
  const [confirmedReservationId, setConfirmedReservationId] = useState<string | null>(null);
  const [clientInformation, setClientInformation] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({
    name: '',
    email: '',
    phone: ''
  });
  const confirmationRef = useRef<HTMLDivElement>(null);
  const [isPartialAvailability, setPartialAvailability] = useState<boolean>(false);
  const [availableDomos, setAvailableDomos] = useState<number>(0);
  const [alternativeDates, setAlternativeDates] = useState<{startDate: Date, endDate: Date}[]>([]);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    guests,
    setGuests,
    adults,
    setAdults,
    children,
    setChildren,
    requiredDomos,
    setRequiredDomos,
    isAvailable,
    setIsAvailable,
    showQuote,
    setShowQuote,
    isReservationConfirmed,
    setIsReservationConfirmed,
    isProcessingPayment,
    setIsProcessingPayment,
    checkedAvailability,
    setCheckedAvailability,
    paymentDetails,
    setPaymentDetails,
    reservationTab,
    setReservationTab,
    confirmedReservationId,
    setConfirmedReservationId,
    clientInformation,
    setClientInformation,
    confirmationRef,
    isPartialAvailability,
    setPartialAvailability,
    availableDomos,
    setAvailableDomos,
    alternativeDates,
    setAlternativeDates
  };
};

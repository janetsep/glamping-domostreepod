
import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Activity, ThemedPackage } from "@/types";
import { useExtrasManagement } from "./useExtrasManagement";
import { useAvailabilityCheck } from "./useAvailabilityCheck";
import { useQuoteManagement } from "./useQuoteManagement";
import { useReservationProcessing } from "./useReservationProcessing";

type ReservationState = {
  startDate?: Date;
  endDate?: Date;
  displayUnit: any;
  guests: number;
  adults: number;
  children: number;
  requiredDomos?: number;
  isAvailable: boolean | null;
  availableDomos: number;
  isPartialAvailability: boolean;
  alternativeDates: { startDate: Date; endDate: Date }[];
  showQuote: boolean;
  quote: any;
  isProcessingPayment: boolean;
  isReservationConfirmed: boolean;
  confirmedReservationId: string | null;
  paymentDetails: any;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  activitiesTotal: number;
  packagesTotal: number;
  reservationTab: string;
  checkedAvailability: boolean;
  
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setGuests: (guests: number) => void;
  setAdults: (adults: number) => void;
  setChildren: (children: number) => void;
  setIsAvailable: (available: boolean | null) => void;
  setShowQuote: (show: boolean) => void;
  setQuote: (quote: any) => void;
  setIsProcessingPayment: (processing: boolean) => void;
  setIsReservationConfirmed: (confirmed: boolean) => void;
  setSelectedActivities: (activities: Activity[]) => void;
  setSelectedPackages: (packages: ThemedPackage[]) => void;
  setReservationTab: (tab: string) => void;
  setCheckedAvailability: (checked: boolean) => void;
  
  checkAvailability: (guests: number, startDate: Date, endDate: Date, forceRefresh?: boolean) => Promise<{ isAvailable: boolean; availableDomes: number; requiredDomos: number; error?: string }>;
  calculateQuote: any;
  createReservation: any;
  redirectToWebpay: any;
  refetchAvailability?: () => void;
};

export const useReservationActions = (state: ReservationState) => {
  // Use all the separate hooks
  const { handleActivityToggle, handlePackageToggle } = useExtrasManagement(state);
  const { checkDatesAvailability } = useAvailabilityCheck(state);
  const { handleNewQuote, getUpdatedQuoteTotal, checkAvailabilityAndQuote } = useQuoteManagement(state);
  const { handleConfirmReservation } = useReservationProcessing(state);

  const handleReservation = async () => {
    if (!state.startDate || !state.endDate) {
      toast.error("Por favor selecciona las fechas de entrada y salida");
      return;
    }

    await checkAvailabilityAndQuote();
  };

  return {
    handleActivityToggle,
    handlePackageToggle,
    checkDatesAvailability,
    handleReservation,
    handleNewQuote,
    handleConfirmReservation,
    getUpdatedQuoteTotal
  };
};

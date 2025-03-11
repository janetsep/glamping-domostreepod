
import { useReservationState } from "./useReservationState";
import { useQuoteState } from "./useQuoteState";
import { useUnitFetching } from "./useUnitFetching";
import { useReservationEffects } from "./useReservationEffects";
import { useReservations } from "@/hooks/reservations";
import { useToast } from "@/components/ui/use-toast";

export interface UnitDetailState {
  startDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  endDate?: Date;
  setEndDate: (date: Date | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void;
  adults: number;
  setAdults: (adults: number) => void;
  children: number;
  setChildren: (children: number) => void;
  requiredDomos: number;
  checkAvailability: any;
  calculateQuote: any;
  createReservation: any;
  redirectToWebpay: any;
  toast: any;
  quote: any;
  setQuote: (quote: any) => void;
  isAvailable: boolean | null;
  setIsAvailable: (isAvailable: boolean) => void;
  showQuote: boolean;
  setShowQuote: (showQuote: boolean) => void;
  isReservationConfirmed: boolean;
  setIsReservationConfirmed: (isConfirmed: boolean) => void;
  displayUnit: any | null;
  isProcessingPayment: boolean;
  setIsProcessingPayment: (isProcessing: boolean) => void;
  paymentDetails: any;
  setPaymentDetails: (details: any) => void;
  checkedAvailability: boolean;
  setCheckedAvailability: (checked: boolean) => void;
  selectedActivities: any[];
  setSelectedActivities: React.Dispatch<React.SetStateAction<any[]>>;
  selectedPackages: any[];
  setSelectedPackages: React.Dispatch<React.SetStateAction<any[]>>;
  activitiesTotal: number;
  packagesTotal: number;
  reservationTab: string;
  setReservationTab: (tab: string) => void;
  confirmedReservationId: string | null;
  setConfirmedReservationId: (id: string | null) => void;
  clientInformation: {
    name: string;
    email: string;
    phone: string;
  };
  setClientInformation: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
  }>>;
  confirmationRef: React.RefObject<HTMLDivElement>;
  isPartialAvailability: boolean;
  setPartialAvailability: (isPartial: boolean) => void;
  availableDomos: number;
  setAvailableDomos: (availableDomos: number) => void;
  alternativeDates: {startDate: Date, endDate: Date}[];
  setAlternativeDates: React.Dispatch<React.SetStateAction<{startDate: Date, endDate: Date}[]>>;
}

export const useUnitDetailState = (unitId: string | undefined): UnitDetailState => {
  // Use our custom hooks
  const reservationState = useReservationState();
  const quoteState = useQuoteState();
  const { displayUnit } = useUnitFetching(unitId);
  const { checkAvailability, calculateQuote, createReservation, redirectToWebpay } = useReservations();
  const { toast } = useToast();

  // Set up effects
  useReservationEffects({
    guests: reservationState.guests,
    setRequiredDomos: reservationState.setRequiredDomos,
    selectedActivities: quoteState.selectedActivities,
    selectedPackages: quoteState.selectedPackages,
    setActivitiesTotal: quoteState.setActivitiesTotal,
    setPackagesTotal: quoteState.setPackagesTotal,
    isReservationConfirmed: reservationState.isReservationConfirmed,
    confirmationRef: reservationState.confirmationRef
  });

  // Combine all the state
  return {
    // From reservationState
    ...reservationState,
    // From quoteState
    ...quoteState,
    // From other hooks
    displayUnit,
    checkAvailability,
    calculateQuote,
    createReservation,
    redirectToWebpay,
    toast
  };
};

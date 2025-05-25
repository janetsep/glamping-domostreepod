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
  requiredDomos?: number;
  isAvailable: boolean | null;
  setIsAvailable: (isAvailable: boolean) => void;
  checkAvailability: (guests: number, startDate: Date, endDate: Date, forceRefresh?: boolean) => Promise<{ isAvailable: boolean; availableDomes: number; requiredDomos: number; error?: string }>;
  calculateQuote: any;
  setQuote: (quote: any) => void;
  setShowQuote: (show: boolean) => void;
  selectedActivities: Activity[];
  setSelectedActivities: (
    value: Activity[] | ((prev: Activity[]) => Activity[])
  ) => void;
  selectedPackages: ThemedPackage[];
  setSelectedPackages: (
    value: ThemedPackage[] | ((prev: ThemedPackage[]) => ThemedPackage[])
  ) => void;
  activitiesTotal: number;
  packagesTotal: number;
  checkedAvailability: boolean;
  setCheckedAvailability: (checked: boolean) => void;
  setReservationTab: (tab: string) => void;
  createReservation: any;
  redirectToWebpay: any;
  setIsProcessingPayment: (isProcessing: boolean) => void;
  quote: any;
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
    
    // Eliminamos la validación de "si hay 16 huéspedes, se requieren al menos 4 adultos"

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

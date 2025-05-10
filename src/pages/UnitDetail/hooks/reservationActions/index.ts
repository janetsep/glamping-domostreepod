
import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Activity, ThemedPackage } from "@/types";
import { useExtrasManagement } from "./useExtrasManagement";
import { useAvailabilityCheck } from "./useAvailabilityCheck";
import { useQuoteManagement } from "../useQuoteManagement";
import { useReservationCreation } from "./useReservationCreation";

type ReservationState = {
  startDate?: Date;
  endDate?: Date;
  displayUnit: any;
  guests: number;
  requiredDomos?: number;
  isAvailable: boolean | null;
  setIsAvailable: (isAvailable: boolean) => void;
  checkAvailability: (unitId: string, checkIn: Date, checkOut: Date) => Promise<boolean>;
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
  availableDomos?: number;
};

export const useReservationActions = (state: ReservationState) => {
  // Use all the separate hooks
  const { handleActivityToggle, handlePackageToggle } = useExtrasManagement(state);
  const { checkDatesAvailability } = useAvailabilityCheck(state);
  const { handleNewQuote, getUpdatedQuoteTotal, checkAvailabilityAndQuote } = useQuoteManagement(state);
  const { handleConfirmReservation } = useReservationCreation(state);

  const handleReservation = async () => {
    if (!state.startDate || !state.endDate) {
      toast.error("Por favor selecciona las fechas de entrada y salida");
      return;
    }
    
    // Verificamos si hay suficientes domos disponibles
    const requiredDomos = state.requiredDomos || 1;
    if (state.availableDomos !== undefined && requiredDomos > state.availableDomos) {
      toast.error(`Solo hay ${state.availableDomos} domos disponibles para las fechas seleccionadas. Por favor, reduzca la cantidad de domos requeridos o seleccione otras fechas.`);
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

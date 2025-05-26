import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { ReservationState } from '../types';
import { useReservationCreation } from './reservationActions/useReservationCreation';

type ReservationState = {
  displayUnit: any;
  startDate?: Date;
  endDate?: Date;
  guests: number;
  requiredDomos?: number;
  quote: any;
  selectedActivities: any[];
  selectedPackages: any[];
  createReservation: any;
  redirectToWebpay: any;
  setIsProcessingPayment: (isProcessing: boolean) => void;
  refetchAvailability: () => void;
};

export const useReservationProcessing = (state: ReservationState) => {
  // Usar la implementación correcta de useReservationCreation
  const { handleConfirmReservation } = useReservationCreation(state);

  return {
    handleConfirmReservation
  };
};

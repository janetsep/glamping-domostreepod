
import { clearAllToasts } from "@/hooks/use-toast";
import { toast } from "sonner";
import { ReservationState } from './types';
import { useReservationCreation } from './reservationActions/useReservationCreation';

export const useReservationProcessing = (state: ReservationState) => {
  const { handleConfirmReservation } = useReservationCreation(state);

  return {
    handleConfirmReservation
  };
};

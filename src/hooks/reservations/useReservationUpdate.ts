
import { useReservationStatus } from './useReservationStatus';
import { useClientInformation } from './useClientInformation';
import type { ClientInformation } from './useClientInformation';

export { ClientInformation } from './useClientInformation';

export const useMutateReservationStatus = () => {
  const reservationStatus = useReservationStatus();
  const clientInfo = useClientInformation();

  return {
    updateReservation: reservationStatus.updateReservation,
    saveClientInformation: clientInfo.saveClientInformation,
    isUpdating: reservationStatus.isUpdating || clientInfo.isUpdating,
    error: reservationStatus.error || clientInfo.error
  };
};

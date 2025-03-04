
// Archivo principal para operaciones con Supabase (refactorizado)
import { ReservationData, WebPayResponse } from "./types.ts";
import { 
  findReservationByToken,
  findReservationByIdDirect,
  findReservationByBuyOrder,
  findLatestPendingReservation
} from "./utils/reservationQueries.ts";
import {
  updateReservationStatus,
  updateClientInformation,
  updatePaymentDetails
} from "./utils/reservationUpdates.ts";

// Exporta todas las funciones para mantener compatibilidad
export {
  findReservationByToken,
  findReservationByIdDirect,
  findReservationByBuyOrder,
  findLatestPendingReservation,
  updateReservationStatus,
  updateClientInformation,
  updatePaymentDetails
};

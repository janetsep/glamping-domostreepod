
// Find reservation based on different identifiers
import { WebPayResponse } from "../types.ts";
import { 
  findReservationByToken,
  findReservationByIdDirect,
  findReservationByBuyOrder,
  findLatestPendingReservation
} from "./reservationQueries.ts";

export async function findReservation(
  supabaseUrl: string,
  supabaseKey: string,
  token: string,
  responseData: WebPayResponse, 
  providedReservationId?: string
): Promise<string | null> {
  let reservations = [];
  let foundReservationId = providedReservationId || null;
  
  // Primero intentamos con el ID directo si está disponible
  if (foundReservationId) {
    console.log(`Buscando reserva por ID directo: ${foundReservationId}`);
    reservations = await findReservationByIdDirect(supabaseUrl, supabaseKey, foundReservationId);
  }
  
  // Si no encontramos por ID directo, buscamos por token
  if (!reservations || reservations.length === 0) {
    console.log(`Buscando reserva por token: ${token}`);
    reservations = await findReservationByToken(supabaseUrl, supabaseKey, token);
  }
  
  // Si no encontramos por token, intentamos por buy_order
  if (!reservations || reservations.length === 0) {
    if (responseData.buy_order) {
      console.log(`Buscando reserva por buy_order: ${responseData.buy_order}`);
      reservations = await findReservationByBuyOrder(supabaseUrl, supabaseKey, responseData.buy_order);
    }
  }
  
  // Si encontramos reserva, devolvemos su ID
  if (reservations && reservations.length > 0) {
    foundReservationId = reservations[0].id;
    console.log(`Encontrada reserva con ID ${foundReservationId} para el token ${token}`);
    return foundReservationId;
  }
  
  // Si no encontramos nada, intentar buscar la reserva más reciente en estado 'pending'
  console.log(`No se encontró reserva para el token ${token} ni buy_order ${responseData.buy_order}`);
  const pendingReservations = await findLatestPendingReservation(supabaseUrl, supabaseKey);
  
  if (pendingReservations && pendingReservations.length > 0) {
    foundReservationId = pendingReservations[0].id;
    console.log(`Usando reserva más reciente en estado pending: ${foundReservationId}`);
    return foundReservationId;
  }
  
  return null;
}

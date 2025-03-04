
// Operaciones para buscar reservas en Supabase
import { ReservationData } from "../types.ts";

const createHeaders = (supabaseKey: string) => ({
  'Authorization': `Bearer ${supabaseKey}`,
  'apikey': supabaseKey,
  'Content-Type': 'application/json'
});

// Busca una reserva por token de WebPay
export async function findReservationByToken(
  supabaseUrl: string,
  supabaseKey: string,
  token: string
): Promise<ReservationData[]> {
  console.log(`Buscando reserva asociada al token: ${token}`);
  
  const searchResponse = await fetch(
    `${supabaseUrl}/rest/v1/reservations?select=id,status&payment_details->>token=eq.${token}`, 
    {
      method: 'GET',
      headers: createHeaders(supabaseKey)
    }
  );
  
  if (!searchResponse.ok) {
    const errorText = await searchResponse.text();
    console.error(`Error al buscar la reserva: ${errorText}`);
    throw new Error(`Error en la búsqueda: ${searchResponse.status}`);
  }
  
  const reservations = await searchResponse.json();
  console.log(`Reservaciones encontradas por token: ${JSON.stringify(reservations)}`);
  
  return reservations;
}

// Busca una reserva directamente por ID
export async function findReservationByIdDirect(
  supabaseUrl: string,
  supabaseKey: string,
  reservationId: string
): Promise<ReservationData[]> {
  console.log(`Buscando reserva directamente por ID: ${reservationId}`);
  
  const searchResponse = await fetch(
    `${supabaseUrl}/rest/v1/reservations?select=id,status&id=eq.${reservationId}`, 
    {
      method: 'GET',
      headers: createHeaders(supabaseKey)
    }
  );
  
  if (!searchResponse.ok) {
    const errorText = await searchResponse.text();
    console.error(`Error al buscar la reserva por ID: ${errorText}`);
    throw new Error(`Error en la búsqueda por ID: ${searchResponse.status}`);
  }
  
  const reservations = await searchResponse.json();
  console.log(`Reservaciones encontradas por ID: ${JSON.stringify(reservations)}`);
  
  return reservations;
}

// Busca una reserva por buy_order de WebPay
export async function findReservationByBuyOrder(
  supabaseUrl: string,
  supabaseKey: string,
  buyOrder: string
): Promise<ReservationData[]> {
  console.log(`Buscando reserva con buy_order: ${buyOrder}`);
  
  const searchResponse = await fetch(
    `${supabaseUrl}/rest/v1/reservations?select=id,status&payment_details->>buy_order=eq.${buyOrder}`, 
    {
      method: 'GET',
      headers: createHeaders(supabaseKey)
    }
  );
  
  if (!searchResponse.ok) {
    const errorText = await searchResponse.text();
    console.error(`Error al buscar la reserva por buy_order: ${errorText}`);
    throw new Error(`Error en la búsqueda por buy_order: ${searchResponse.status}`);
  }
  
  const reservations = await searchResponse.json();
  console.log(`Reservaciones encontradas por buy_order: ${JSON.stringify(reservations)}`);
  
  return reservations;
}

// Busca la reserva pendiente más reciente como fallback
export async function findLatestPendingReservation(
  supabaseUrl: string,
  supabaseKey: string
): Promise<ReservationData[]> {
  console.log("Buscando la reserva pendiente más reciente");
  
  const searchResponse = await fetch(
    `${supabaseUrl}/rest/v1/reservations?select=id,status&status=eq.pending&order=created_at.desc&limit=1`, 
    {
      method: 'GET',
      headers: createHeaders(supabaseKey)
    }
  );
  
  if (!searchResponse.ok) {
    const errorText = await searchResponse.text();
    console.error(`Error al buscar la reserva pendiente más reciente: ${errorText}`);
    throw new Error(`Error en la búsqueda de reserva pendiente: ${searchResponse.status}`);
  }
  
  const reservations = await searchResponse.json();
  console.log(`Reservación pendiente más reciente: ${JSON.stringify(reservations)}`);
  
  return reservations;
}

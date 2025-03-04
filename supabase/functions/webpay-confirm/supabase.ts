
// Operaciones con Supabase para webpay-confirm
import { ReservationData, WebPayResponse } from "./types.ts";

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
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      }
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
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      }
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
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      }
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
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      }
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

// Actualiza el estado de una reserva
export async function updateReservationStatus(
  supabaseUrl: string,
  supabaseKey: string,
  reservationId: string,
  status: string,
  paymentDetails: WebPayResponse
): Promise<boolean> {
  console.log(`Actualizando estado de reserva ${reservationId} a '${status}'`);
  
  const updateData = {
    status,
    payment_details: paymentDetails
  };
  
  console.log(`Datos de actualización: ${JSON.stringify(updateData)}`);
  
  const updateResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(updateData)
  });
  
  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    console.error(`Error al actualizar estado de la reserva: ${errorText}`);
    return false;
  }
  
  console.log(`Reserva ${reservationId} actualizada correctamente a estado '${status}'`);
  return true;
}

// Actualiza la información del cliente en una reserva
export async function updateClientInformation(
  supabaseUrl: string,
  supabaseKey: string,
  reservationId: string,
  clientInfo: {name?: string; email?: string; phone?: string}
): Promise<boolean> {
  console.log(`Actualizando información del cliente para reserva ${reservationId}`);
  
  const updateData: {client_name?: string; client_email?: string; client_phone?: string} = {};
  
  if (clientInfo.name) updateData.client_name = clientInfo.name;
  if (clientInfo.email) updateData.client_email = clientInfo.email;
  if (clientInfo.phone) updateData.client_phone = clientInfo.phone;
  
  console.log(`Datos de cliente a actualizar: ${JSON.stringify(updateData)}`);
  
  if (Object.keys(updateData).length === 0) {
    console.log("No hay información de cliente para actualizar");
    return true;
  }
  
  const updateResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(updateData)
  });
  
  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    console.error(`Error al actualizar información del cliente: ${errorText}`);
    return false;
  }
  
  console.log(`Información del cliente actualizada para reserva ${reservationId}`);
  return true;
}

// Actualiza solo los detalles del pago, sin cambiar el estado
export async function updatePaymentDetails(
  supabaseUrl: string,
  supabaseKey: string,
  reservationId: string,
  paymentDetails: WebPayResponse
): Promise<boolean> {
  console.log(`Actualizando detalles de pago para reserva ${reservationId}`);
  
  const updateResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      payment_details: paymentDetails
    })
  });
  
  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    console.error(`Error al actualizar detalles de pago: ${errorText}`);
    return false;
  }
  
  console.log(`Detalles de pago actualizados para reserva ${reservationId}`);
  return true;
}

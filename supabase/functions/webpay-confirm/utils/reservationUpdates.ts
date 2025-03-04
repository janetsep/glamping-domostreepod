
// Operaciones para actualizar reservas en Supabase
import { WebPayResponse } from "../types.ts";
import { createHeaders } from "./httpUtils.ts";

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
      ...createHeaders(supabaseKey),
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
      ...createHeaders(supabaseKey),
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
      ...createHeaders(supabaseKey),
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

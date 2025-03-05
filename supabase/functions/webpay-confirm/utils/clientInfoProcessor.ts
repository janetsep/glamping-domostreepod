
// Process and validate client information
import { ClientInfo } from "../types.ts";
import { updateClientInformation } from "./reservationUpdates.ts";

export async function processClientInfo(
  supabaseUrl: string,
  supabaseKey: string,
  reservationId: string | null,
  clientInfo?: ClientInfo
): Promise<boolean> {
  if (!reservationId || !clientInfo || (!clientInfo.name && !clientInfo.email && !clientInfo.phone)) {
    console.log("No hay información de cliente para procesar o falta el ID de reserva");
    return false;
  }

  console.log(`Actualizando información del cliente para reserva ${reservationId}`);
  
  // Verificar si ya existe información del cliente
  try {
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}&select=client_name,client_email,client_phone`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    });
    
    if (checkResponse.ok) {
      const reservationData = await checkResponse.json();
      if (reservationData.length > 0) {
        const existingData = reservationData[0];
        
        // Si ya hay información del cliente, solo actualizar campos faltantes
        if (existingData.client_name && existingData.client_email && existingData.client_phone) {
          console.log(`Ya existe información completa del cliente para la reserva ${reservationId}`);
          return true;
        }
        
        // Combinar datos existentes con nuevos
        const updatedClientInfo = {
          name: clientInfo.name || existingData.client_name,
          email: clientInfo.email || existingData.client_email,
          phone: clientInfo.phone || existingData.client_phone
        };
        
        clientInfo = updatedClientInfo;
      }
    }
  } catch (checkError) {
    console.warn(`Error al verificar información existente: ${checkError}`);
  }
  
  // Intentar actualizar información con el método principal
  const clientUpdateSuccess = await updateClientInformation(supabaseUrl, supabaseKey, reservationId, clientInfo);
  
  if (clientUpdateSuccess) {
    console.log(`Información del cliente actualizada correctamente para ${reservationId}`);
    return true;
  } else {
    console.warn(`No se pudo actualizar información del cliente para ${reservationId}`);
    
    // Intentar actualizar cliente con método alternativo
    try {
      const directClientUpdateResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          client_name: clientInfo.name,
          client_email: clientInfo.email,
          client_phone: clientInfo.phone,
          updated_at: new Date().toISOString()
        })
      });
      
      if (directClientUpdateResponse.ok) {
        console.log(`Información del cliente actualizada correctamente con método alternativo`);
        return true;
      } else {
        console.error(`Error al actualizar información del cliente con método alternativo: ${await directClientUpdateResponse.text()}`);
      }
    } catch (directClientUpdateError) {
      console.error(`Error en actualización alternativa de cliente: ${directClientUpdateError}`);
    }
    return false;
  }
}

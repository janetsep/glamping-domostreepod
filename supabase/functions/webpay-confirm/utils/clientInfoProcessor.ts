
// Process and validate client information
import { ClientInfo } from "../types.ts";
import { updateClientInformation } from "./reservationUpdates.ts";
import { createHeaders } from "./httpUtils.ts";

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
  console.log(`Datos del cliente: `, JSON.stringify(clientInfo));
  
  // Verificar si ya existe información del cliente
  try {
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}&select=client_name,client_email,client_phone`, {
      headers: createHeaders(supabaseKey)
    });
    
    if (checkResponse.ok) {
      const reservationData = await checkResponse.json();
      if (reservationData.length > 0) {
        const existingData = reservationData[0];
        console.log(`Información existente del cliente: `, JSON.stringify(existingData));
        
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
    
    // Verificar que la actualización fue exitosa
    try {
      const verifyResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}&select=client_name,client_email,client_phone`, {
        headers: createHeaders(supabaseKey)
      });
      
      if (verifyResponse.ok) {
        const verifiedData = await verifyResponse.json();
        if (verifiedData.length > 0) {
          console.log(`Información del cliente verificada después de la actualización: `, JSON.stringify(verifiedData[0]));
        }
      }
    } catch (verifyError) {
      console.warn(`Error al verificar actualización: ${verifyError}`);
    }
    
    return true;
  } else {
    console.warn(`No se pudo actualizar información del cliente para ${reservationId}`);
    
    // Intentar actualizar cliente con método alternativo
    try {
      console.log(`Intentando método alternativo para actualizar información del cliente`);
      
      const directClientUpdateResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}`, {
        method: 'PATCH',
        headers: {
          ...createHeaders(supabaseKey),
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
        const errorText = await directClientUpdateResponse.text();
        console.error(`Error al actualizar información del cliente con método alternativo: ${errorText}`);
      }
    } catch (directClientUpdateError) {
      console.error(`Error en actualización alternativa de cliente: ${directClientUpdateError}`);
    }
    return false;
  }
}

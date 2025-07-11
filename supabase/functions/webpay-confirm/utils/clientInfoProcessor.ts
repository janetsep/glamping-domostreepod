
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
  
  // Primero obtener el reservation_code de la reserva principal
  let reservationCode: string | null = null;
  try {
    const getCodeResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}&select=reservation_code`, {
      headers: createHeaders(supabaseKey)
    });
    
    if (getCodeResponse.ok) {
      const codeData = await getCodeResponse.json();
      if (codeData.length > 0 && codeData[0].reservation_code) {
        reservationCode = codeData[0].reservation_code;
        console.log(`Código de reserva encontrado: ${reservationCode}`);
      }
    }
  } catch (error) {
    console.warn(`Error al obtener código de reserva: ${error}`);
  }
  
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
  
  // Si tenemos reservation_code, actualizar TODAS las reservas con ese código
  if (reservationCode) {
    console.log(`Actualizando información del cliente para TODAS las reservas con código: ${reservationCode}`);
    
    try {
      const updateAllResponse = await fetch(`${supabaseUrl}/rest/v1/reservations?reservation_code=eq.${reservationCode}`, {
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
      
      if (updateAllResponse.ok) {
        console.log(`✅ Información del cliente actualizada para TODAS las reservas con código ${reservationCode}`);
        return true;
      } else {
        const errorText = await updateAllResponse.text();
        console.error(`❌ Error al actualizar información del cliente para código ${reservationCode}: ${errorText}`);
      }
    } catch (updateAllError) {
      console.error(`❌ Error en actualización masiva de cliente: ${updateAllError}`);
    }
  }
  
  // Fallback: Intentar actualizar solo la reserva individual
  const clientUpdateSuccess = await updateClientInformation(supabaseUrl, supabaseKey, reservationId, clientInfo);
  
  if (clientUpdateSuccess) {
    console.log(`Información del cliente actualizada correctamente para ${reservationId} (fallback individual)`);
    return true;
  } else {
    console.warn(`No se pudo actualizar información del cliente para ${reservationId}`);
    return false;
  }
}

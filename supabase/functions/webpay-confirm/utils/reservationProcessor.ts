
// Procesamiento robusto y atomico de reservas
export async function updateReservationWithPaymentResult(
  supabaseUrl: string,
  supabaseKey: string,
  reservationId: string,
  paymentData: any,
  clientInfo?: { name?: string; email?: string; phone?: string }
): Promise<void> {
  console.log(`🔄 [updateReservation] Actualizando reserva ${reservationId}`);
  
  // 1. Obtener el código de reserva para actualizar todas las reservas asociadas
  console.log('🔍 [updateReservation] Obteniendo código de reserva...');
  const getCodeResponse = await fetch(
    `${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}&select=reservation_code`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    }
  );
  
  if (!getCodeResponse.ok) {
    throw new Error('No se pudo obtener el código de reserva');
  }
  
  const codeData = await getCodeResponse.json();
  if (!codeData.length || !codeData[0].reservation_code) {
    throw new Error('Código de reserva no encontrado');
  }
  
  const reservationCode = codeData[0].reservation_code;
  console.log(`✅ [updateReservation] Código de reserva: ${reservationCode}`);
  
  // 2. Preparar datos de actualización
  const updateData: any = {
    status: 'confirmed',
    payment_details: paymentData,
    updated_at: new Date().toISOString()
  };
  
  // Agregar información del cliente si está disponible
  if (clientInfo?.name) updateData.client_name = clientInfo.name;
  if (clientInfo?.email) updateData.client_email = clientInfo.email;
  if (clientInfo?.phone) updateData.client_phone = clientInfo.phone;
  
  // 3. Actualizar TODAS las reservas con el mismo código
  console.log('🔄 [updateReservation] Actualizando todas las reservas asociadas...');
  const updateResponse = await fetch(
    `${supabaseUrl}/rest/v1/reservations?reservation_code=eq.${reservationCode}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updateData)
    }
  );
  
  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    throw new Error(`Error actualizando reservas: ${errorText}`);
  }
  
  const updatedReservations = await updateResponse.json();
  console.log(`✅ [updateReservation] ${updatedReservations.length} reservas actualizadas`);
}

export async function verifyFinalReservationState(
  supabaseUrl: string,
  supabaseKey: string,
  reservationId: string
): Promise<any> {
  console.log(`🔍 [verifyReservation] Verificando estado final de reserva ${reservationId}`);
  
  // Obtener código de reserva
  const getCodeResponse = await fetch(
    `${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}&select=reservation_code`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    }
  );
  
  if (!getCodeResponse.ok) {
    throw new Error('No se pudo verificar el código de reserva');
  }
  
  const codeData = await getCodeResponse.json();
  if (!codeData.length) {
    throw new Error('Reserva no encontrada para verificación');
  }
  
  const reservationCode = codeData[0].reservation_code;
  
  // Verificar que todas las reservas estén confirmadas
  const verifyResponse = await fetch(
    `${supabaseUrl}/rest/v1/reservations?reservation_code=eq.${reservationCode}&select=id,status,unit_id`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    }
  );
  
  if (!verifyResponse.ok) {
    throw new Error('Error verificando reservas');
  }
  
  const reservations = await verifyResponse.json();
  const allConfirmed = reservations.every((r: any) => r.status === 'confirmed');
  const hasValidUnits = reservations.every((r: any) => r.unit_id);
  
  if (!allConfirmed) {
    throw new Error('No todas las reservas fueron confirmadas');
  }
  
  if (!hasValidUnits) {
    throw new Error('Algunas reservas no tienen unit_id asignado');
  }
  
  console.log(`✅ [verifyReservation] Verificación exitosa: ${reservations.length} reservas confirmadas`);
  return {
    totalReservations: reservations.length,
    allConfirmed,
    reservations
  };
}

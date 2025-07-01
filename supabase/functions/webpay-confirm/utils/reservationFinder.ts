
// Utilidades para encontrar reservas de manera robusta
export async function findReservation(
  supabaseUrl: string,
  supabaseKey: string,
  token: string,
  responseData: any,
  reservationId?: string
): Promise<string | null> {
  console.log('🔍 [findReservation] Iniciando búsqueda de reserva');
  
  // 1. Si tenemos ID directo, verificarlo primero
  if (reservationId) {
    console.log(`🔍 [findReservation] Verificando ID directo: ${reservationId}`);
    
    const directResponse = await fetch(
      `${supabaseUrl}/rest/v1/reservations?id=eq.${reservationId}&select=id,status,reservation_code`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        }
      }
    );
    
    if (directResponse.ok) {
      const reservations = await directResponse.json();
      if (reservations.length > 0) {
        console.log(`✅ [findReservation] Reserva encontrada por ID: ${reservations[0].id}`);
        return reservations[0].id;
      }
    }
  }
  
  // 2. Buscar por reservas pendientes recientes (últimos 30 minutos)
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  
  console.log('🔍 [findReservation] Buscando reservas pendientes recientes');
  const pendingResponse = await fetch(
    `${supabaseUrl}/rest/v1/reservations?status=eq.pending&created_at=gte.${thirtyMinutesAgo}&order=created_at.desc&limit=5`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    }
  );
  
  if (pendingResponse.ok) {
    const pendingReservations = await pendingResponse.json();
    if (pendingReservations.length > 0) {
      console.log(`✅ [findReservation] Usando reserva pendiente más reciente: ${pendingReservations[0].id}`);
      return pendingReservations[0].id;
    }
  }
  
  console.log('❌ [findReservation] No se encontró ninguna reserva');
  return null;
}

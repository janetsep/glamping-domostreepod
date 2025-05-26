import { supabase } from '@/lib/supabase';
import { addDays, format, eachDayOfInterval } from 'date-fns';

async function checkReservations() {
  const startDate = new Date('2025-07-01T00:00:00.000Z');
  const endDate = new Date('2025-07-05T23:59:59.999Z');
  const TOTAL_DOMOS = 4;

  console.log('🔍 Consultando disponibilidad del 01 al 05 de julio de 2025...');

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('id, unit_id, check_in, check_out, status')
      .or(`and(check_in.lte.${endDate.toISOString()},check_out.gte.${startDate.toISOString()})`)
      .in('status', ['pending', 'confirmed'])
      .order('check_in', { ascending: true });

    if (error) {
      console.error('❌ Error al consultar reservas:', error);
      return;
    }

    // Generar array de días en el rango
    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    console.log('\n📅 [Disponibilidad por Día]');
    console.log('Total de domos: 4');
    
    // Para cada día, calcular cuántos domos están disponibles
    daysInRange.forEach(day => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      // Filtrar reservas que se solapan con este día
      const reservationsOnDay = data?.filter(r => {
        const checkIn = new Date(r.check_in);
        const checkOut = new Date(r.check_out);
        return checkIn <= dayEnd && checkOut >= dayStart;
      }) || [];

      // Contar domos reservados (solo los confirmados)
      const reservedDomos = new Set(
        reservationsOnDay
          .filter(r => r.status === 'confirmed' && r.unit_id)
          .map(r => r.unit_id)
      ).size;

      // Contar domos pendientes
      const pendingDomos = new Set(
        reservationsOnDay
          .filter(r => r.status === 'pending' && r.unit_id)
          .map(r => r.unit_id)
      ).size;

      const availableDomos = TOTAL_DOMOS - reservedDomos;
      
      // Obtener IDs de los domos reservados y pendientes
      const reservedDomoIds = Array.from(new Set(
        reservationsOnDay
          .filter(r => r.status === 'confirmed' && r.unit_id)
          .map(r => r.unit_id)
      ));
      
      const pendingDomoIds = Array.from(new Set(
        reservationsOnDay
          .filter(r => r.status === 'pending' && r.unit_id)
          .map(r => r.unit_id)
      ));

      console.log(`\n📆 ${format(day, 'dd/MM/yyyy')}:`);
      console.log(`  Domos disponibles: ${availableDomos} de ${TOTAL_DOMOS}`);
      if (reservedDomos > 0) {
        console.log(`  Domos confirmados: ${reservedDomos} (${reservedDomoIds.join(', ')})`);
      }
      if (pendingDomos > 0) {
        console.log(`  Domos pendientes: ${pendingDomos} (${pendingDomoIds.join(', ')})`);
      }
    });

    // Mostrar resumen de reservas por domo
    console.log('\n🏕️ [Resumen de Reservas por Domo]');
    const domos = ['1', '2', '3', '4'];
    domos.forEach(domoId => {
      const domoReservations = data?.filter(r => r.unit_id === domoId) || [];
      const confirmed = domoReservations.filter(r => r.status === 'confirmed');
      const pending = domoReservations.filter(r => r.status === 'pending');
      
      console.log(`\nDomo ${domoId}:`);
      if (confirmed.length > 0) {
        console.log('  Reservas confirmadas:');
        confirmed.forEach(r => {
          console.log(`    - ${format(new Date(r.check_in), 'dd/MM')} a ${format(new Date(r.check_out), 'dd/MM')}`);
        });
      }
      if (pending.length > 0) {
        console.log('  Reservas pendientes:');
        pending.forEach(r => {
          console.log(`    - ${format(new Date(r.check_in), 'dd/MM')} a ${format(new Date(r.check_out), 'dd/MM')}`);
        });
      }
      if (confirmed.length === 0 && pending.length === 0) {
        console.log('  Sin reservas en este período');
      }
    });

  } catch (err) {
    console.error('❌ Error general:', err);
  }
}

checkReservations(); 
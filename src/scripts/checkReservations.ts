import { getAllConfirmedReservations } from '../hooks/reservations/utils/supabaseUtils';

async function checkReservations() {
  try {
    console.log('🔍 Consultando reservas confirmadas...');
    const reservations = await getAllConfirmedReservations();
    
    if (!reservations || reservations.length === 0) {
      console.log('No hay reservas confirmadas en la base de datos.');
      return;
    }

    // Análisis adicional
    const reservationsByUnit = reservations.reduce((acc, res) => {
      const unitId = res.unit_id || 'no-asignada';
      if (!acc[unitId]) {
        acc[unitId] = [];
      }
      acc[unitId].push(res);
      return acc;
    }, {} as Record<string, typeof reservations>);

    console.log('\n📊 Análisis por unidad:');
    Object.entries(reservationsByUnit).forEach(([unitId, unitReservations]) => {
      console.log(`\nUnidad ${unitId}:`);
      console.log(`- Total reservas: ${unitReservations.length}`);
      console.log('- Fechas reservadas:');
      unitReservations.forEach(res => {
        console.log(`  * ${new Date(res.check_in).toLocaleDateString()} - ${new Date(res.check_out).toLocaleDateString()}`);
      });
    });

  } catch (error) {
    console.error('Error al consultar reservas:', error);
  }
}

// Ejecutar el script
checkReservations(); 
import { createReservationEntry } from '../hooks/reservations/utils/supabaseUtils';

async function createTestReservation() {
  try {
    // Datos de prueba
    const checkIn = new Date('2024-07-01');
    const checkOut = new Date('2024-07-05');
    const totalGuests = 6;
    const totalPrice = 600000; // $600.000
    const clientInfo = {
      name: 'Cliente Prueba',
      email: 'cliente@prueba.com',
      phone: '+56912345678'
    };

    console.log('🚀 Iniciando creación de reserva de prueba...');
    console.log('📅 Fechas:', {
      checkIn: checkIn.toLocaleDateString(),
      checkOut: checkOut.toLocaleDateString()
    });
    console.log('👥 Huéspedes:', totalGuests);
    console.log('💰 Precio total:', `$${totalPrice.toLocaleString()}`);
    console.log('👤 Cliente:', clientInfo);

    // Crear la reserva
    const result = await createReservationEntry(
      [], // unitIdsToAssign se obtendrá automáticamente
      checkIn,
      checkOut,
      totalGuests,
      totalPrice,
      'webpay',
      [], // actividades
      [], // paquetes
      clientInfo
    );

    console.log('\n✅ Reserva creada exitosamente:');
    console.log('📋 Detalles de las reservas:');
    if (Array.isArray(result)) {
      result.forEach((reservation, index) => {
        console.log(`\nReserva ${index + 1}:`);
        console.log(`  ID: ${reservation.id}`);
        console.log(`  Domo: ${reservation.unit_id}`);
        console.log(`  Código: ${reservation.reservation_code}`);
        console.log(`  Huéspedes: ${reservation.guests}`);
        console.log(`  Precio: $${reservation.total_price.toLocaleString()}`);
        console.log(`  Estado: ${reservation.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Error al crear la reserva:', error);
  }
}

// Ejecutar el script
createTestReservation(); 
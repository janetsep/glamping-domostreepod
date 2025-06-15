import { supabase } from '@/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';
import { generateReservationCode } from '@/hooks/reservations/utils/reservationUtils';

interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
}

interface UnitCapacity {
  unitId: string;
  capacity: number;
}

interface TransactionData {
  id: string;
  created_at: string;
}

interface PaymentDetails {
  vci?: string;
  amount?: number;
  status?: string;
  buy_order?: string;
  session_id?: string;
  card_detail?: {
    card_number: string;
  };
  accounting_date?: string;
  transaction_date?: string;
  authorization_code?: string;
  payment_type_code?: string;
  response_code?: number;
  installments_number?: number;
  [key: string]: unknown;
}

interface ReservationUpdateData {
  status?: 'pending' | 'confirmed' | 'cancelled';
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  payment_details?: PaymentDetails;
  updated_at: string;
  [key: string]: unknown;
}

/**
 * Crea una nueva reserva en la base de datos con distribución de huéspedes y precios
 */
export const createReservationEntry = async (
  unitIdsToAssign: string[],
  checkIn: Date,
  checkOut: Date,
  totalGuests: number,
  totalPrice: number,
  paymentMethod: string = 'webpay',
  selectedActivities: string[] = [],
  selectedPackages: string[] = [],
  clientInfo?: ClientInfo,
  unitCapacities?: UnitCapacity[]
) => {
  try {
    // Validaciones iniciales
    if (!unitIdsToAssign || unitIdsToAssign.length === 0) {
      throw new Error('No se proporcionaron unidades para la reserva');
    }

    if (!checkIn || !checkOut || checkIn >= checkOut) {
      throw new Error('Las fechas de check-in y check-out no son válidas');
    }

    if (totalGuests <= 0) {
      throw new Error('El número de huéspedes debe ser mayor a 0');
    }

    if (totalPrice <= 0) {
      throw new Error('El precio total debe ser mayor a 0');
    }

    console.log('🚀 [createReservationEntry] Iniciando creación de reservas:', {
      unitIdsToAssign,
      totalGuests,
      totalPrice,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      clientInfo
    });

    // Generar código de reserva único
    const reservationCode = await generateReservationCode();
    if (!reservationCode) {
      throw new Error('No se pudo generar el código de reserva');
    }
    console.log('✅ [createReservationEntry] Código de reserva generado:', reservationCode);

    // Obtener capacidades de los domos si no se proporcionan
    if (!unitCapacities) {
      console.log('🔍 [createReservationEntry] Obteniendo capacidades de unidades...');
      const { data: units, error: unitsError } = await supabase
        .from('glamping_units')
        .select('id, max_guests')
        .in('id', unitIdsToAssign);

      if (unitsError) {
        throw new Error(`Error al obtener capacidades: ${unitsError.message}`);
      }

      if (!units || units.length === 0) {
        console.log('⚠️ [createReservationEntry] No se encontraron unidades en BD, usando capacidad por defecto');
        // Crear capacidades por defecto para las unidades solicitadas
        unitCapacities = unitIdsToAssign.map(unitId => ({
          unitId,
          capacity: 4
        }));
      } else {
        unitCapacities = units.map(unit => ({
          unitId: unit.id,
          capacity: unit.max_guests
        }));
      }
      
      console.log('📊 [createReservationEntry] Capacidades obtenidas:', unitCapacities);
    }

    // Distribuir huéspedes entre los domos
    let remainingGuests = totalGuests;
    let remainingPrice = totalPrice;
    const reservationsToCreate = [];

    console.log('🔄 [createReservationEntry] Distribuyendo huéspedes entre domos...');
    
    // Crear una reserva por cada domo solicitado
    for (let i = 0; i < unitIdsToAssign.length; i++) {
      const unitId = unitIdsToAssign[i];
      const unitCapacity = unitCapacities.find(uc => uc.unitId === unitId) || { unitId, capacity: 4 };
      
      const isLastUnit = i === unitIdsToAssign.length - 1;
      
      // Calcular huéspedes para esta unidad
      let unitGuests: number;
      if (isLastUnit) {
        // La última unidad recibe todos los huéspedes restantes
        unitGuests = remainingGuests;
        console.log(`📊 [createReservationEntry] Última unidad (${unitId}): asignando ${unitGuests} huéspedes restantes`);
      } else {
        // Distribuir huéspedes de manera equilibrada
        unitGuests = Math.min(unitCapacity.capacity, Math.ceil(remainingGuests / (unitIdsToAssign.length - i)));
        console.log(`📊 [createReservationEntry] Unidad ${unitId}: asignando ${unitGuests} huéspedes (capacidad: ${unitCapacity.capacity})`);
      }

      // Calcular precio proporcional para esta unidad
      let unitPrice: number;
      if (isLastUnit) {
        // La última unidad recibe todo el precio restante
        unitPrice = remainingPrice;
      } else {
        unitPrice = Math.round((unitGuests / totalGuests) * totalPrice);
        remainingPrice -= unitPrice;
      }
      
      remainingGuests -= unitGuests;

      console.log(`💰 [createReservationEntry] Unidad ${unitId}: precio asignado $${unitPrice}`);

      // Crear la reserva para esta unidad
      reservationsToCreate.push({
        unit_id: unitId,
        check_in: checkIn.toISOString(),
        check_out: checkOut.toISOString(),
        guests: unitGuests,
        total_price: unitPrice,
        status: 'pending',
        payment_method: paymentMethod,
        selected_activities: selectedActivities,
        selected_packages: selectedPackages,
        reservation_code: reservationCode,
        client_name: clientInfo?.name,
        client_email: clientInfo?.email,
        client_phone: clientInfo?.phone,
        payment_details: {
          created_at: new Date().toISOString()
        }
      });
    }

    console.log('📋 [createReservationEntry] Reservas a crear:', JSON.stringify(reservationsToCreate, null, 2));

    // Insertar todas las reservas en una sola operación atómica
    const { data, error: insertError } = await supabase
      .from('reservations')
      .insert(reservationsToCreate)
      .select();

    if (insertError) {
      throw new Error(`Error al insertar reservas: ${insertError.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No se pudieron crear las reservas');
    }

    console.log('✅ [createReservationEntry] Reservas creadas exitosamente:', {
      totalReservas: data.length,
      codigoReserva: reservationCode,
      detalles: data.map(r => ({
        id: r.id,
        unitId: r.unit_id,
        huéspedes: r.guests,
        precio: r.total_price
      }))
    });
    
    return data;

  } catch (error) {
    console.error('❌ [createReservationEntry] Error:', error);
    throw new Error(`Error al crear la reserva: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

/**
 * Creates a temporary reservation for package units
 */
export const createTemporaryReservation = (
  unitId: string,
  checkIn: Date,
  checkOut: Date,
  guests: number,
  totalPrice: number,
  paymentMethod: string = 'webpay',
  selectedActivities: string[] = [],
  selectedPackages: string[] = []
) => {
  const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  return {
    id: tempId,
    created_at: new Date().toISOString(),
    unit_id: unitId,
    check_in: checkIn.toISOString(),
    check_out: checkOut.toISOString(),
    guests: guests,
    total_price: totalPrice,
    status: 'pending',
    payment_method: paymentMethod,
    is_package_unit: true,
    selected_activities: selectedActivities,
    selected_packages: selectedPackages,
    payment_details: {
      created_at: new Date().toISOString()
    }
  };
};

/**
 * Updates reservation data in the database for all associated reservations
 */
export const updateReservationData = async (reservationId: string, updateData: Partial<ReservationUpdateData>) => {
  try {
    console.log(`🔍 [updateReservationData] Iniciando actualización para reserva ${reservationId}`);
    console.log('📝 Datos a actualizar:', updateData);

    // Primero obtener el código de reserva y la información actual
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('id, reservation_code, status, client_name, client_email, client_phone')
      .eq('id', reservationId)
      .single();

    if (fetchError) {
      console.error('❌ [updateReservationData] Error al obtener código de reserva:', fetchError);
      throw fetchError;
    }

    if (!reservation?.reservation_code) {
      console.error('❌ [updateReservationData] No se encontró el código de reserva');
      throw new Error('No se encontró el código de reserva');
    }

    console.log(`✅ [updateReservationData] Código de reserva encontrado: ${reservation.reservation_code}`);

    // Obtener todas las reservas asociadas
    const { data: associatedReservations, error: fetchAssociatedError } = await supabase
      .from('reservations')
      .select('id, status, reservation_code, client_name, client_email, client_phone')
      .eq('reservation_code', reservation.reservation_code);

    if (fetchAssociatedError) {
      console.error('❌ [updateReservationData] Error al obtener reservas asociadas:', fetchAssociatedError);
      throw fetchAssociatedError;
    }

    if (!associatedReservations || associatedReservations.length === 0) {
      console.error('❌ [updateReservationData] No se encontraron reservas asociadas');
      throw new Error('No se encontraron reservas asociadas');
    }

    console.log(`🔍 [updateReservationData] Reservas asociadas encontradas:`, associatedReservations);

    // Preparar datos de actualización
    const updatePayload: ReservationUpdateData = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // Si hay información del cliente en updateData, asegurarse de que se aplique a todas las reservas
    if (updateData.client_name || updateData.client_email || updateData.client_phone) {
      updatePayload.client_name = updateData.client_name || reservation.client_name;
      updatePayload.client_email = updateData.client_email || reservation.client_email;
      updatePayload.client_phone = updateData.client_phone || reservation.client_phone;
    }

    // Actualizar todas las reservas con el mismo código
    const { data: updateResult, error: updateError } = await supabase
      .from('reservations')
      .update(updatePayload)
      .eq('reservation_code', reservation.reservation_code)
      .select();

    if (updateError) {
      console.error('❌ [updateReservationData] Error al actualizar reservas:', updateError);
      throw updateError;
    }

    console.log(`✅ [updateReservationData] Resultado de la actualización:`, updateResult);

    // Verificar que todas las reservas se actualizaron correctamente
    const { data: verifyData, error: verifyError } = await supabase
      .from('reservations')
      .select('id, status, reservation_code, client_name, client_email, client_phone')
      .eq('reservation_code', reservation.reservation_code);

    if (verifyError) {
      console.error('❌ [updateReservationData] Error al verificar actualización:', verifyError);
      throw verifyError;
    }

    console.log(`🔍 [updateReservationData] Estado final de las reservas:`, verifyData);

    // Verificar que todas las reservas tienen el estado correcto y la información del cliente
    const allUpdated = verifyData?.every(r => {
      const statusMatch = r.status === updateData.status;
      const clientInfoMatch = 
        (!updatePayload.client_name || r.client_name === updatePayload.client_name) &&
        (!updatePayload.client_email || r.client_email === updatePayload.client_email) &&
        (!updatePayload.client_phone || r.client_phone === updatePayload.client_phone);
      
      if (!statusMatch || !clientInfoMatch) {
        console.error(`❌ Reserva ${r.id} (${r.reservation_code}) no está actualizada correctamente:`, {
          status: r.status,
          expectedStatus: updateData.status,
          clientInfo: {
            name: r.client_name,
            email: r.client_email,
            phone: r.client_phone
          },
          expectedClientInfo: {
            name: updatePayload.client_name,
            email: updatePayload.client_email,
            phone: updatePayload.client_phone
          }
        });
      }
      
      return statusMatch && clientInfoMatch;
    });

    if (!allUpdated) {
      throw new Error('No todas las reservas se actualizaron correctamente');
    }

    console.log(`✅ [updateReservationData] Todas las reservas actualizadas correctamente`);
    return true;
  } catch (error) {
    console.error('❌ [updateReservationData] Error general:', error);
    throw error;
  }
};

/**
 * Verifies that a reservation update was successful
 */
export const verifyReservationUpdate = async (reservationId: string) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single();
    
    if (error) {
      console.error('Error verificando la actualización de la reserva:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No se encontró la reserva después de la actualización');
    }
    
    console.log('Verificación de actualización exitosa:', data);
    return true;
  } catch (error) {
    console.error('Error verifying reservation update:', error);
    throw error;
  }
};

/**
 * Consulta todas las reservas confirmadas en la base de datos
 */
export const getAllConfirmedReservations = async () => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('id, unit_id, check_in, check_out, status, guests, total_price, created_at')
      .eq('status', 'confirmed')
      .order('check_in', { ascending: true });

    if (error) {
      console.error('Error al consultar reservas:', error);
      throw error;
    }

    console.log('📊 [Reservas Confirmadas] Total:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('Detalles de las reservas:');
      data.forEach(reservation => {
        console.log(`- ID: ${reservation.id}`);
        console.log(`  Unidad: ${reservation.unit_id || 'No asignada'}`);
        console.log(`  Check-in: ${new Date(reservation.check_in).toLocaleDateString()}`);
        console.log(`  Check-out: ${new Date(reservation.check_out).toLocaleDateString()}`);
        console.log(`  Huéspedes: ${reservation.guests}`);
        console.log(`  Precio: $${reservation.total_price}`);
        console.log(`  Creada: ${new Date(reservation.created_at).toLocaleDateString()}`);
        console.log('---');
      });
    }

    return data;
  } catch (error) {
    console.error('Error en getAllConfirmedReservations:', error);
    throw error;
  }
};

/**
 * Actualiza el estado de todas las reservas asociadas a un código de reserva
 */
export const updateReservationStatus = async (reservationCode: string, status: 'pending' | 'confirmed' | 'cancelled') => {
  try {
    console.log(`🔄 [updateReservationStatus] Iniciando actualización de estado para código ${reservationCode} a ${status}`);

    // Primero verificar que existan reservas con este código
    const { data: existingReservations, error: checkError } = await supabase
      .from('reservations')
      .select('id, status, reservation_code')
      .eq('reservation_code', reservationCode);

    if (checkError) {
      console.error('❌ [updateReservationStatus] Error al verificar reservas existentes:', checkError);
      throw checkError;
    }

    if (!existingReservations || existingReservations.length === 0) {
      console.error('❌ [updateReservationStatus] No se encontraron reservas con el código:', reservationCode);
      throw new Error(`No se encontraron reservas con el código ${reservationCode}`);
    }

    console.log(`📊 [updateReservationStatus] Reservas encontradas: ${existingReservations.length}`);

    // Actualizar todas las reservas asociadas
    const { data: updatedReservations, error: updateError } = await supabase
      .from('reservations')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('reservation_code', reservationCode)
      .select('id, status, reservation_code, unit_id, guests, total_price');

    if (updateError) {
      console.error('❌ [updateReservationStatus] Error al actualizar estado:', updateError);
      throw updateError;
    }

    if (!updatedReservations || updatedReservations.length === 0) {
      console.error('❌ [updateReservationStatus] No se actualizaron las reservas');
      throw new Error('No se actualizaron las reservas');
    }

    // Verificar que todas las reservas se actualizaron correctamente
    const { data: verifyData, error: verifyError } = await supabase
      .from('reservations')
      .select('id, status, reservation_code')
      .eq('reservation_code', reservationCode);

    if (verifyError) {
      console.error('❌ [updateReservationStatus] Error al verificar actualización:', verifyError);
      throw verifyError;
    }

    // Verificar que todas las reservas tienen el estado correcto
    const allUpdated = verifyData?.every(r => r.status === status);
    if (!allUpdated) {
      console.error('❌ [updateReservationStatus] No todas las reservas se actualizaron correctamente:', verifyData);
      throw new Error('No todas las reservas se actualizaron al estado correcto');
    }

    console.log(`✅ [updateReservationStatus] Actualización exitosa:`, {
      codigoReserva: reservationCode,
      estado: status,
      totalReservas: updatedReservations.length,
      detalles: updatedReservations.map(r => ({
        id: r.id,
        unidad: r.unit_id,
        huéspedes: r.guests,
        precio: r.total_price
      }))
    });

    return updatedReservations;
  } catch (error) {
    console.error('❌ [updateReservationStatus] Error general:', error);
    throw error;
  }
};

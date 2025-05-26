import { supabase } from '@/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';
import { generateReservationCode } from './reservationUtils';

interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
}

interface UnitCapacity {
  unitId: string;
  capacity: number;
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
    // Generar código de reserva único una sola vez para todas las reservas asociadas
    const reservationCode = await generateReservationCode();
    console.log('Código de reserva generado:', reservationCode);

    // Obtener capacidades de los domos si no se proporcionan
    if (!unitCapacities) {
      const { data: units, error: unitsError } = await supabase
        .from('glamping_units')
        .select('id, max_guests')
        .in('id', unitIdsToAssign);

      if (unitsError) {
        console.error('Error al obtener capacidades de unidades:', unitsError);
        throw unitsError;
      }

      unitCapacities = units.map(unit => ({
        unitId: unit.id,
        capacity: unit.max_guests
      }));
    }

    // Ordenar unidades por capacidad (de mayor a menor)
    unitCapacities.sort((a, b) => b.capacity - a.capacity);

    // Distribuir huéspedes respetando la capacidad máxima de cada domo
    let remainingGuests = totalGuests;
    let remainingPrice = totalPrice;
    const reservationsToCreate = [];

    for (let i = 0; i < unitCapacities.length; i++) {
      const unit = unitCapacities[i];
      const isLastUnit = i === unitCapacities.length - 1;
      
      // Calcular huéspedes para esta unidad
      let unitGuests: number;
      if (isLastUnit) {
        // Última unidad: asignar los huéspedes restantes
        unitGuests = remainingGuests;
      } else {
        // Distribuir respetando la capacidad máxima del domo
        unitGuests = Math.min(unit.capacity, remainingGuests);
      }

      // Si no hay más huéspedes para asignar, no crear más reservas
      if (unitGuests <= 0) break;

      // Calcular precio proporcional basado en la capacidad
      const unitPrice = Math.round((unitGuests / totalGuests) * totalPrice);
      remainingPrice -= unitPrice;
      remainingGuests -= unitGuests;

      reservationsToCreate.push({
        unit_id: unit.unitId,
        check_in: checkIn.toISOString(),
        check_out: checkOut.toISOString(),
        guests: unitGuests,
        total_price: unitPrice,
        status: 'pending',
        payment_method: paymentMethod,
        selected_activities: selectedActivities,
        selected_packages: selectedPackages,
        reservation_code: reservationCode, // Mismo código para todas las reservas asociadas
        client_name: clientInfo?.name,
        client_email: clientInfo?.email,
        client_phone: clientInfo?.phone,
        payment_details: {
          created_at: new Date().toISOString()
        }
      });
    }

    // Ajustar el precio de la última unidad para compensar errores de redondeo
    if (reservationsToCreate.length > 0) {
      reservationsToCreate[reservationsToCreate.length - 1].total_price += remainingPrice;
    }

    console.log('Reservas a crear:', JSON.stringify(reservationsToCreate, null, 2));

    // Crear todas las reservas en una sola transacción
    const { data, error } = await supabase
      .from('reservations')
      .insert(reservationsToCreate)
      .select();
    
    if (error) {
      console.error('Error al crear reservas:', error);
      throw error;
    }
    
    console.log('Reservas creadas:', data);
    return data;
  } catch (error) {
    console.error('Error creating reservations:', error);
    throw error;
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
 * Updates reservation data in the database
 */
export const updateReservationData = async (reservationId: string, updateData: any) => {
  try {
    // First attempt with Supabase client
    try {
      const { error } = await supabase
        .from('reservations')
        .update(updateData)
        .eq('id', reservationId);
      
      if (error) {
        console.error('Error using Supabase client to update reservation:', error);
        throw error;
      }
      
      console.log('Reserva actualizada con cliente Supabase:', reservationId);
      return true;
    } catch (supabaseError) {
      // Fallback to direct API call
      console.log('Intentando actualizar reserva con fetch directo:', reservationId);
      const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al actualizar reserva con fetch:', errorText);
        throw new Error(`Error al actualizar reserva: ${response.status} ${errorText}`);
      }

      console.log('Reserva actualizada con fetch directo:', reservationId);
      return true;
    }
  } catch (error) {
    console.error('Error updating reservation:', error);
    return false;
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
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('reservation_code', reservationCode)
      .select();

    if (error) {
      console.error('Error al actualizar estado de reservas:', error);
      throw error;
    }

    console.log(`Reservas actualizadas a estado ${status}:`, data);
    return data;
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
};

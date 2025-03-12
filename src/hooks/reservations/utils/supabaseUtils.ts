import { supabase } from '@/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';

/**
 * Creates a new reservation in the database
 */
export const createReservationEntry = async (
  unitId: string,
  checkIn: Date,
  checkOut: Date,
  guests: number,
  totalPrice: number,
  paymentMethod: string = 'webpay',
  selectedActivities: string[] = [],
  selectedPackages: string[] = []
) => {
  try {
    // First attempt with Supabase client
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          unit_id: unitId,
          check_in: checkIn.toISOString(),
          check_out: checkOut.toISOString(),
          guests,
          total_price: totalPrice,
          status: 'pending',
          payment_method: paymentMethod,
          selected_activities: selectedActivities,
          selected_packages: selectedPackages,
          payment_details: {
            created_at: new Date().toISOString()
          }
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error con cliente Supabase:', error);
        throw error;
      }
      
      console.log('Reserva creada con cliente Supabase:', data);
      return data;
    } catch (supabaseError) {
      // Fallback to direct API call
      console.log('Intentando crear reserva con fetch directo');
      const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          unit_id: unitId,
          check_in: checkIn.toISOString(),
          check_out: checkOut.toISOString(),
          guests,
          total_price: totalPrice,
          status: 'pending',
          payment_method: paymentMethod,
          selected_activities: selectedActivities,
          selected_packages: selectedPackages,
          payment_details: {
            created_at: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al crear reserva con fetch:', errorText);
        throw new Error(`Error al crear reserva: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Reserva creada con fetch directo:', data);
      return data[0];
    }
  } catch (error) {
    console.error('Error creating reservation:', error);
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

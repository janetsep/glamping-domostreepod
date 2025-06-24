
import { supabase } from "@/integrations/supabase/client";

interface AvailabilityResult {
  isAvailable: boolean;
  availableUnits: number;
  totalUnits: number;
}

/**
 * Verifica la disponibilidad general de unidades para un rango de fechas
 */
export async function checkGeneralAvailability(
  startDate: Date,
  endDate: Date,
  requiredUnits: number = 1
): Promise<AvailabilityResult> {
  try {
    console.log('🔍 [checkGeneralAvailability] Verificando disponibilidad:', {
      inicio: startDate.toISOString().split('T')[0],
      fin: endDate.toISOString().split('T')[0],
      unidadesRequeridas: requiredUnits
    });

    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('glamping_units')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('❌ [checkGeneralAvailability] Error de conexión:', testError);
      throw new Error(`Error de conexión: ${testError.message}`);
    }

    // Obtener todas las unidades disponibles
    const { data: allUnits, error: unitsError } = await supabase
      .from('glamping_units')
      .select('id')
      .order('id', { ascending: true });

    if (unitsError) {
      console.error('❌ [checkGeneralAvailability] Error obteniendo unidades:', unitsError);
      throw new Error(`Error obteniendo unidades: ${unitsError.message}`);
    }

    if (!allUnits || allUnits.length === 0) {
      console.log('⚠️ [checkGeneralAvailability] No se encontraron unidades');
      return {
        isAvailable: false,
        availableUnits: 0,
        totalUnits: 0
      };
    }

    const totalUnits = allUnits.length;
    console.log(`📊 [checkGeneralAvailability] Total de unidades: ${totalUnits}`);

    // Verificar reservas que se solapan con el rango de fechas
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    const { data: conflictingReservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('unit_id, check_in, check_out, status, created_at')
      .in('unit_id', allUnits.map(u => u.id))
      .or(`and(check_in.lt.${endDate.toISOString()},check_out.gt.${startDate.toISOString()})`)
      .or(`status.eq.confirmed,and(status.eq.pending,created_at.gte.${fifteenMinutesAgo})`);

    if (reservationsError) {
      console.error('❌ [checkGeneralAvailability] Error verificando reservas:', reservationsError);
      throw new Error(`Error verificando reservas: ${reservationsError.message}`);
    }

    console.log(`📋 [checkGeneralAvailability] Reservas conflictivas encontradas: ${conflictingReservations?.length || 0}`);
    
    if (conflictingReservations && conflictingReservations.length > 0) {
      conflictingReservations.forEach(reservation => {
        console.log(`- Unidad ${reservation.unit_id}: ${reservation.check_in} - ${reservation.check_out} (${reservation.status})`);
      });
    }

    // Crear set de unidades reservadas
    const reservedUnitIds = new Set(
      conflictingReservations?.filter(r => r.unit_id !== null && r.unit_id !== undefined)
        .map(r => String(r.unit_id)) || []
    );

    // Calcular unidades disponibles
    const availableUnits = allUnits.filter(unit => !reservedUnitIds.has(String(unit.id)));
    const availableCount = availableUnits.length;

    console.log(`✅ [checkGeneralAvailability] Resultado:`, {
      totalUnidades: totalUnits,
      unidadesReservadas: reservedUnitIds.size,
      unidadesDisponibles: availableCount,
      suficientesUnidades: availableCount >= requiredUnits
    });

    return {
      isAvailable: availableCount >= requiredUnits,
      availableUnits: availableCount,
      totalUnits: totalUnits
    };

  } catch (error) {
    console.error('❌ [checkGeneralAvailability] Error general:', error);
    return {
      isAvailable: false,
      availableUnits: 0,
      totalUnits: 0
    };
  }
}

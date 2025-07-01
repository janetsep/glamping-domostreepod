
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { temporaryLockManager } from './utils/temporaryLockManager';

interface AvailabilityResult {
  isAvailable: boolean;
  availableUnits: number;
  totalUnits: number;
  availableUnitIds: string[];
  requiredUnits: number;
  lockedUnits?: string[];
  error?: string;
}

/**
 * Hook unificado para verificación de disponibilidad
 * Sistema optimizado para producción
 */
export const useUnifiedAvailabilityChecker = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkAvailability = useCallback(async (
    checkIn: Date,
    checkOut: Date,
    requiredUnits: number = 1,
    excludeReservationId?: string
  ): Promise<AvailabilityResult> => {
    setIsChecking(true);
    
    try {
      // Debug logs in development only
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [UnifiedAvailability] Verificando disponibilidad:', {
          checkIn: checkIn.toISOString().split('T')[0],
          checkOut: checkOut.toISOString().split('T')[0],
          requiredUnits,
          excludeReservationId
        });
      }

      // 1. Obtener todas las unidades del sistema
      const { data: allUnits, error: unitsError } = await supabase
        .from('glamping_units')
        .select('id')
        .order('id', { ascending: true });

      if (unitsError || !allUnits) {
        console.error('❌ [UnifiedAvailability] Error obteniendo unidades:', unitsError);
        return {
          isAvailable: false,
          availableUnits: 0,
          totalUnits: 0,
          availableUnitIds: [],
          requiredUnits,
          error: `Error obteniendo unidades: ${unitsError?.message || 'Error desconocido'}`
        };
      }

      const totalUnits = allUnits.length;

      // 2. Verificar reservas confirmadas que se solapan
      let confirmedQuery = supabase
        .from('reservations')
        .select('unit_id, check_in, check_out, status, id')
        .in('unit_id', allUnits.map(u => u.id))
        .or(`and(check_in.lt.${checkOut.toISOString()},check_out.gt.${checkIn.toISOString()})`)
        .eq('status', 'confirmed');

      // Solo excluir si se proporciona un ID válido de UUID
      if (excludeReservationId && excludeReservationId.length === 36 && !excludeReservationId.includes('undefined')) {
        confirmedQuery = confirmedQuery.neq('id', excludeReservationId);
      }

      const { data: confirmedReservations, error: reservationsError } = await confirmedQuery;

      if (reservationsError) {
        console.error('❌ [UnifiedAvailability] Error en reservas confirmadas:', reservationsError);
        return {
          isAvailable: false,
          availableUnits: 0,
          totalUnits: 0,
          availableUnitIds: [],
          requiredUnits,
          error: `Error verificando reservas: ${reservationsError.message}`
        };
      }

      // Log only in development

      // 3. Verificar reservas pendientes recientes (últimos 15 minutos)
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      
      let pendingQuery = supabase
        .from('reservations')
        .select('unit_id, check_in, check_out, status, created_at, id')
        .in('unit_id', allUnits.map(u => u.id))
        .or(`and(check_in.lt.${checkOut.toISOString()},check_out.gt.${checkIn.toISOString()})`)
        .eq('status', 'pending')
        .gte('created_at', fifteenMinutesAgo);

      // Solo excluir si se proporciona un ID válido de UUID
      if (excludeReservationId && excludeReservationId.length === 36 && !excludeReservationId.includes('undefined')) {
        pendingQuery = pendingQuery.neq('id', excludeReservationId);
      }

      const { data: pendingReservations, error: pendingError } = await pendingQuery;

      if (pendingError) {
        console.error('❌ [UnifiedAvailability] Error en reservas pendientes:', pendingError);
        return {
          isAvailable: false,
          availableUnits: 0,
          totalUnits: 0,
          availableUnitIds: [],
          requiredUnits,
          error: `Error verificando reservas pendientes: ${pendingError.message}`
        };
      }

      // Log only in development

      // 4. Obtener unidades bloqueadas temporalmente
      const temporaryLockedUnits = temporaryLockManager.getLockedUnits(checkIn, checkOut);

      // 5. Consolidar todas las unidades ocupadas
      const reservedUnitIds = new Set<string>();
      
      // Agregar reservas confirmadas
      confirmedReservations?.forEach(r => {
        if (r.unit_id) {
          reservedUnitIds.add(String(r.unit_id));
        }
      });
      
      // Agregar reservas pendientes recientes
      pendingReservations?.forEach(r => {
        if (r.unit_id) {
          reservedUnitIds.add(String(r.unit_id));
        }
      });
      
      // Agregar bloqueos temporales
      temporaryLockedUnits.forEach(unitId => {
        reservedUnitIds.add(String(unitId));
      });

      // 6. Calcular unidades disponibles
      const availableUnitIds = allUnits
        .map(u => String(u.id))
        .filter(id => !reservedUnitIds.has(id));

      const availableUnits = availableUnitIds.length;
      const isAvailable = availableUnits >= requiredUnits;

      const result: AvailabilityResult = {
        isAvailable,
        availableUnits,
        totalUnits,
        availableUnitIds,
        requiredUnits,
        lockedUnits: temporaryLockedUnits
      };

      // Log results only in development
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [UnifiedAvailability] Resultado final:', {
          ...result,
          reservedByConfirmed: confirmedReservations?.length || 0,
          reservedByPending: pendingReservations?.length || 0,
          temporaryLocked: temporaryLockedUnits.length,
          totalReserved: reservedUnitIds.size
        });
      }

      return result;

    } catch (error) {
      console.error('❌ [UnifiedAvailability] Error:', error);
      return {
        isAvailable: false,
        availableUnits: 0,
        totalUnits: 0,
        availableUnitIds: [],
        requiredUnits,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    } finally {
      setIsChecking(false);
    }
  }, []);

  /**
   * Intenta reservar unidades específicas con bloqueo temporal
   */
  const reserveWithLock = useCallback(async (
    checkIn: Date,
    checkOut: Date,
    requiredUnits: number,
    sessionId?: string
  ): Promise<{ success: boolean; reservedUnits?: string[]; sessionId?: string; error?: string }> => {
    
    // Log only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [UnifiedAvailability] Iniciando reserveWithLock:', {
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        requiredUnits,
        sessionId
      });
    }

    // 1. Verificar disponibilidad
    const availability = await checkAvailability(checkIn, checkOut, requiredUnits);
    
    if (!availability.isAvailable) {
      return {
        success: false,
        error: `Solo hay ${availability.availableUnits} de ${requiredUnits} domos disponibles para las fechas seleccionadas.`
      };
    }

    // 2. Seleccionar las mejores unidades disponibles
    const unitsToReserve = availability.availableUnitIds.slice(0, requiredUnits);
    
    // Log only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [UnifiedAvailability] Unidades seleccionadas para reserva:', unitsToReserve);
    }

    // 3. Intentar adquirir bloqueo temporal
    const lockResult = await temporaryLockManager.acquireLock(
      unitsToReserve,
      checkIn,
      checkOut,
      requiredUnits,
      sessionId
    );

    if (!lockResult.success) {
      return {
        success: false,
        error: lockResult.error
      };
    }

    // Success logging only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ [UnifiedAvailability] Bloqueo temporal exitoso');
    }

    return {
      success: true,
      reservedUnits: unitsToReserve,
      sessionId: lockResult.sessionId || sessionId || 'generated-by-lock-manager'
    };
  }, [checkAvailability]);

  return {
    checkAvailability,
    reserveWithLock,
    isChecking
  };
};

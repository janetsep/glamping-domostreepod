
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook centralizado para manejar la verificación de disponibilidad
 * Evita race conditions y asegura consistencia
 */
export const useAvailabilityManager = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkRealTimeAvailability = useCallback(async (
    checkIn: Date,
    checkOut: Date,
    requiredUnits: number = 1
  ) => {
    setIsChecking(true);
    
    try {
      console.log('🔍 [AvailabilityManager] Verificando disponibilidad en tiempo real:', {
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        requiredUnits
      });

      // Obtener todas las unidades
      const { data: allUnits, error: unitsError } = await supabase
        .from('glamping_units')
        .select('id')
        .order('id', { ascending: true });

      if (unitsError || !allUnits) {
        throw new Error('Error al obtener unidades');
      }

      // Verificar reservas conflictivas (incluyendo pendientes recientes)
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      
      const { data: conflicts, error: conflictsError } = await supabase
        .from('reservations')
        .select('unit_id, status, created_at')
        .in('unit_id', allUnits.map(u => u.id))
        .or(`and(check_in.lt.${checkOut.toISOString()},check_out.gt.${checkIn.toISOString()})`)
        .or(`status.eq.confirmed,and(status.eq.pending,created_at.gte.${fifteenMinutesAgo})`);

      if (conflictsError) {
        throw new Error(`Error verificando conflictos: ${conflictsError.message}`);
      }

      // Calcular unidades disponibles
      const reservedUnitIds = new Set(
        conflicts?.map(r => String(r.unit_id)) || []
      );

      const availableUnits = allUnits.filter(
        unit => !reservedUnitIds.has(String(unit.id))
      );

      const result = {
        isAvailable: availableUnits.length >= requiredUnits,
        availableUnits: availableUnits.length,
        totalUnits: allUnits.length,
        availableUnitIds: availableUnits.map(u => u.id),
        conflictingReservations: conflicts?.length || 0
      };

      console.log('✅ [AvailabilityManager] Resultado:', result);
      return result;

    } catch (error) {
      console.error('❌ [AvailabilityManager] Error:', error);
      return {
        isAvailable: false,
        availableUnits: 0,
        totalUnits: 0,
        availableUnitIds: [],
        conflictingReservations: 0,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    checkRealTimeAvailability,
    isChecking
  };
};

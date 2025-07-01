
import { useState, useCallback } from 'react';
import { useUnifiedAvailabilityChecker } from './useUnifiedAvailabilityChecker';
import { temporaryLockManager } from './utils/temporaryLockManager';

/**
 * Hook simplificado que usa el nuevo sistema unificado
 * Mantiene compatibilidad con el código existente
 */
export const useAvailabilityManager = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { checkAvailability: unifiedCheck } = useUnifiedAvailabilityChecker();

  const checkRealTimeAvailability = useCallback(async (
    checkIn: Date,
    checkOut: Date,
    requiredUnits: number = 1
  ) => {
    setIsChecking(true);
    
    try {
      const result = await unifiedCheck(checkIn, checkOut, requiredUnits);
      
      // Mantener formato compatible con código existente
      return {
        isAvailable: result.isAvailable,
        availableUnits: result.availableUnits,
        totalUnits: result.totalUnits,
        availableUnitIds: result.availableUnitIds,
        conflictingReservations: result.totalUnits - result.availableUnits,
        error: result.error
      };
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
  }, [unifiedCheck]);

  return {
    checkRealTimeAvailability,
    isChecking,
    // Exponer funciones de bloqueo temporal
    acquireLock: temporaryLockManager.acquireLock.bind(temporaryLockManager),
    releaseLock: temporaryLockManager.releaseLock.bind(temporaryLockManager),
    extendLock: temporaryLockManager.extendLock.bind(temporaryLockManager)
  };
};

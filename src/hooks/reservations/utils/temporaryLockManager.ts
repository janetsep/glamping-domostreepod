
interface TemporaryLock {
  unitIds: string[];
  checkIn: Date;
  checkOut: Date;
  sessionId: string;
  expiresAt: Date;
  requiredUnits: number;
}

/**
 * Sistema de bloqueo temporal para unidades durante el proceso de reserva
 * Optimizado para producción con limpieza automática
 */
class TemporaryLockManager {
  private locks: Map<string, TemporaryLock> = new Map();
  private readonly LOCK_DURATION = 10 * 60 * 1000; // 10 minutos
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupInterval();
  }

  private startCleanupInterval() {
    // Limpiar bloqueos expirados cada 2 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredLocks();
    }, 2 * 60 * 1000);
  }

  private cleanupExpiredLocks() {
    const now = new Date();
    const expiredKeys: string[] = [];

    this.locks.forEach((lock, key) => {
      if (now > lock.expiresAt) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => {
      console.log(`🧹 [TemporaryLock] Limpiando bloqueo expirado: ${key}`);
      this.locks.delete(key);
    });

    if (expiredKeys.length > 0) {
      console.log(`✅ [TemporaryLock] Limpiados ${expiredKeys.length} bloqueos expirados`);
    }
  }

  async acquireLock(
    unitIds: string[],
    checkIn: Date,
    checkOut: Date,
    requiredUnits: number,
    sessionId?: string
  ): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    
    // Limpiar bloqueos expirados antes de verificar
    this.cleanupExpiredLocks();

    const lockSessionId = sessionId || `lock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Verificar si alguna unidad ya está bloqueada
    const conflictingLocks = this.getConflictingLocks(unitIds, checkIn, checkOut, lockSessionId);
    
    if (conflictingLocks.length > 0) {
      return {
        success: false,
        error: `Unidades ${conflictingLocks.join(', ')} ya están bloqueadas temporalmente`
      };
    }

    // Crear el bloqueo
    const lock: TemporaryLock = {
      unitIds: [...unitIds],
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      sessionId: lockSessionId,
      expiresAt: new Date(Date.now() + this.LOCK_DURATION),
      requiredUnits
    };

    this.locks.set(lockSessionId, lock);

    console.log(`🔒 [TemporaryLock] Bloqueo adquirido para sesión ${lockSessionId}:`, {
      unitIds,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      expiresAt: lock.expiresAt.toISOString()
    });

    return {
      success: true,
      sessionId: lockSessionId
    };
  }

  private getConflictingLocks(
    unitIds: string[],
    checkIn: Date,
    checkOut: Date,
    excludeSessionId?: string
  ): string[] {
    const conflicts: string[] = [];

    this.locks.forEach((lock, sessionId) => {
      if (sessionId === excludeSessionId) return;

      // Verificar si hay solapamiento de fechas
      const datesOverlap = checkIn < lock.checkOut && checkOut > lock.checkIn;
      
      if (datesOverlap) {
        // Verificar si hay unidades en común
        const commonUnits = unitIds.filter(unitId => 
          lock.unitIds.includes(unitId)
        );
        
        if (commonUnits.length > 0) {
          conflicts.push(...commonUnits);
        }
      }
    });

    return [...new Set(conflicts)]; // Eliminar duplicados
  }

  releaseLock(
    unitIds: string[],
    checkIn: Date,
    checkOut: Date,
    sessionId: string
  ): void {
    const lock = this.locks.get(sessionId);
    
    if (lock) {
      this.locks.delete(sessionId);
      console.log(`🔓 [TemporaryLock] Bloqueo liberado para sesión ${sessionId}`);
    } else {
      console.log(`⚠️ [TemporaryLock] Intento de liberar bloqueo inexistente: ${sessionId}`);
    }
  }

  extendLock(sessionId: string, additionalMinutes: number = 10): boolean {
    const lock = this.locks.get(sessionId);
    
    if (!lock) {
      console.log(`⚠️ [TemporaryLock] Intento de extender bloqueo inexistente: ${sessionId}`);
      return false;
    }

    lock.expiresAt = new Date(lock.expiresAt.getTime() + additionalMinutes * 60 * 1000);
    
    console.log(`⏰ [TemporaryLock] Bloqueo extendido para sesión ${sessionId}:`, {
      newExpiresAt: lock.expiresAt.toISOString()
    });
    
    return true;
  }

  getLockedUnits(checkIn: Date, checkOut: Date): string[] {
    this.cleanupExpiredLocks();
    
    const lockedUnits: string[] = [];

    this.locks.forEach((lock) => {
      // Verificar si hay solapamiento de fechas
      const datesOverlap = checkIn < lock.checkOut && checkOut > lock.checkIn;
      
      if (datesOverlap) {
        lockedUnits.push(...lock.unitIds);
      }
    });

    return [...new Set(lockedUnits)]; // Eliminar duplicados
  }

  getCurrentLocks(): Array<{ sessionId: string; lock: TemporaryLock }> {
    this.cleanupExpiredLocks();
    
    return Array.from(this.locks.entries()).map(([sessionId, lock]) => ({
      sessionId,
      lock
    }));
  }

  // Método para limpiar todos los bloqueos (útil para pruebas)
  clearAllLocks(): void {
    this.locks.clear();
    console.log('🧹 [TemporaryLock] Todos los bloqueos han sido limpiados');
  }

  // Método para obtener estadísticas
  getStats(): {
    totalLocks: number;
    lockedUnits: number;
    oldestLock?: Date;
    newestLock?: Date;
  } {
    this.cleanupExpiredLocks();
    
    const locks = Array.from(this.locks.values());
    const allUnitIds = locks.flatMap(lock => lock.unitIds);
    const uniqueUnits = new Set(allUnitIds);
    
    let oldestLock: Date | undefined;
    let newestLock: Date | undefined;
    
    locks.forEach(lock => {
      const createdAt = new Date(lock.expiresAt.getTime() - this.LOCK_DURATION);
      
      if (!oldestLock || createdAt < oldestLock) {
        oldestLock = createdAt;
      }
      
      if (!newestLock || createdAt > newestLock) {
        newestLock = createdAt;
      }
    });

    return {
      totalLocks: locks.length,
      lockedUnits: uniqueUnits.size,
      oldestLock,
      newestLock
    };
  }
}

// Instancia singleton para uso global
export const temporaryLockManager = new TemporaryLockManager();

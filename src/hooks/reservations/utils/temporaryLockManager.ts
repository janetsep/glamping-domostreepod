
interface TemporaryLock {
  unitIds: string[];
  checkIn: Date;
  checkOut: Date;
  sessionId: string;
  expiresAt: Date;
  requiredUnits: number;
}

class TemporaryLockManager {
  private locks: Map<string, TemporaryLock> = new Map();
  private lockDuration = 15 * 60 * 1000; // 15 minutos

  constructor() {
    // Limpiar bloqueos expirados cada minuto
    setInterval(() => this.cleanupExpiredLocks(), 60000);
  }

  private cleanupExpiredLocks() {
    const now = new Date();
    const expiredKeys: string[] = [];

    for (const [key, lock] of this.locks.entries()) {
      if (lock.expiresAt <= now) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => {
      const lock = this.locks.get(key);
      this.locks.delete(key);
      console.log(`🗑️ [TemporaryLock] Bloqueo expirado eliminado: ${key}`, {
        sessionId: lock?.sessionId,
        unidades: lock?.unitIds
      });
    });

    if (expiredKeys.length > 0) {
      console.log(`🧹 [TemporaryLock] Limpieza completada: ${expiredKeys.length} bloqueos expirados eliminados`);
    }
  }

  private generateLockKey(unitIds: string[], checkIn: Date, checkOut: Date, sessionId: string): string {
    const unitStr = unitIds.sort().join(',');
    const dateStr = `${checkIn.toISOString().split('T')[0]}_${checkOut.toISOString().split('T')[0]}`;
    return `${sessionId}_${unitStr}_${dateStr}`;
  }

  async acquireLock(
    unitIds: string[],
    checkIn: Date,
    checkOut: Date,
    requiredUnits: number,
    sessionId?: string
  ): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    
    const finalSessionId = sessionId || `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    console.log('🔐 [TemporaryLock] Intentando adquirir bloqueo:', {
      unitIds,
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      requiredUnits,
      sessionId: finalSessionId
    });

    // Limpiar bloqueos expirados antes de verificar
    this.cleanupExpiredLocks();

    // Verificar si alguna de las unidades ya está bloqueada por otra sesión
    const now = new Date();
    const conflictingLocks: string[] = [];

    for (const [key, lock] of this.locks.entries()) {
      if (lock.sessionId !== finalSessionId && lock.expiresAt > now) {
        // Verificar solapamiento de fechas
        const datesOverlap = checkIn < new Date(lock.checkOut) && checkOut > new Date(lock.checkIn);
        
        if (datesOverlap) {
          // Verificar solapamiento de unidades
          const unitsOverlap = unitIds.some(unitId => lock.unitIds.includes(unitId));
          
          if (unitsOverlap) {
            conflictingLocks.push(key);
          }
        }
      }
    }

    if (conflictingLocks.length > 0) {
      console.log('⚠️ [TemporaryLock] Conflicto detectado:', conflictingLocks);
      return {
        success: false,
        error: 'Algunas unidades están siendo reservadas por otro usuario. Inténtalo de nuevo en unos minutos.'
      };
    }

    // Crear el bloqueo
    const lockKey = this.generateLockKey(unitIds, checkIn, checkOut, finalSessionId);
    const expiresAt = new Date(now.getTime() + this.lockDuration);

    const lock: TemporaryLock = {
      unitIds: [...unitIds],
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      sessionId: finalSessionId,
      expiresAt,
      requiredUnits
    };

    this.locks.set(lockKey, lock);

    console.log('✅ [TemporaryLock] Bloqueo adquirido exitosamente:', {
      lockKey,
      sessionId: finalSessionId,
      expiresAt: expiresAt.toISOString(),
      unidades: unitIds
    });

    return {
      success: true,
      sessionId: finalSessionId
    };
  }

  releaseLock(unitIds: string[], checkIn: Date, checkOut: Date, sessionId: string): boolean {
    const lockKey = this.generateLockKey(unitIds, checkIn, checkOut, sessionId);
    
    if (this.locks.has(lockKey)) {
      this.locks.delete(lockKey);
      console.log('🔓 [TemporaryLock] Bloqueo liberado para sesión', sessionId);
      return true;
    } else {
      console.log('⚠️ [TemporaryLock] Intento de liberar bloqueo inexistente:', sessionId);
      return false;
    }
  }

  extendLock(unitIds: string[], checkIn: Date, checkOut: Date, sessionId: string): boolean {
    const lockKey = this.generateLockKey(unitIds, checkIn, checkOut, sessionId);
    const lock = this.locks.get(lockKey);
    
    if (lock && lock.sessionId === sessionId) {
      lock.expiresAt = new Date(Date.now() + this.lockDuration);
      console.log('⏰ [TemporaryLock] Bloqueo extendido para sesión', sessionId);
      return true;
    }
    
    return false;
  }

  getLockedUnits(checkIn: Date, checkOut: Date): string[] {
    this.cleanupExpiredLocks();
    
    const now = new Date();
    const lockedUnits: string[] = [];

    for (const lock of this.locks.values()) {
      if (lock.expiresAt > now) {
        // Verificar solapamiento de fechas
        const datesOverlap = checkIn < new Date(lock.checkOut) && checkOut > new Date(lock.checkIn);
        
        if (datesOverlap) {
          lockedUnits.push(...lock.unitIds);
        }
      }
    }

    const uniqueLockedUnits = [...new Set(lockedUnits)];
    
    if (uniqueLockedUnits.length > 0) {
      console.log('🔒 [TemporaryLock] Unidades bloqueadas encontradas:', uniqueLockedUnits);
    }

    return uniqueLockedUnits;
  }

  getLockInfo(): Array<{ sessionId: string; unitIds: string[]; expiresAt: Date; checkIn: Date; checkOut: Date }> {
    this.cleanupExpiredLocks();
    
    return Array.from(this.locks.values()).map(lock => ({
      sessionId: lock.sessionId,
      unitIds: [...lock.unitIds],
      expiresAt: new Date(lock.expiresAt),
      checkIn: new Date(lock.checkIn),
      checkOut: new Date(lock.checkOut)
    }));
  }
}

// Instancia singleton
export const temporaryLockManager = new TemporaryLockManager();

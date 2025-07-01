
import { supabase } from '@/lib/supabase';

interface TemporaryLock {
  unitIds: string[];
  sessionId: string;
  checkIn: Date;
  checkOut: Date;
  expiresAt: Date;
  guests: number;
}

// Cache en memoria para bloqueos temporales
const temporaryLocks = new Map<string, TemporaryLock>();
const LOCK_DURATION_MINUTES = 15;

export class TemporaryLockManager {
  private static instance: TemporaryLockManager;
  private cleanupInterval: NodeJS.Timeout;

  private constructor() {
    // Limpiar bloqueos expirados cada 2 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredLocks();
    }, 2 * 60 * 1000);
  }

  public static getInstance(): TemporaryLockManager {
    if (!TemporaryLockManager.instance) {
      TemporaryLockManager.instance = new TemporaryLockManager();
    }
    return TemporaryLockManager.instance;
  }

  /**
   * Intenta adquirir un bloqueo temporal para las unidades especificadas
   */
  public async acquireLock(
    unitIds: string[],
    checkIn: Date,
    checkOut: Date,
    guests: number,
    sessionId: string = this.generateSessionId()
  ): Promise<{ success: boolean; lockedUnits?: string[]; error?: string }> {
    
    console.log('🔒 [TemporaryLock] Intentando adquirir bloqueo:', {
      unitIds,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests,
      sessionId
    });

    // Verificar si las unidades están disponibles (sin bloqueos existentes)
    const conflictingLocks = this.findConflictingLocks(unitIds, checkIn, checkOut, sessionId);
    
    if (conflictingLocks.length > 0) {
      return {
        success: false,
        error: `Las unidades ${conflictingLocks.join(', ')} están siendo procesadas por otro usuario. Intenta nuevamente en unos minutos.`
      };
    }

    // Crear el bloqueo
    const lockKey = this.generateLockKey(unitIds, checkIn, checkOut);
    const expiresAt = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
    
    const lock: TemporaryLock = {
      unitIds,
      sessionId,
      checkIn,
      checkOut,
      expiresAt,
      guests
    };

    temporaryLocks.set(lockKey, lock);

    console.log('✅ [TemporaryLock] Bloqueo adquirido exitosamente:', lockKey);
    
    return {
      success: true,
      lockedUnits: unitIds
    };
  }

  /**
   * Libera un bloqueo temporal específico
   */
  public releaseLock(
    unitIds: string[],
    checkIn: Date,
    checkOut: Date,
    sessionId: string
  ): void {
    const lockKey = this.generateLockKey(unitIds, checkIn, checkOut);
    const lock = temporaryLocks.get(lockKey);
    
    if (lock && lock.sessionId === sessionId) {
      temporaryLocks.delete(lockKey);
      console.log('🔓 [TemporaryLock] Bloqueo liberado:', lockKey);
    }
  }

  /**
   * Extiende la duración de un bloqueo existente
   */
  public extendLock(
    unitIds: string[],
    checkIn: Date,
    checkOut: Date,
    sessionId: string
  ): boolean {
    const lockKey = this.generateLockKey(unitIds, checkIn, checkOut);
    const lock = temporaryLocks.get(lockKey);
    
    if (lock && lock.sessionId === sessionId) {
      lock.expiresAt = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
      console.log('⏰ [TemporaryLock] Bloqueo extendido:', lockKey);
      return true;
    }
    
    return false;
  }

  /**
   * Obtiene todas las unidades bloqueadas para un rango de fechas
   */
  public getLockedUnits(checkIn: Date, checkOut: Date): string[] {
    const now = new Date();
    const lockedUnits: string[] = [];
    
    for (const [key, lock] of temporaryLocks.entries()) {
      // Verificar si el bloqueo no ha expirado
      if (lock.expiresAt > now) {
        // Verificar si hay solapamiento de fechas
        if (this.datesOverlap(lock.checkIn, lock.checkOut, checkIn, checkOut)) {
          lockedUnits.push(...lock.unitIds);
        }
      }
    }
    
    return [...new Set(lockedUnits)]; // Eliminar duplicados
  }

  /**
   * Encuentra bloqueos que conflictan con las unidades especificadas
   */
  private findConflictingLocks(
    unitIds: string[],
    checkIn: Date,
    checkOut: Date,
    excludeSessionId: string
  ): string[] {
    const now = new Date();
    const conflicts: string[] = [];
    
    for (const [key, lock] of temporaryLocks.entries()) {
      // Saltar si es el mismo session
      if (lock.sessionId === excludeSessionId) continue;
      
      // Saltar si el bloqueo ha expirado
      if (lock.expiresAt <= now) continue;
      
      // Verificar solapamiento de fechas
      if (this.datesOverlap(lock.checkIn, lock.checkOut, checkIn, checkOut)) {
        // Verificar si alguna unidad está en conflicto
        const conflictingUnits = unitIds.filter(id => lock.unitIds.includes(id));
        conflicts.push(...conflictingUnits);
      }
    }
    
    return [...new Set(conflicts)];
  }

  /**
   * Verifica si dos rangos de fechas se solapan
   */
  private datesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 < end2 && end1 > start2;
  }

  /**
   * Limpia bloqueos expirados
   */
  private cleanupExpiredLocks(): void {
    const now = new Date();
    let cleanedCount = 0;
    
    for (const [key, lock] of temporaryLocks.entries()) {
      if (lock.expiresAt <= now) {
        temporaryLocks.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 [TemporaryLock] Limpiados ${cleanedCount} bloqueos expirados`);
    }
  }

  /**
   * Genera una clave única para el bloqueo
   */
  private generateLockKey(unitIds: string[], checkIn: Date, checkOut: Date): string {
    const sortedIds = [...unitIds].sort().join('-');
    const checkInStr = checkIn.toISOString().split('T')[0];
    const checkOutStr = checkOut.toISOString().split('T')[0];
    return `${sortedIds}-${checkInStr}-${checkOutStr}`;
  }

  /**
   * Genera un ID de sesión único
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Limpia todos los recursos
   */
  public cleanup(): void {
    clearInterval(this.cleanupInterval);
    temporaryLocks.clear();
  }
}

// Exportar instancia singleton
export const temporaryLockManager = TemporaryLockManager.getInstance();

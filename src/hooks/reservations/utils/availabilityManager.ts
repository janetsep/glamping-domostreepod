import { supabase } from '@/lib/supabase';
import { addMinutes, isBefore, isAfter, differenceInMinutes } from 'date-fns';

interface DateRange {
  start: Date;
  end: Date;
}

interface TemporaryLock {
  unitId: string;
  dateRange: DateRange;
  expiresAt: Date;
  sessionId: string;
}

// Cache para disponibilidad
const availabilityCache = new Map<string, {
  data: { isAvailable: boolean; availableDomes: number; requiredDomes: number; error?: string; availableUnitIds: string[] };
  timestamp: number;
}>();

// Cache para bloqueos temporales
const temporaryLocks = new Map<string, TemporaryLock>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const LOCK_DURATION = 15 * 60 * 1000; // 15 minutos
const MAX_FUTURE_DAYS = 365; // 1 año máximo para reservas futuras
const TOTAL_DOMOS = 4; // Añadir declaración de la constante

export class AvailabilityManager {
  private static instance: AvailabilityManager;
  private cleanupInterval: NodeJS.Timeout;

  private constructor() {
    // Limpiar bloqueos expirados cada minuto
    this.cleanupInterval = setInterval(() => this.cleanupExpiredLocks(), 60000);
  }

  public static getInstance(): AvailabilityManager {
    if (!AvailabilityManager.instance) {
      AvailabilityManager.instance = new AvailabilityManager();
    }
    return AvailabilityManager.instance;
  }

  // Validación de fechas
  public validateDateRange(checkIn: Date, checkOut: Date): { isValid: boolean; error?: string } {
    const now = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setDate(maxFutureDate.getDate() + MAX_FUTURE_DAYS);

    if (isBefore(checkIn, now)) {
      return { isValid: false, error: 'No se pueden seleccionar fechas pasadas' };
    }

    if (isAfter(checkIn, maxFutureDate)) {
      return { isValid: false, error: `No se pueden hacer reservas con más de ${MAX_FUTURE_DAYS} días de anticipación` };
    }

    if (isBefore(checkOut, checkIn)) {
      return { isValid: false, error: 'La fecha de salida debe ser posterior a la fecha de entrada' };
    }

    const nights = differenceInMinutes(checkOut, checkIn) / (60 * 24);
    if (nights < 1) {
      return { isValid: false, error: 'La estadía mínima es de 1 noche' };
    }

    return { isValid: true };
  }

  // Bloqueo temporal de fechas
  public async acquireTemporaryLock(
    unitId: string,
    dateRange: DateRange,
    sessionId: string
  ): Promise<{ success: boolean; error?: string }> {
    const lockKey = this.getLockKey(unitId, dateRange);
    
    // Verificar si ya existe un bloqueo activo
    const existingLock = temporaryLocks.get(lockKey);
    if (existingLock && isAfter(existingLock.expiresAt, new Date())) {
      return { 
        success: false, 
        error: 'Estas fechas están siendo reservadas por otro usuario. Por favor, intenta nuevamente en unos minutos.' 
      };
    }

    // Crear nuevo bloqueo
    const lock: TemporaryLock = {
      unitId,
      dateRange,
      expiresAt: addMinutes(new Date(), 15), // 15 minutos de bloqueo
      sessionId
    };

    temporaryLocks.set(lockKey, lock);
    return { success: true };
  }

  // Liberar bloqueo
  public releaseTemporaryLock(unitId: string, dateRange: DateRange, sessionId: string): void {
    const lockKey = this.getLockKey(unitId, dateRange);
    const lock = temporaryLocks.get(lockKey);
    
    if (lock && lock.sessionId === sessionId) {
      temporaryLocks.delete(lockKey);
    }
  }

  /**
   * Verifica cuántos domos están disponibles para un rango de fechas y si hay suficientes para la cantidad de huéspedes
   * @param guests cantidad de huéspedes
   */
  public async checkAvailability(
    guests: number,
    dateRange: DateRange,
    forceRefresh: boolean = false
  ): Promise<{ isAvailable: boolean; availableDomes: number; requiredDomes: number; error?: string; availableUnitIds: string[] }> {
    console.log('🔍 [AvailabilityManager] checkAvailability - INICIO');
    console.log('🔍 [AvailabilityManager] Parámetros:', { guests, dateRange, forceRefresh });
    
    const cacheKey = this.getCacheKey(`all`, dateRange) + `-guests-${guests}`;
    const now = Date.now();

    // Verificar caché
    if (!forceRefresh) {
      const cachedData = availabilityCache.get(cacheKey);
      if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
        console.log('🔍 [AvailabilityManager] Usando datos de caché');
        // Verificar si los datos en caché tienen la nueva propiedad availableUnitIds
        if ('availableUnitIds' in cachedData.data && Array.isArray(cachedData.data.availableUnitIds)) {
          return cachedData.data; // Usar caché si es válida y tiene la nueva estructura
        } else {
          console.log('🔍 [AvailabilityManager] Caché válida encontrada, pero falta availableUnitIds o la estructura es antigua. Forzando refresco.');
          // Invalidar esta entrada de caché o simplemente no usarla y forzar el refresco.
          // Al no retornar aquí, el código continuará y realizará la consulta a la BD.
          forceRefresh = true; // Asegurar que la consulta a la BD se realice
        }
      }
    }

    if (!forceRefresh) { // Re-check forceRefresh after potential change
       console.log('🔍 [AvailabilityManager] No hay caché válida o forzando refresco');
    } else {
        console.log('🔍 [AvailabilityManager] Forzando refresco después de revisar caché.');
    }

    // Validar fechas
    const validation = this.validateDateRange(dateRange.start, dateRange.end);
    if (!validation.isValid) {
      console.log('❌ [AvailabilityManager] Validación de fechas fallida:', validation.error);
      return { isAvailable: false, availableDomes: 0, requiredDomes: 0, error: validation.error, availableUnitIds: [] };
    }
    console.log('✅ [AvailabilityManager] Validación de fechas exitosa');

    try {
      // 1. Obtener todos los domos
      console.log('🔍 [AvailabilityManager] Consultando todos los glamping_units...');
      const { data: units, error: unitError } = await supabase
        .from('glamping_units')
        .select('id');
      if (unitError) {
        console.error('❌ [AvailabilityManager] Error al obtener unidades:', unitError);
        throw unitError;
      }
      if (!units || units.length === 0) {
        console.log('[DEBUG] No hay domos registrados.');
        return { isAvailable: false, availableDomes: 0, requiredDomes: 0, error: 'No hay domos registrados.', availableUnitIds: [] };
      }
      const allUnitIds = units.map((u: any) => String(u.id));
      console.log('✅ [AvailabilityManager] Unidades obtenidas. allUnitIds:', allUnitIds);

      // 2. Obtener todas las reservas cruzadas para esos domos
      console.log('🔍 [AvailabilityManager] Consultando reservas cruzadas...');
      console.log('🔍 [AvailabilityManager] Rango de consulta:', { start: dateRange.start.toISOString(), end: dateRange.end.toISOString() });
      const { data: reservations, error } = await supabase
        .from('reservations')
        .select('unit_id, check_in, check_out, status')
        .in('unit_id', allUnitIds)
        .or(`and(check_in.lt.${dateRange.end.toISOString()},check_out.gt.${dateRange.start.toISOString()})`)
        .eq('status', 'confirmed');
      if (error) {
        console.error('❌ [AvailabilityManager] Error al obtener reservas:', error);
        throw error;
      }
      console.log('✅ [AvailabilityManager] Reservas obtenidas. reservations:', reservations);

      // 3. Filtrar domos ocupados
      const uniqueReservedUnitIds = new Set(reservations ? reservations.map((r: any) => String(r.unit_id)).filter(id => id !== 'null' && id !== 'undefined') : []);
      const reservedDomosCount = uniqueReservedUnitIds.size;

      console.log('🔍 [AvailabilityManager] uniqueReservedUnitIds (domos únicos reservados en rango):', Array.from(uniqueReservedUnitIds));
      console.log('🔍 [AvailabilityManager] reservedDomosCount (cantidad de domos únicos reservados):', reservedDomosCount);

      // Calcular domos disponibles
      const availableDomes = allUnitIds.length - reservedDomosCount;
      console.log('🔍 [AvailabilityManager] availableDomes (total domos - domos únicos reservados):', availableDomes);

      // Identificar los IDs de los domos disponibles
      const availableUnitIds = allUnitIds.filter((id: string) => !uniqueReservedUnitIds.has(id));
      console.log('🔍 [AvailabilityManager] availableUnitIds (domos REALMENTE disponibles): ', availableUnitIds);

      // 4. Calcular domos requeridos
      const requiredDomes = Math.ceil(guests / 4);
      console.log('🔍 [AvailabilityManager] requiredDomes (basado en huéspedes):', requiredDomes);
      console.log('🔍 [AvailabilityManager] Comparación: requiredDomes:', requiredDomes, 'availableDomes:', availableDomes);

      // 5. Verificar si hay suficientes domos
      const isAvailable = availableDomes >= requiredDomes;

      // Actualizar caché
      availabilityCache.set(cacheKey, {
        data: { isAvailable, availableDomes, requiredDomes, availableUnitIds }, // Asegurar que availableUnitIds se guarde en caché
        timestamp: now
      });
      console.log('✅ [AvailabilityManager] Resultado final (antes de la validación de suficiencia):', { isAvailable, availableDomes, requiredDomes });

      if (!isAvailable) {
        console.log('❌ [AvailabilityManager] No hay suficientes domos disponibles para la reserva.');
        return {
          isAvailable: false,
          availableDomes,
          requiredDomes,
          error: `No hay suficientes domos disponibles. Se necesitan ${requiredDomes} domo${requiredDomes > 1 ? 's' : ''} para ${guests} huésped${guests > 1 ? 'es' : ''}, pero solo hay ${availableDomes} disponible${availableDomes > 1 ? 's' : ''}.`,
          availableUnitIds: [] // Si no hay suficiente disponibilidad, no hay domos disponibles para la reserva
        };
      }

      console.log('✅ [AvailabilityManager] Suficientes domos disponibles.');
      return { isAvailable, availableDomes, requiredDomes, availableUnitIds: availableUnitIds }; // Retornar los IDs de domos disponibles calculados
    } catch (error) {
      console.error('❌ [AvailabilityManager] Error general en checkAvailability:', error);
      return { isAvailable: false, availableDomes: 0, requiredDomes: 0, error: 'Error al verificar disponibilidad', availableUnitIds: [] };
    }
  }

  // Limpiar bloqueos expirados
  private cleanupExpiredLocks(): void {
    const now = new Date();
    for (const [key, lock] of temporaryLocks.entries()) {
      if (isBefore(lock.expiresAt, now)) {
        temporaryLocks.delete(key);
      }
    }
  }

  // Utilidades
  private getLockKey(unitId: string, dateRange: DateRange): string {
    return `${unitId}-${dateRange.start.toISOString()}-${dateRange.end.toISOString()}`;
  }

  private getCacheKey(unitId: string, dateRange: DateRange): string {
    return `${unitId}-${dateRange.start.toISOString()}-${dateRange.end.toISOString()}`;
  }

  // Limpiar recursos
  public cleanup(): void {
    clearInterval(this.cleanupInterval);
    availabilityCache.clear();
    temporaryLocks.clear();
  }
} 
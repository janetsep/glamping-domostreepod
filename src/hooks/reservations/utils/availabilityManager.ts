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
    console.log('🔍 [AvailabilityManager] Parámetros:', { 
      guests, 
      dateRange: {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString()
      }, 
      forceRefresh 
    });
    
    const cacheKey = this.getCacheKey(`all`, dateRange) + `-guests-${guests}`;
    const now = Date.now();

    // Verificar caché
    if (!forceRefresh) {
      const cachedData = availabilityCache.get(cacheKey);
      if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
        console.log('🔍 [AvailabilityManager] Usando datos de caché:', cachedData.data);
        if ('availableUnitIds' in cachedData.data && Array.isArray(cachedData.data.availableUnitIds)) {
          return cachedData.data;
        } else {
          console.log('🔍 [AvailabilityManager] Caché inválida, forzando refresco');
          forceRefresh = true;
        }
      }
    }

    try {
      // 1. Obtener todos los domos
      console.log('🔍 [AvailabilityManager] Consultando glamping_units...');
      const { data: units, error: unitError } = await supabase
        .from('glamping_units')
        .select('id, max_guests, name')
        .order('max_guests', { ascending: false });

      if (unitError) {
        console.error('❌ [AvailabilityManager] Error al obtener unidades:', unitError);
        throw unitError;
      }

      if (!units || units.length === 0) {
        console.error('❌ [AvailabilityManager] No hay domos registrados');
        return { isAvailable: false, availableDomes: 0, requiredDomes: 0, error: 'No hay domos registrados.', availableUnitIds: [] };
      }

      console.log('✅ [AvailabilityManager] Unidades obtenidas:', {
        total: units.length,
        unidades: units.map(u => ({ 
          id: u.id, 
          nombre: u.name,
          capacidad: u.max_guests 
        }))
      });

      // 2. Obtener reservas solapadas
      console.log('🔍 [AvailabilityManager] Consultando reservas solapadas...');
      const { data: reservations, error } = await supabase
        .from('reservations')
        .select('unit_id, check_in, check_out, status, reservation_code')
        .in('unit_id', units.map(u => u.id))
        .or(`and(check_in.lt.${dateRange.end.toISOString()},check_out.gt.${dateRange.start.toISOString()})`)
        .eq('status', 'confirmed');

      if (error) {
        console.error('❌ [AvailabilityManager] Error al obtener reservas:', error);
        throw error;
      }

      console.log('📊 [AvailabilityManager] Reservas encontradas:', {
        total: reservations?.length || 0,
        reservas: reservations?.map(r => ({
          unidad: r.unit_id,
          checkIn: r.check_in,
          checkOut: r.check_out,
          estado: r.status,
          codigo: r.reservation_code
        }))
      });

      // 3. Filtrar domos ocupados
      const uniqueReservedUnitIds = new Set(
        reservations
          ?.filter(r => r.unit_id !== null && r.unit_id !== undefined)
          .map(r => String(r.unit_id)) || []
      );

      console.log('📊 [AvailabilityManager] Análisis de disponibilidad:', {
        totalUnidades: units.length,
        unidadesReservadas: uniqueReservedUnitIds.size,
        unidadesDisponibles: units.length - uniqueReservedUnitIds.size,
        unidadesReservadasIds: Array.from(uniqueReservedUnitIds),
        unidadesDisponiblesIds: units
          .map(u => u.id)
          .filter(id => !uniqueReservedUnitIds.has(String(id)))
      });

      // Calcular domos disponibles
      const availableDomes = units.length - uniqueReservedUnitIds.size;
      const availableUnitIds = units
        .map(u => u.id)
        .filter(id => !uniqueReservedUnitIds.has(String(id)));

      // 4. Calcular domos requeridos
      const requiredDomes = Math.ceil(guests / 4);
      console.log('📊 [AvailabilityManager] Cálculo de domos requeridos:', {
        huéspedes: guests,
        domosRequeridos: requiredDomes,
        domosDisponibles: availableDomes,
        unidadesDisponiblesIds: availableUnitIds,
        capacidadPorDomo: 4
      });

      // 5. Verificar disponibilidad
      const isAvailable = availableDomes >= requiredDomes;

      // Actualizar caché
      const result = { 
        isAvailable, 
        availableDomes, 
        requiredDomes, 
        availableUnitIds 
      };
      
      availabilityCache.set(cacheKey, {
        data: result,
        timestamp: now
      });

      console.log('✅ [AvailabilityManager] Resultado final:', {
        ...result,
        fechas: {
          checkIn: dateRange.start.toISOString(),
          checkOut: dateRange.end.toISOString()
        }
      });

      if (!isAvailable) {
        return {
          ...result,
          error: `No hay suficientes domos disponibles. Se necesitan ${requiredDomes} domo${requiredDomes > 1 ? 's' : ''} para ${guests} huésped${guests > 1 ? 'es' : ''}, pero solo hay ${availableDomes} disponible${availableDomes > 1 ? 's' : ''}.`,
          availableUnitIds: []
        };
      }

      return result;
    } catch (error) {
      console.error('❌ [AvailabilityManager] Error general:', error);
      return { 
        isAvailable: false, 
        availableDomes: 0, 
        requiredDomes: 0, 
        error: 'Error al verificar disponibilidad', 
        availableUnitIds: [] 
      };
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

// Instancia singleton para exportar
export const availabilityManager = AvailabilityManager.getInstance();
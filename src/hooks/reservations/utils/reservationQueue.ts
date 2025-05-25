import { supabase } from '@/lib/supabase';
import { AvailabilityManager } from './availabilityManager';
import { v4 as uuidv4 } from 'uuid';

interface ReservationRequest {
  unitId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  sessionId: string;
  activities: string[];
  packages: string[];
}

interface QueueItem {
  id: string;
  request: ReservationRequest;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: Date;
}

export class ReservationQueue {
  private static instance: ReservationQueue;
  private queue: Map<string, QueueItem>;
  private processing: boolean;
  private availabilityManager: AvailabilityManager;

  private constructor() {
    this.queue = new Map();
    this.processing = false;
    this.availabilityManager = AvailabilityManager.getInstance();
  }

  public static getInstance(): ReservationQueue {
    if (!ReservationQueue.instance) {
      ReservationQueue.instance = new ReservationQueue();
    }
    return ReservationQueue.instance;
  }

  // Añadir reserva a la cola
  public async enqueueReservation(request: ReservationRequest): Promise<{ 
    queueId: string; 
    status: 'queued' | 'error';
    error?: string;
  }> {
    try {
      // Verificar disponibilidad antes de encolar
      const availability = await this.availabilityManager.checkAvailability(
        request.unitId,
        { start: request.checkIn, end: request.checkOut }
      );

      if (!availability.isAvailable) {
        return {
          queueId: '',
          status: 'error',
          error: availability.error || 'No hay disponibilidad para las fechas seleccionadas'
        };
      }

      // Intentar adquirir bloqueo temporal
      const lockResult = await this.availabilityManager.acquireTemporaryLock(
        request.unitId,
        { start: request.checkIn, end: request.checkOut },
        request.sessionId
      );

      if (!lockResult.success) {
        return {
          queueId: '',
          status: 'error',
          error: lockResult.error
        };
      }

      const queueId = uuidv4();
      const queueItem: QueueItem = {
        id: queueId,
        request,
        status: 'pending',
        createdAt: new Date()
      };

      this.queue.set(queueId, queueItem);
      this.processQueue();

      return { queueId, status: 'queued' };
    } catch (error) {
      console.error('Error al encolar reserva:', error);
      return {
        queueId: '',
        status: 'error',
        error: 'Error al procesar la solicitud de reserva'
      };
    }
  }

  // Procesar la cola de reservas
  private async processQueue(): Promise<void> {
    if (this.processing) return;

    this.processing = true;
    try {
      for (const [queueId, item] of this.queue.entries()) {
        if (item.status === 'pending') {
          await this.processReservation(queueId, item);
        }
      }
    } finally {
      this.processing = false;
    }
  }

  // Procesar una reserva individual
  private async processReservation(queueId: string, item: QueueItem): Promise<void> {
    try {
      this.queue.set(queueId, { ...item, status: 'processing' });

      // Iniciar transacción
      const { data: transaction, error: transactionError } = await supabase.rpc(
        'begin_transaction'
      );

      if (transactionError) throw transactionError;

      try {
        // Crear la reserva
        const { data: reservation, error: reservationError } = await supabase
          .from('reservations')
          .insert({
            unit_id: item.request.unitId,
            check_in: item.request.checkIn.toISOString(),
            check_out: item.request.checkOut.toISOString(),
            guests: item.request.guests,
            total_price: item.request.totalPrice,
            status: 'pending',
            payment_method: 'webpay',
            selected_activities: item.request.activities,
            selected_packages: item.request.packages,
            transaction_id: transaction.id
          })
          .select()
          .single();

        if (reservationError) throw reservationError;

        // Confirmar transacción
        await supabase.rpc('commit_transaction', { transaction_id: transaction.id });

        // Actualizar estado de la cola
        this.queue.set(queueId, { ...item, status: 'completed' });

        // Liberar bloqueo temporal
        this.availabilityManager.releaseTemporaryLock(
          item.request.unitId,
          { start: item.request.checkIn, end: item.request.checkOut },
          item.request.sessionId
        );

      } catch (error) {
        // Revertir transacción en caso de error
        await supabase.rpc('rollback_transaction', { transaction_id: transaction.id });
        throw error;
      }
    } catch (error) {
      console.error('Error procesando reserva:', error);
      this.queue.set(queueId, {
        ...item,
        status: 'failed',
        error: 'Error al procesar la reserva'
      });

      // Liberar bloqueo temporal en caso de error
      this.availabilityManager.releaseTemporaryLock(
        item.request.unitId,
        { start: item.request.checkIn, end: item.request.checkOut },
        item.request.sessionId
      );
    }
  }

  // Obtener estado de una reserva en cola
  public getQueueItemStatus(queueId: string): QueueItem | null {
    return this.queue.get(queueId) || null;
  }

  // Limpiar cola
  public cleanup(): void {
    this.queue.clear();
    this.processing = false;
  }
} 
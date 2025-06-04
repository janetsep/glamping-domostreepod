
import { v4 as uuidv4 } from 'uuid';

interface QueueItem {
  id: string;
  request: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: number;
  error?: string;
}

export class ReservationQueue {
  private static instance: ReservationQueue;
  private queue: QueueItem[] = [];
  private processing = false;

  private constructor() {}

  public static getInstance(): ReservationQueue {
    if (!ReservationQueue.instance) {
      ReservationQueue.instance = new ReservationQueue();
    }
    return ReservationQueue.instance;
  }

  public async enqueueReservation(request: any): Promise<{ queueId: string; status: string; error?: string }> {
    try {
      const queueId = uuidv4();
      const queueItem: QueueItem = {
        id: queueId,
        request,
        status: 'pending',
        timestamp: Date.now()
      };
      
      this.queue.push(queueItem);
      this.processQueue();
      
      return { queueId, status: 'queued' };
    } catch (error) {
      return { queueId: '', status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  public getQueueItemStatus(queueId: string): QueueItem | null {
    return this.queue.find(item => item.id === queueId) || null;
  }

  public cleanup(): void {
    this.queue = [];
    this.processing = false;
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue.find(i => i.status === 'pending');
      if (!item) break;
      
      item.status = 'processing';
      
      try {
        await this.processReservation(item.request);
        item.status = 'completed';
      } catch (error) {
        item.status = 'failed';
        item.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }
    
    this.processing = false;
  }

  private async processReservation(request: any): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Processing reservation: ${request.unitId} at ${new Date()}`);
        resolve();
      }, 1000);
    });
  }

  public addToQueue(data: any, timestamp?: number) {
    this.queue.push({
      id: Date.now().toString(),
      request: data,
      status: 'pending',
      timestamp: timestamp || Date.now()
    });
    this.processQueue();
  }
}

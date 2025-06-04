import { v4 as uuidv4 } from 'uuid';

export class ReservationQueue {
  private static instance: ReservationQueue;
  private queue: Array<{ id: string; data: any; timestamp: number }> = [];
  private processing = false;

  private constructor() {}

  public static getInstance(): ReservationQueue {
    if (!ReservationQueue.instance) {
      ReservationQueue.instance = new ReservationQueue();
    }
    return ReservationQueue.instance;
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        try {
          // Process reservation - convert string to number if needed
          const timeout = typeof item.timestamp === 'string' ? parseInt(item.timestamp, 10) : item.timestamp;
          await this.processReservation(item.data, timeout);
        } catch (error) {
          console.error('Error processing reservation:', error);
        }
      }
    }
    
    this.processing = false;
  }

  private async processReservation(data: any, timestamp: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Processing reservation: ${data.id} at ${new Date()}`);
        resolve(true);
      }, timestamp);
    });
  }

  public addToQueue(data: any, timestamp?: number) {
    this.queue.push({
      id: Date.now().toString(),
      data,
      timestamp: timestamp || Date.now()
    });
    this.processQueue();
  }
}

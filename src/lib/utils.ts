import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Returns a user-friendly reservation ID 
 * Uses the reservation_code if available, otherwise generates one from the UUID
 */
export function formatReservationId(uuid: string, reservation_code?: string): string {
  if (!uuid) return 'N/A';
  
  // If reservation_code is provided, use it
  if (reservation_code) {
    return reservation_code;
  }
  
  // Otherwise generate from UUID (legacy support)
  const uuidParts = uuid.split('-');
  const numbers = uuidParts[0].substring(0, 4);
  const letters = uuidParts[1].substring(0, 2).toUpperCase();
  
  return `${numbers}${letters}`;
}


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
 * Creates a user-friendly reservation ID from a UUID
 * Returns a 4-digit number + 2 uppercase letters
 */
export function formatReservationId(uuid: string): string {
  if (!uuid) return 'N/A';
  
  // Extract parts from the UUID
  const uuidParts = uuid.split('-');
  
  // Take the first 4 digits from the first part
  const numbers = uuidParts[0].substring(0, 4);
  
  // Take the first 2 characters from the second part and convert to uppercase
  const letters = uuidParts[1].substring(0, 2).toUpperCase();
  
  // Combine into a user-friendly format
  return `${numbers}${letters}`;
}

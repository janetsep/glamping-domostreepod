
// Main entry point for WebPay service
// Re-export all service functions for backward compatibility

export type { TransactionResult } from './types';
export { saveTokenToReservation } from './tokenService';
export { confirmTransaction, updateReservationIfNeeded } from './confirmationService';
export { usePayment } from './paymentService';

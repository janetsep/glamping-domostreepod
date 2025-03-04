
import React from 'react';
import PaymentProcessing from './PaymentProcessing';
import PaymentError from './PaymentError';
import PaymentSuccess from './PaymentSuccess';
import { TransactionResult } from '@/services/webpay';

interface TransactionStatusProps {
  isLoading: boolean;
  error: string | null;
  transactionResult: TransactionResult | null;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  isLoading,
  error,
  transactionResult
}) => {
  // Loading state
  if (isLoading) {
    return <PaymentProcessing />;
  }

  // Error state
  if (error) {
    return <PaymentError errorMessage={error} />;
  }

  // Success state
  if (transactionResult) {
    return transactionResult.response_code === 0 ? (
      <PaymentSuccess transaction={transactionResult} />
    ) : (
      <PaymentError errorMessage={`Error en el pago: Código ${transactionResult.response_code}`} />
    );
  }

  // Should never reach here
  return null;
};

export default TransactionStatus;

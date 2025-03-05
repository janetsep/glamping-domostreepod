
import React from 'react';
import PaymentProcessing from './PaymentProcessing';
import PaymentError from './PaymentError';
import PaymentSuccess from './PaymentSuccess';
import { TransactionResult } from '@/services/webpay';

interface TransactionStatusProps {
  isLoading: boolean;
  error: string | null;
  transactionResult: TransactionResult | null;
  onSendEmail?: () => Promise<void>;
  isEmailSending?: boolean;
  emailSent?: boolean;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  isLoading,
  error,
  transactionResult,
  onSendEmail,
  isEmailSending,
  emailSent
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
      <PaymentSuccess 
        transaction={transactionResult} 
        onSendEmail={onSendEmail}
        isEmailSending={isEmailSending}
        emailSent={emailSent}
      />
    ) : (
      <PaymentError errorMessage={`Error en el pago: Código ${transactionResult.response_code}`} />
    );
  }

  // Should never reach here
  return null;
};

export default TransactionStatus;

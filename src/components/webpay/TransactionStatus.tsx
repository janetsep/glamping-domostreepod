
import React, { useEffect } from 'react';
import PaymentProcessing from './PaymentProcessing';
import PaymentError from './PaymentError';
import PaymentSuccess from './PaymentSuccess';
import { TransactionResult } from '@/services/webpay';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  // Auto-redirect after a timeout if stuck in loading state
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        const unitId = localStorage.getItem('current_unit_id');
        if (unitId) {
          console.log('Timeout reached while processing transaction, redirecting to unit page');
          navigate(`/unit/${unitId}`);
        }
      }, 30000); // 30 second timeout
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, navigate]);

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

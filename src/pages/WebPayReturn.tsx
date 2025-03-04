
import React from 'react';
import { useWebPayProcessing } from '@/hooks/useWebPayProcessing';
import PaymentProcessing from '@/components/webpay/PaymentProcessing';
import PaymentError from '@/components/webpay/PaymentError';
import PaymentSuccess from '@/components/webpay/PaymentSuccess';
import PaymentRedirecting from '@/components/webpay/PaymentRedirecting';

const WebPayReturn: React.FC = () => {
  const { isProcessing, error, transactionResult } = useWebPayProcessing();

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4 text-center">
        {isProcessing ? (
          <PaymentProcessing />
        ) : error ? (
          <PaymentError errorMessage={error} />
        ) : transactionResult?.response_code === 0 ? (
          <PaymentSuccess transaction={transactionResult} />
        ) : (
          <PaymentRedirecting />
        )}
      </div>
    </div>
  );
};

export default WebPayReturn;

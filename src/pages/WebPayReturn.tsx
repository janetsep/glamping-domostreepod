
import { useTransactionConfirmation } from '@/hooks/webpay/useTransactionConfirmation';
import TransactionStatus from '@/components/webpay/TransactionStatus';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WebPayReturn = () => {
  const { isLoading, transactionResult, error } = useTransactionConfirmation();
  const navigate = useNavigate();

  // When transaction is successful, redirect to unit detail page with reservation ID
  useEffect(() => {
    if (!isLoading && transactionResult && transactionResult.response_code === 0 && transactionResult.reservation_id) {
      const timer = setTimeout(() => {
        const unitId = transactionResult.unit_id || localStorage.getItem('current_unit_id');
        if (unitId) {
          navigate(`/units/${unitId}?payment=success&reservationId=${transactionResult.reservation_id}`);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, transactionResult, navigate]);

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
        <TransactionStatus 
          isLoading={isLoading} 
          error={error} 
          transactionResult={transactionResult} 
        />
      </div>
    </div>
  );
};

export default WebPayReturn;

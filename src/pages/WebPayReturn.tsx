
import { useTransactionConfirmation } from '@/hooks/webpay/useTransactionConfirmation';
import TransactionStatus from '@/components/webpay/TransactionStatus';

const WebPayReturn = () => {
  const { isLoading, transactionResult, error } = useTransactionConfirmation();

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

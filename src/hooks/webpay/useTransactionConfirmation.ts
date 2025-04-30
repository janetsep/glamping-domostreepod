
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTransactionProcessor } from './useTransactionProcessor';

export const useTransactionConfirmation = () => {
  const location = useLocation();
  const { state, processTransaction, resetState } = useTransactionProcessor();

  useEffect(() => {
    const handleTransactionConfirmation = async () => {
      // Extract token_ws from URL query parameters
      const params = new URLSearchParams(location.search);
      const token = params.get('token_ws');
      
      if (!token) {
        console.error("No se encontró el token de la transacción");
        resetState();
        return;
      }
      
      // Process the transaction without redirection
      await processTransaction(token);
    };

    handleTransactionConfirmation();
  }, [location.search]);

  return {
    isLoading: state.isLoading,
    transactionResult: state.transactionResult,
    error: state.error,
    resetState
  };
};

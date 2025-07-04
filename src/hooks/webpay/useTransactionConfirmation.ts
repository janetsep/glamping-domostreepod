
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTransactionProcessor } from './useTransactionProcessor';

export const useTransactionConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if transaction was cancelled (no token)
  const params = new URLSearchParams(location.search);
  const token = params.get('token_ws');
  const isCancelled = !token;
  
  // Only use transaction processor if not cancelled
  const { state, processTransaction, resetState } = useTransactionProcessor();

  useEffect(() => {
    const handleTransactionConfirmation = async () => {
      if (isCancelled) {
        console.log("No se encontró token - transacción cancelada por el usuario");
        // Redirigir inmediatamente al domo cuando no hay token (cancelación)
        const unitId = localStorage.getItem('current_unit_id');
        if (unitId) {
          navigate(`/unit/${unitId}`);
        } else {
          navigate('/');
        }
        return;
      }
      
      // Process the transaction without redirection
      await processTransaction(token);
    };

    handleTransactionConfirmation();
  }, [location.search, isCancelled, navigate, processTransaction, token]);

  return {
    isCancelled,
    isLoading: isCancelled ? false : state.isLoading,
    transactionResult: isCancelled ? null : state.transactionResult,
    error: isCancelled ? null : state.error,
    resetState
  };
};

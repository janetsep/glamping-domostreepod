
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTransactionProcessor } from './useTransactionProcessor';

export const useTransactionConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, processTransaction, resetState } = useTransactionProcessor();

  useEffect(() => {
    const handleTransactionConfirmation = async () => {
      // Extract token_ws from URL query parameters
      const params = new URLSearchParams(location.search);
      const token = params.get('token_ws');
      
      if (!token) {
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
  }, [location.search]);

  return {
    isLoading: state.isLoading,
    transactionResult: state.transactionResult,
    error: state.error,
    resetState
  };
};

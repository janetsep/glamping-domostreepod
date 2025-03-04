
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTransactionProcessor } from './useTransactionProcessor';
import { useTransactionRedirect } from './useTransactionRedirect';
import { toast } from 'sonner';

export const useTransactionConfirmation = () => {
  const location = useLocation();
  const { state, processTransaction } = useTransactionProcessor();
  const { redirectToDetailPage, redirectToHome } = useTransactionRedirect();

  useEffect(() => {
    const handleTransactionConfirmation = async () => {
      // Extract token_ws from URL query parameters
      const params = new URLSearchParams(location.search);
      const token = params.get('token_ws');
      
      if (!token) {
        toast.error("Error en la transacción", {
          description: "No se encontró el token de la transacción",
        });
        setTimeout(() => {
          redirectToHome();
        }, 5000);
        return;
      }
      
      // Process the transaction
      const result = await processTransaction(token);
      
      // Auto-redirect to detail page after a few seconds if we have a result
      if (result) {
        setTimeout(() => {
          redirectToDetailPage(result, state.reservationId);
        }, 5000);
      } else {
        // Redirect to homepage after error
        setTimeout(() => {
          redirectToHome();
        }, 5000);
      }
    };

    handleTransactionConfirmation();
  }, [location.search]);

  return {
    isLoading: state.isLoading,
    transactionResult: state.transactionResult,
    error: state.error
  };
};

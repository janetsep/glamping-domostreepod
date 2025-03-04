
import { useCallback } from 'react';
import { toast } from 'sonner';
import { usePayment as useWebPayPayment } from '@/services/webpay';

interface UsePaymentProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const usePayment = ({ setIsLoading }: UsePaymentProps) => {
  // This is now just a wrapper around the refactored service
  return useWebPayPayment(setIsLoading);
};

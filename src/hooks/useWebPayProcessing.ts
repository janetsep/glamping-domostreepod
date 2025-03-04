
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useWebPayProcessing = (onConfirmation: (paymentData: any, reservationId?: string) => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Process payment success/failure query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentStatus = searchParams.get('payment');
    const reservationId = searchParams.get('reservationId');

    if (paymentStatus) {
      // If payment was just processed, get stored payment details from localStorage
      const storedPaymentDetails = localStorage.getItem('last_payment_details');
      if (storedPaymentDetails) {
        try {
          const paymentData = JSON.parse(storedPaymentDetails);
          setPaymentResult(paymentData);
          
          // Call the confirmation handler
          onConfirmation(paymentData, reservationId || undefined);
          
          // Remove query params from URL without page reload
          navigate(
            {
              pathname: location.pathname,
              search: ''
            },
            { replace: true }
          );
          
          // Clean up localStorage
          localStorage.removeItem('last_payment_details');
          localStorage.removeItem('current_reservation_id');
          localStorage.removeItem('current_unit_id');
          localStorage.removeItem('is_package_unit');
        } catch (error) {
          console.error('Error parsing payment details:', error);
        }
      }
    }
  }, [location.search, navigate, onConfirmation, location.pathname]);

  return {
    isProcessing,
    setIsProcessing,
    paymentResult
  };
};

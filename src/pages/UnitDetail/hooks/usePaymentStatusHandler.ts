
import { useCallback } from "react";
import { toast } from "sonner";

type PaymentStatusProps = {
  setIsReservationConfirmed: (confirmed: boolean) => void;
  setConfirmedReservationId: (id: string | null) => void;
  setPaymentDetails: (details: any) => void;
  setIsProcessingPayment: (processing: boolean) => void;
  navigate: any;
};

export const usePaymentStatus = ({
  setIsReservationConfirmed,
  setConfirmedReservationId,
  setPaymentDetails,
  setIsProcessingPayment,
  navigate
}: PaymentStatusProps) => {
  
  const handlePaymentReturn = useCallback((status: string | null, reservationId: string | null, token: string | null = null) => {
    if (!reservationId) return;
    
    setIsProcessingPayment(false);
    
    if (status === 'success' || status === 'ok') {
      setIsReservationConfirmed(true);
      setConfirmedReservationId(reservationId);
      setPaymentDetails({
        status: 'success',
        message: 'Pago procesado correctamente',
        transactionId: token || 'MOCK-TX-ID'
      });
      
      toast.success('¡Reserva confirmada! Tu pago ha sido procesado correctamente.');
      
      // Clear URL params
      navigate(`/unit/${reservationId}`, { replace: true });
    } else {
      setPaymentDetails({
        status: 'error',
        message: 'El pago no pudo ser procesado',
        transactionId: token || null
      });
      
      toast.error('Lo sentimos, hubo un problema con el pago. Por favor, intenta nuevamente.');
    }
  }, [setIsReservationConfirmed, setConfirmedReservationId, setPaymentDetails, setIsProcessingPayment, navigate]);
  
  return {
    handlePaymentReturn
  };
};

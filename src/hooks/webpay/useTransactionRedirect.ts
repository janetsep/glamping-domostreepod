
import { useNavigate } from 'react-router-dom';
import { TransactionResult } from '@/services/webpay';
import { toast } from 'sonner';

export const useTransactionRedirect = () => {
  const navigate = useNavigate();

  const redirectToDetailPage = (data: TransactionResult, reservationId: string | null = null) => {
    // Get product/unit ID from localStorage
    const unitId = localStorage.getItem('current_unit_id');
    
    if (unitId) {
      if (data.response_code === 0) {
        // If payment was successful, navigate to the detail page with query param
        toast.success("Pago completado con éxito", {
          description: "Tu reserva ha sido confirmada correctamente",
        });
        navigate(`/unit/${unitId}?payment=success&reservationId=${data.reservation_id || reservationId}`);
      } else {
        // If payment failed, navigate back to the detail page
        toast.error("Pago no completado", {
          description: `Código de respuesta: ${data.response_code}`,
        });
        navigate(`/unit/${unitId}?payment=failed`);
      }
    } else {
      // Fallback to homepage if no unit ID is found
      navigate('/');
    }
  };
  
  const redirectToHome = () => {
    navigate('/');
  };
  
  const redirectToUnitAfterCancel = () => {
    const unitId = localStorage.getItem('current_unit_id');
    if (unitId) {
      navigate(`/unit/${unitId}`);
    } else {
      navigate('/');
    }
  };

  return {
    redirectToDetailPage,
    redirectToHome,
    redirectToUnitAfterCancel
  };
};

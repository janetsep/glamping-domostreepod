
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PaymentErrorProps {
  errorMessage: string;
}

const PaymentError: React.FC<PaymentErrorProps> = ({ errorMessage }) => {
  const navigate = useNavigate();
  const isUserCancellation = errorMessage.includes('cancelada por el usuario');

  const handleRetry = () => {
    // Recargar la página para intentar de nuevo
    window.location.reload();
  };
  
  const handleBackToUnit = () => {
    // For all errors (including cancellations), return to the unit detail page
    const unitId = localStorage.getItem('current_unit_id');
    if (unitId) {
      navigate(`/unit/${unitId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-display font-bold text-red-600">
        {isUserCancellation ? 'Transacción Cancelada' : 'Error en el Pago'}
      </h2>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-red-700 mb-4">
          {isUserCancellation 
            ? 'La transacción fue cancelada. Puedes volver al domo para intentar nuevamente.' 
            : 'Hubo un problema al procesar tu pago.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleBackToUnit}
            variant="default"
            className="w-full max-w-xs"
          >
            Volver al domo
          </Button>
          
          {!isUserCancellation && (
            <Button 
              onClick={handleRetry}
              variant="outline"
              className="w-full max-w-xs"
            >
              Reintentar
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Si el problema persiste, por favor contacta a soporte.
      </p>
    </div>
  );
};

export default PaymentError;

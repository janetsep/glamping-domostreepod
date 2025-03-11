
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaymentErrorProps {
  errorMessage: string;
}

const PaymentError: React.FC<PaymentErrorProps> = ({ errorMessage }) => {
  const handleRetry = () => {
    // Recargar la página para intentar de nuevo
    window.location.reload();
  };

  const isUserCancellation = errorMessage.includes('cancelada por el usuario');

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-display font-bold text-red-600">
        {isUserCancellation ? 'Transacción Cancelada' : 'Error en el Pago'}
      </h2>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-red-700 mb-4">
          {isUserCancellation 
            ? 'La transacción fue cancelada. Puedes intentar realizar el pago nuevamente.' 
            : 'Hubo un problema al procesar tu pago.'}
        </p>
        <Button 
          onClick={handleRetry}
          variant="destructive"
          className="w-full max-w-xs"
        >
          Intentar Nuevamente
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Si el problema persiste, por favor contacta a soporte.
      </p>
    </div>
  );
};

export default PaymentError;

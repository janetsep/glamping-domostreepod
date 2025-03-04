
import React from 'react';

interface PaymentErrorProps {
  errorMessage: string;
}

const PaymentError: React.FC<PaymentErrorProps> = ({ errorMessage }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold text-red-600">Error en el pago</h2>
      <p>{errorMessage}</p>
      <p className="text-sm text-muted-foreground">Serás redirigido en unos momentos...</p>
    </div>
  );
};

export default PaymentError;

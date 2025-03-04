
import React from 'react';

interface PaymentErrorProps {
  errorMessage: string;
}

const PaymentError: React.FC<PaymentErrorProps> = ({ errorMessage }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold text-red-600">Error en el pago</h2>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{errorMessage}</p>
      </div>
      <p className="text-sm text-muted-foreground mt-4">Serás redirigido en unos momentos...</p>
      <p className="text-sm text-muted-foreground">Si no eres redirigido automáticamente, puedes intentar realizar el pago nuevamente.</p>
    </div>
  );
};

export default PaymentError;

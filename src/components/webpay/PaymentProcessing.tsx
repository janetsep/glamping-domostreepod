
import React from 'react';

const PaymentProcessing: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">Procesando pago...</h2>
      <p>Estamos confirmando tu transacción. Por favor, no cierres esta ventana.</p>
      <div className="mt-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
      <p className="text-sm text-muted-foreground mt-4">Este proceso puede tardar unos segundos.</p>
    </div>
  );
};

export default PaymentProcessing;


import React from "react";

interface PaymentDetailsProps {
  paymentDetails: any;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  paymentDetails,
}) => {
  if (!paymentDetails) return null;

  return (
    <div className="mt-4 p-3 bg-green-50 rounded-md">
      <h4 className="font-medium text-green-800 mb-1">Detalles del pago</h4>
      <div className="text-sm text-green-700">
        <p>Código de autorización: {paymentDetails.authorization_code || 'N/A'}</p>
        <p>Número de tarjeta: {paymentDetails.card_detail?.card_number || 'N/A'}</p>
      </div>
    </div>
  );
};

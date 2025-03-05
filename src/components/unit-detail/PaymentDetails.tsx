
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PaymentDetailsProps {
  paymentDetails: any;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  paymentDetails,
}) => {
  if (!paymentDetails) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP, HH:mm', {locale: es});
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="mt-4 p-4 bg-green-50 rounded-md">
      <h4 className="font-medium text-green-800 mb-2">Detalles del pago</h4>
      <div className="text-sm text-green-700 space-y-1">
        <p><span className="font-medium">Estado:</span> Aprobado</p>
        <p><span className="font-medium">Código de autorización:</span> {paymentDetails.authorization_code || 'N/A'}</p>
        <p><span className="font-medium">Número de tarjeta:</span> {paymentDetails.card_detail?.card_number || 'N/A'}</p>
        <p><span className="font-medium">Monto:</span> ${paymentDetails.amount?.toLocaleString() || 'N/A'}</p>
        <p><span className="font-medium">Fecha:</span> {formatDate(paymentDetails.transaction_date)}</p>
        {paymentDetails.payment_type_code && (
          <p><span className="font-medium">Tipo de pago:</span> {
            paymentDetails.payment_type_code === 'VN' ? 'Venta normal' : 
            paymentDetails.payment_type_code === 'VC' ? 'Venta en cuotas' : 
            paymentDetails.payment_type_code
          }</p>
        )}
        {paymentDetails.installments_number > 0 && (
          <p><span className="font-medium">Cuotas:</span> {paymentDetails.installments_number}</p>
        )}
      </div>
    </div>
  );
};

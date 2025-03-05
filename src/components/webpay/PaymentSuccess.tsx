
import React from 'react';
import { TransactionResult } from '@/services/webpay';

interface PaymentSuccessProps {
  transaction: TransactionResult;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ transaction }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold text-green-600">¡Pago exitoso!</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
        <p><span className="font-semibold">Estado:</span> Aprobado</p>
        <p><span className="font-semibold">Código de autorización:</span> {transaction.authorization_code}</p>
        <p><span className="font-semibold">Tarjeta:</span> {transaction.card_detail?.card_number || "No disponible"}</p>
        <p><span className="font-semibold">Monto:</span> ${transaction.amount?.toLocaleString()}</p>
        {transaction.reservation_id && (
          <p><span className="font-semibold">ID de reserva:</span> {transaction.reservation_id}</p>
        )}
      </div>
      <p className="text-sm text-muted-foreground">Por favor, completa tus datos de contacto para finalizar la reserva.</p>
    </div>
  );
};

export default PaymentSuccess;

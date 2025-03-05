
import React from 'react';
import { Button } from '@/components/ui/button';
import { TransactionResult } from '@/services/webpay';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReservationData {
  unit_name?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
}

// Extend TransactionResult to include reservation_data
interface ExtendedTransactionResult extends TransactionResult {
  reservation_data?: ReservationData;
}

interface PaymentSuccessProps {
  transaction: ExtendedTransactionResult;
  onSendEmail?: () => Promise<void>;
  isEmailSending?: boolean;
  emailSent?: boolean;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ 
  transaction, 
  onSendEmail,
  isEmailSending = false,
  emailSent = false
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold text-green-600">¡Pago exitoso!</h2>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="font-semibold text-green-800 text-lg mb-3">Detalles del pago</h3>
        <div className="space-y-2 text-green-700">
          <p><span className="font-semibold">Estado:</span> Aprobado</p>
          <p><span className="font-semibold">Código de autorización:</span> {transaction.authorization_code}</p>
          <p><span className="font-semibold">Tarjeta:</span> {transaction.card_detail?.card_number || "No disponible"}</p>
          <p><span className="font-semibold">Monto:</span> {formatCurrency(transaction.amount || 0)}</p>
        </div>

        {transaction.reservation_id && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <h3 className="font-semibold text-green-800 text-lg mb-3">Detalles de la reserva</h3>
            <div className="space-y-2 text-green-700">
              <p><span className="font-semibold">ID de reserva:</span> {transaction.reservation_id}</p>
              {transaction.reservation_data && (
                <>
                  <p><span className="font-semibold">Unidad:</span> {transaction.reservation_data.unit_name || 'No disponible'}</p>
                  <p><span className="font-semibold">Check-in:</span> {transaction.reservation_data.check_in ? 
                    format(new Date(transaction.reservation_data.check_in), 'PPP', {locale: es}) : 'No disponible'}</p>
                  <p><span className="font-semibold">Check-out:</span> {transaction.reservation_data.check_out ?
                    format(new Date(transaction.reservation_data.check_out), 'PPP', {locale: es}) : 'No disponible'}</p>
                  <p><span className="font-semibold">Huéspedes:</span> {transaction.reservation_data.guests || 'No disponible'}</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {onSendEmail && (
        <div className="mt-4 text-center">
          <Button 
            onClick={onSendEmail} 
            disabled={isEmailSending || emailSent}
            variant={emailSent ? "outline" : "default"}
            className="w-full max-w-xs"
          >
            {isEmailSending ? 'Enviando...' : 
             emailSent ? '✓ Enviado correctamente' : 
             'Enviar detalles a mi correo'}
          </Button>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Por favor, completa tus datos de contacto para finalizar la reserva.
      </p>
    </div>
  );
};

export default PaymentSuccess;

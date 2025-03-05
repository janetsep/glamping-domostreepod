
import React from 'react';
import { Button } from '@/components/ui/button';
import { TransactionResult } from '@/services/webpay/types';
import { ReservationDetails } from '@/components/unit-detail/ReservationDetails';

interface ReservationConfirmedProps {
  transactionResult: TransactionResult;
  onSendEmail: () => void;
  isEmailSending: boolean;
  emailSent: boolean;
  onViewReservation: () => void;
}

const ReservationConfirmed: React.FC<ReservationConfirmedProps> = ({
  transactionResult,
  onSendEmail,
  isEmailSending,
  emailSent,
  onViewReservation
}) => {
  
  // Prepare quote object for ReservationDetails
  const getQuoteFromTransaction = () => {
    if (!transactionResult) return null;
    
    return {
      nights: 0,
      basePrice: transactionResult.amount || 0,
      activitiesTotal: 0,
      packagesTotal: 0,
      totalPrice: transactionResult.amount || 0,
      selectedActivities: transactionResult.reservation_data?.selected_activities || [],
      selectedPackages: transactionResult.reservation_data?.selected_packages || []
    };
  };

  return (
    <div className="space-y-6">
      <div className="mt-6 text-center">
        <p className="text-green-600 font-medium mb-4">
          ¡Información guardada correctamente!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button 
            onClick={onSendEmail} 
            variant="default"
            disabled={isEmailSending || emailSent}
            className="w-full sm:w-auto"
          >
            {isEmailSending ? 'Enviando...' : 
              emailSent ? '✓ Enviado correctamente' : 
              'Enviar detalles a mi correo'}
          </Button>
          
          <Button 
            onClick={onViewReservation} 
            variant="outline"
            className="w-full sm:w-auto"
          >
            Ver detalles de mi reserva
          </Button>
        </div>
      </div>
      
      {transactionResult.reservation_id && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Detalles completos de tu reserva</h3>
          <ReservationDetails
            startDate={transactionResult.reservation_data?.check_in ? new Date(transactionResult.reservation_data.check_in) : undefined}
            endDate={transactionResult.reservation_data?.check_out ? new Date(transactionResult.reservation_data.check_out) : undefined}
            guests={transactionResult.reservation_data?.guests}
            quote={getQuoteFromTransaction()}
            paymentDetails={transactionResult}
          />
        </div>
      )}
    </div>
  );
};

export default ReservationConfirmed;


import React from 'react';
import { TransactionResult } from '@/services/webpay/types';
import { ReservationDetails } from '@/components/unit-detail/ReservationDetails';
import { LoadingState } from './LoadingState';
import { ActionButtons } from './ActionButtons';
import { ReservationCodeDisplay } from './ReservationCodeDisplay';
import { MultipleDomoInfo } from './MultipleDomoInfo';
import { useReservationData } from './hooks/useReservationData';

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
  const {
    allReservations,
    isLoading,
    totalGuests,
    requiredDomos,
    getQuoteFromTransaction
  } = useReservationData(transactionResult);

  if (isLoading) {
    return <LoadingState />;
  }


  return (
    <div className="space-y-6">
      <ActionButtons
        onSendEmail={onSendEmail}
        isEmailSending={isEmailSending}
        emailSent={emailSent}
        onViewReservation={onViewReservation}
      />
      
      {transactionResult.reservation_id && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Detalles completos de tu reserva</h3>
          
          <ReservationCodeDisplay
            reservationId={transactionResult.reservation_id}
            reservationCode={transactionResult.reservation_data?.reservation_code || allReservations[0]?.reservation_code}
          />
          
          <MultipleDomoInfo
            requiredDomos={requiredDomos}
            totalGuests={totalGuests}
            allReservations={allReservations}
          />
          
          <ReservationDetails
            startDate={transactionResult.reservation_data?.check_in ? new Date(transactionResult.reservation_data.check_in) : undefined}
            endDate={transactionResult.reservation_data?.check_out ? new Date(transactionResult.reservation_data.check_out) : undefined}
            guests={totalGuests}
            quote={getQuoteFromTransaction()}
            paymentDetails={transactionResult}
          />
        </div>
      )}
    </div>
  );
};

export default ReservationConfirmed;

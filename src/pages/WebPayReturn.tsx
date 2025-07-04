
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionConfirmation } from '@/hooks/webpay/useTransactionConfirmation';
import { useEmailSender } from '@/hooks/webpay/useEmailSender';
import TransactionStatus from '@/components/webpay/TransactionStatus';
import ClientInfoSection from '@/components/webpay/ClientInfoSection';
import ReservationConfirmed from '@/components/webpay/ReservationConfirmed';

const WebPayReturn = () => {
  const { isLoading, transactionResult, error, resetState } = useTransactionConfirmation();
  const { sendEmail, isEmailSending, emailSent } = useEmailSender();
  const navigate = useNavigate();
  
  const [clientInfoSubmitted, setClientInfoSubmitted] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    name: localStorage.getItem('client_name') || '',
    email: localStorage.getItem('client_email') || '',
    phone: localStorage.getItem('client_phone') || ''
  });
  
  // Auto-redirect on error or cancellation immediately
  useEffect(() => {
    if (error) {
      const unitId = localStorage.getItem('current_unit_id');
      if (unitId) {
        // Redirect immediately to the unit page for any error (including cancellations)
        const redirectTimer = setTimeout(() => {
          navigate(`/unit/${unitId}`);
        }, 1000); // Very short delay to allow user to see the error message
        
        return () => clearTimeout(redirectTimer);
      }
    }
  }, [error, navigate]);
  
  // Handle successful client info submission
  const handleClientInfoSubmitted = (updatedClientInfo: {
    name: string;
    email: string;
    phone: string;
  }) => {
    setClientInfo(updatedClientInfo);
    setClientInfoSubmitted(true);
  };

  // Handle email sending
  const handleSendEmail = () => {
    if (transactionResult) {
      sendEmail(transactionResult, clientInfo);
    }
  };

  // Function to navigate back to unit detail page
  const handleBackToUnit = () => {
    const unitId = localStorage.getItem('current_unit_id');
    if (unitId && transactionResult?.reservation_id) {
      navigate(`/unit/${unitId}?payment=success&reservationId=${transactionResult.reservation_id}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
        <TransactionStatus 
          isLoading={isLoading} 
          error={error} 
          transactionResult={transactionResult} 
        />
        
        {!isLoading && transactionResult && transactionResult.response_code === 0 && (
          <div className="mt-8">
            {!clientInfoSubmitted ? (
              <ClientInfoSection 
                transactionResult={transactionResult}
                initialClientInfo={clientInfo}
                onClientInfoSubmitted={handleClientInfoSubmitted}
              />
            ) : (
              <ReservationConfirmed 
                transactionResult={transactionResult}
                onSendEmail={handleSendEmail}
                isEmailSending={isEmailSending}
                emailSent={emailSent}
                onViewReservation={handleBackToUnit}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebPayReturn;

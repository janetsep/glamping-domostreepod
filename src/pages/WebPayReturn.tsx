
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionConfirmation } from '@/hooks/webpay/useTransactionConfirmation';
import { useEmailSender } from '@/hooks/webpay/useEmailSender';
import TransactionStatus from '@/components/webpay/TransactionStatus';
import ClientInfoSection from '@/components/webpay/ClientInfoSection';
import ReservationConfirmed from '@/components/webpay/ReservationConfirmed';

const WebPayReturn = () => {
  const { isCancelled, isLoading, transactionResult, error, resetState } = useTransactionConfirmation();
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
      console.log('🔄 [WebPayReturn] Error detectado, programando redirección:', error);
      const unitId = localStorage.getItem('current_unit_id');
      if (unitId) {
        // Redirect immediately to the unit page for any error (including cancellations)
        const redirectTimer = setTimeout(() => {
          console.log('🔄 [WebPayReturn] Redirigiendo por error a:', `/unit/${unitId}`);
          navigate(`/unit/${unitId}`);
        }, 2000); // Slightly longer delay to allow user to see the error message
        
        return () => clearTimeout(redirectTimer);
      } else {
        // Fallback redirect to home
        const redirectTimer = setTimeout(() => {
          console.log('🔄 [WebPayReturn] Redirigiendo por error a home');
          navigate('/');
        }, 2000);
        
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
    const reservationId = transactionResult?.reservation_id;
    
    console.log('🔍 [WebPayReturn] Navegando a detalles de reserva:', {
      unitId,
      reservationId,
      transactionResult: transactionResult ? 'disponible' : 'no disponible'
    });
    
    // Try to navigate to unit detail with payment success parameters
    if (unitId && reservationId) {
      const targetUrl = `/unit/${unitId}?payment=success&reservationId=${reservationId}`;
      console.log('✅ [WebPayReturn] Navegando a:', targetUrl);
      navigate(targetUrl);
      return;
    }
    
    // Fallback: try to get unitId from transaction result or URL
    if (reservationId) {
      // Try to extract unitId from current URL or use a default
      const urlParams = new URLSearchParams(window.location.search);
      const fallbackUnitId = urlParams.get('unitId') || '1'; // Default unit ID
      
      console.log('⚠️ [WebPayReturn] Usando fallback unitId:', fallbackUnitId);
      const fallbackUrl = `/unit/${fallbackUnitId}?payment=success&reservationId=${reservationId}`;
      navigate(fallbackUrl);
      return;
    }
    
    // Last resort: navigate to home
    console.log('❌ [WebPayReturn] No se pudo determinar la navegación, yendo a home');
    navigate('/');
  };

  // If transaction was cancelled, don't render anything (redirect is handled in the hook)
  if (isCancelled) {
    return null;
  }

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

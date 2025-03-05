
import { useState } from 'react';
import { toast } from 'sonner';
import { TransactionResult } from '@/services/webpay/types';

export const useEmailSender = () => {
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const sendEmail = async (transactionResult: TransactionResult, clientInfo: {
    name: string;
    email: string;
    phone: string;
  }) => {
    if (!transactionResult || !transactionResult.reservation_id) {
      toast.error("Error", {
        description: "No se encontró el ID de la reserva para enviar el correo",
      });
      return;
    }
    
    if (!clientInfo.email) {
      toast.error("Error", {
        description: "No se encontró un correo electrónico para enviar los detalles",
      });
      return;
    }
    
    setIsEmailSending(true);
    
    try {
      const response = await fetch('https://gtxjfmvnzrsuaxryffnt.supabase.co/functions/v1/send-reservation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: clientInfo.email,
          phone: clientInfo.phone,
          name: clientInfo.name,
          reservationId: transactionResult.reservation_id
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error al enviar el correo: ${response.status}`);
      }
      
      setEmailSent(true);
      toast.success("Correo enviado", {
        description: "Hemos enviado los detalles de tu reserva a tu correo electrónico.",
      });
    } catch (error) {
      console.error('Error enviando correo:', error);
      toast.error("Error", {
        description: "No se pudo enviar el correo. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  return {
    sendEmail,
    isEmailSending,
    emailSent
  };
};

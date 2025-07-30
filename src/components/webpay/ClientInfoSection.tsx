
import React, { useState } from 'react';
import { ClientInformationForm } from '@/pages/UnitDetail/ClientInformationForm';
import { useMutateReservationStatus } from '@/hooks/reservations/useReservationUpdate';
import { TransactionResult } from '@/services/webpay/types';
import { toast } from 'sonner';

interface ClientInfoSectionProps {
  transactionResult: TransactionResult;
  initialClientInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onClientInfoSubmitted: (clientInfo: {
    name: string;
    email: string;
    phone: string;
  }) => void;
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  transactionResult,
  initialClientInfo,
  onClientInfoSubmitted
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveClientInformation } = useMutateReservationStatus();

  // Handle client information submission
  const handleClientInfoSubmit = async (clientInfo: { name: string; email: string; phone: string }) => {
    if (!transactionResult || !transactionResult.reservation_id) {
      toast.error("Error", {
        description: "No se encontró el ID de la reserva",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save the client information in the reservation
      const success = await saveClientInformation(transactionResult.reservation_id, clientInfo);
      
      if (success) {
        onClientInfoSubmitted(clientInfo);
        toast.success("Información guardada", {
          description: "¡Gracias! Hemos registrado tus datos y los hemos asociado a tu reserva.",
        });
      } else {
        throw new Error("Error al guardar información del cliente");
      }
    } catch (error) {
      console.error('Error guardando información del cliente:', error);
      toast.error("Error", {
        description: "No se pudo guardar la información del cliente. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-800 text-sm">
          Tu pago ha sido procesado correctamente. Para completar tu reserva, confirma tus datos de contacto.
          Esta información quedará directamente asociada con tu reserva.
        </p>
      </div>
      <ClientInformationForm 
        onSubmit={handleClientInfoSubmit}
        isSubmitting={isSubmitting}
        initialValues={initialClientInfo}
      />
    </>
  );
};

export default ClientInfoSection;

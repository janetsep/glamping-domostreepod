
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onSendEmail: () => void;
  isEmailSending: boolean;
  emailSent: boolean;
  onViewReservation: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSendEmail,
  isEmailSending,
  emailSent,
  onViewReservation
}) => {
  return (
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
  );
};

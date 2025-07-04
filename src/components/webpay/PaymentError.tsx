
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PaymentErrorProps {
  errorMessage: string;
}

const PaymentError: React.FC<PaymentErrorProps> = ({ errorMessage }) => {
  const navigate = useNavigate();
  const isUserCancellation = errorMessage.includes('cancelada por el usuario');
  
  // Detectar si es un error de Edge Functions
  const isEdgeFunctionError = errorMessage?.includes('Edge Functions') || 
                              errorMessage?.includes('funciones de pago no están disponible') ||
                              errorMessage?.includes('Failed to fetch') ||
                              errorMessage?.includes('servicio de pagos');

  const handleRetry = () => {
    // Recargar la página para intentar de nuevo
    window.location.reload();
  };
  
  const handleBackToUnit = () => {
    // For all errors (including cancellations), return to the unit detail page
    const unitId = localStorage.getItem('current_unit_id');
    if (unitId) {
      navigate(`/unit/${unitId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-display font-bold text-red-600">
        {isUserCancellation ? 'Transacción Cancelada' : 
         isEdgeFunctionError ? 'Servicio No Disponible' : 
         'Error en el Pago'}
      </h2>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-red-700 mb-4">
          {isUserCancellation 
            ? 'La transacción fue cancelada. Puedes volver al domo para intentar nuevamente.' 
            : isEdgeFunctionError
            ? 'El servicio de procesamiento de pagos no está disponible temporalmente.'
            : 'Hubo un problema al procesar tu pago.'}
        </p>
        
        {isEdgeFunctionError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-left">
            <h4 className="font-semibold text-yellow-800 text-sm mb-1">Para el administrador:</h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Verificar que las Edge Functions estén deployadas</li>
              <li>• Comprobar función webpay-confirm</li>
              <li>• Revisar configuración CORS</li>
              <li>• Validar variables de entorno</li>
            </ul>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleBackToUnit}
            variant="default"
            className="w-full max-w-xs"
          >
            Volver al domo
          </Button>
          
          {!isUserCancellation && !isEdgeFunctionError && (
            <Button 
              onClick={handleRetry}
              variant="outline"
              className="w-full max-w-xs"
            >
              Reintentar
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {isEdgeFunctionError 
          ? 'Este es un problema técnico del sistema. Contacta al administrador.'
          : 'Si el problema persiste, por favor contacta a soporte.'}
      </p>
    </div>
  );
};

export default PaymentError;

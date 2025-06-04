
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface ReservationProgressProps {
  currentStep: number;
  showQuote: boolean;
  isProcessingPayment: boolean;
  isReservationConfirmed: boolean;
}

const steps = [
  { id: 1, label: 'Seleccionar fechas y huéspedes', description: 'Elige tus fechas y número de huéspedes' },
  { id: 2, label: 'Revisar cotización', description: 'Verifica los detalles y precios' },
  { id: 3, label: 'Procesar pago', description: 'Completa el pago de tu reserva' },
  { id: 4, label: 'Confirmación', description: 'Tu reserva está confirmada' }
];

export const ReservationProgress = ({ 
  currentStep, 
  showQuote, 
  isProcessingPayment, 
  isReservationConfirmed 
}: ReservationProgressProps) => {
  const getStepStatus = (stepId: number) => {
    if (isReservationConfirmed && stepId <= 4) return 'completed';
    if (isProcessingPayment && stepId <= 3) return 'processing';
    if (showQuote && stepId <= 2) return 'completed';
    if (currentStep >= stepId) return 'current';
    return 'pending';
  };

  const getProgressValue = () => {
    if (isReservationConfirmed) return 100;
    if (isProcessingPayment) return 75;
    if (showQuote) return 50;
    return 25;
  };

  const getStepIcon = (stepId: number) => {
    const status = getStepStatus(stepId);
    
    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (status === 'processing' || status === 'current') {
      return <Clock className="w-5 h-5 text-blue-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-4">Progreso de tu reserva</h3>
      
      {/* Barra de progreso */}
      <div className="mb-6">
        <Progress value={getProgressValue()} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Inicio</span>
          <span>{Math.round(getProgressValue())}% completado</span>
          <span>Confirmado</span>
        </div>
      </div>

      {/* Pasos */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isActive = status === 'current' || status === 'processing';
          
          return (
            <div key={step.id} className={`flex items-start space-x-3 ${isActive ? 'bg-blue-50 p-3 rounded-lg' : ''}`}>
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(step.id)}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${status === 'completed' ? 'text-green-700' : isActive ? 'text-blue-700' : 'text-gray-500'}`}>
                  {step.label}
                </p>
                <p className={`text-sm ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {step.description}
                </p>
                {status === 'processing' && (
                  <div className="mt-2">
                    <div className="animate-pulse text-sm text-blue-600">
                      Procesando...
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

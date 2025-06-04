
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface CompactReservationProgressProps {
  currentStep: number;
  showQuote: boolean;
  isProcessingPayment: boolean;
  isReservationConfirmed: boolean;
}

const steps = [
  { id: 1, label: 'Fechas' },
  { id: 2, label: 'Cotización' },
  { id: 3, label: 'Pago' },
  { id: 4, label: 'Confirmación' }
];

export const CompactReservationProgress = ({ 
  currentStep, 
  showQuote, 
  isProcessingPayment, 
  isReservationConfirmed 
}: CompactReservationProgressProps) => {
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
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (status === 'processing' || status === 'current') {
      return <Clock className="w-4 h-4 text-blue-600" />;
    }
    return <Circle className="w-4 h-4 text-gray-300" />;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Progreso de reserva</h3>
        <span className="text-xs text-gray-600">{Math.round(getProgressValue())}% completado</span>
      </div>
      
      {/* Barra de progreso */}
      <div className="mb-3">
        <Progress value={getProgressValue()} className="h-1.5" />
      </div>

      {/* Pasos compactos */}
      <div className="flex justify-between">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const isActive = status === 'current' || status === 'processing';
          
          return (
            <div key={step.id} className="flex flex-col items-center space-y-1">
              <div className="flex-shrink-0">
                {getStepIcon(step.id)}
              </div>
              <p className={`text-xs font-medium text-center ${
                status === 'completed' ? 'text-green-700' : 
                isActive ? 'text-blue-700' : 'text-gray-400'
              }`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Activity, ThemedPackage } from "@/types";

interface ReservationSummaryProps {
  quote: {
    breakdown: Array<{ description: string; amount: number }>;
    totalPrice: number;
  };
  isAvailable: boolean;
  isLoading: boolean;
  onReserve: () => void;
  onConfirm?: () => void;
  buttonText?: string;
  selectedActivities?: Activity[];
  selectedPackages?: ThemedPackage[];
  hasSelectedExtras?: boolean;
}

export const ReservationSummary = ({
  quote,
  isAvailable,
  isLoading,
  onReserve,
  onConfirm,
  buttonText = "Reservar ahora",
  selectedActivities = [],
  selectedPackages = [],
  hasSelectedExtras = false
}: ReservationSummaryProps) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const handleAcceptQuote = () => {
    if (buttonText === "Nueva cotización") {
      onReserve();
      return;
    }
    
    setShowPaymentOptions(true);
  };

  const handleConfirmReservation = () => {
    if (onConfirm) {
      onConfirm();
    }
    setShowPaymentOptions(false);
  };

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
  };

  return (
    <div className="space-y-4">
      {/* Mensaje de disponibilidad destacado */}
      {isAvailable && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md text-green-700 flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="font-medium">¡Fechas disponibles para reservar!</span>
        </div>
      )}
      
      <div className="border-t pt-4 mt-4 space-y-3">
        {quote.breakdown.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.description}</span>
            <span>${item.amount.toLocaleString()}</span>
          </div>
        ))}
        
        {/* Display selected activities */}
        {selectedActivities && selectedActivities.length > 0 && (
          <>
            <div className="border-t pt-2 mt-2">
              <div className="font-medium text-sm mb-2">Actividades seleccionadas:</div>
              {selectedActivities.map((activity) => (
                <div key={activity.id} className="flex justify-between text-sm">
                  <span>{activity.name}</span>
                  <span>${activity.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Display selected packages */}
        {selectedPackages && selectedPackages.length > 0 && (
          <>
            <div className="border-t pt-2 mt-2">
              <div className="font-medium text-sm mb-2">Paquetes temáticos:</div>
              {selectedPackages.map((pkg) => (
                <div key={pkg.id} className="flex justify-between text-sm">
                  <span>{pkg.name}</span>
                  <span>${pkg.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}
        
        <div className="text-lg font-semibold flex justify-between pt-2 border-t">
          <span>Total</span>
          <span>${quote.totalPrice.toLocaleString()}</span>
        </div>
        {isAvailable ? (
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <Calendar size={14} />
            <span>✓ Fechas disponibles - ¡Asegura tu reserva!</span>
          </div>
        ) : (
          <p className="text-red-600 text-sm">✗ Fechas no disponibles</p>
        )}
      </div>

      {!showPaymentOptions ? (
        <div>
          <Button
            className="w-full bg-accent hover:bg-accent/90 shadow-md"
            size="lg"
            disabled={isLoading || !isAvailable}
            onClick={handleAcceptQuote}
          >
            {buttonText}
          </Button>
          <div className="mt-3 text-xs text-gray-500 flex items-center justify-center gap-1">
            <ShieldCheck size={14} />
            <span>Reserva segura, cancelación flexible hasta 7 días antes</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold text-md">Opciones de pago</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button 
              variant={selectedPayment === 'webpay' ? 'default' : 'outline'} 
              className="p-4 h-auto flex items-center"
              onClick={() => handlePaymentSelect('webpay')}
            >
              <span className="text-xl mr-3">💳</span>
              <div className="flex flex-col items-start">
                <span className="font-semibold">WebPay Plus</span>
                <span className="text-xs text-left">Paga con tarjetas de crédito, débito o prepago</span>
              </div>
            </Button>
          </div>
          <Button
            className="w-full mt-4 bg-accent hover:bg-accent/90"
            size="lg"
            onClick={handleConfirmReservation}
            disabled={!selectedPayment}
          >
            Continuar al pago
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setShowPaymentOptions(false)}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};

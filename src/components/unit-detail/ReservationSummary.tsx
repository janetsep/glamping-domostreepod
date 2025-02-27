
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
}

export const ReservationSummary = ({
  quote,
  isAvailable,
  isLoading,
  onReserve,
  onConfirm,
  buttonText = "Reservar ahora"
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
      <div className="border-t pt-4 mt-4 space-y-3">
        {quote.breakdown.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.description}</span>
            <span>${item.amount.toLocaleString()}</span>
          </div>
        ))}
        <div className="text-lg font-semibold flex justify-between pt-2 border-t">
          <span>Total</span>
          <span>${quote.totalPrice.toLocaleString()}</span>
        </div>
        {isAvailable ? (
          <p className="text-green-600 text-sm">✓ Fechas disponibles</p>
        ) : (
          <p className="text-red-600 text-sm">✗ Fechas no disponibles</p>
        )}
      </div>

      {!showPaymentOptions ? (
        <Button
          className="w-full"
          size="lg"
          disabled={isLoading || !isAvailable}
          onClick={handleAcceptQuote}
        >
          {buttonText}
        </Button>
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
            className="w-full mt-4"
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

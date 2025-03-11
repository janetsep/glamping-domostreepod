
import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, ThemedPackage } from "@/types";
import { ExtrasDetails } from "./ExtrasDetails";
import { RefreshCcw } from "lucide-react";

interface ReservationSummaryProps {
  quote: {
    nights: number;
    pricePerNight: number;
    totalPrice: number;
    breakdown: Array<{ description: string; amount: number }>;
    rateDescription?: string;
  };
  isAvailable: boolean;
  isLoading: boolean;
  onReserve: () => void;
  onConfirm: () => void;
  buttonText: string;
  selectedActivities?: Activity[];
  selectedPackages?: ThemedPackage[];
  hasSelectedExtras?: boolean;
}

export const ReservationSummary: React.FC<ReservationSummaryProps> = ({
  quote,
  isAvailable,
  isLoading,
  onReserve,
  onConfirm,
  buttonText,
  selectedActivities = [],
  selectedPackages = [],
  hasSelectedExtras = false,
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CL')}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Resumen de tu estadía</h3>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-700">{quote.nights} {quote.nights === 1 ? 'noche' : 'noches'}</span>
        <span className="font-semibold">{formatCurrency(quote.pricePerNight)} / noche</span>
      </div>
      
      {quote.rateDescription && (
        <div className="text-sm text-cyan-600 mb-2">
          {quote.rateDescription}
        </div>
      )}
      
      <hr className="my-2" />
      
      {quote.breakdown.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="text-gray-700">{item.description}</span>
          <span>{formatCurrency(item.amount)}</span>
        </div>
      ))}
      
      {hasSelectedExtras && (
        <ExtrasDetails 
          selectedActivities={selectedActivities}
          selectedPackages={selectedPackages}
        />
      )}
      
      <hr className="my-2" />
      
      <div className="flex justify-between items-center font-bold">
        <span>Total</span>
        <span>{formatCurrency(quote.totalPrice)}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
        <Button
          onClick={onConfirm}
          disabled={isLoading || !isAvailable}
          className="flex-1"
        >
          {isLoading ? "Procesando..." : buttonText}
        </Button>
        
        <Button
          onClick={onReserve}
          variant="outline"
          className="flex-1 flex items-center gap-2"
        >
          <RefreshCcw size={16} />
          Nueva reserva
        </Button>
      </div>
    </div>
  );
};

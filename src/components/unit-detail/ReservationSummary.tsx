
import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, ThemedPackage } from "@/types";
import { ExtrasDetails } from "./ExtrasDetails";
import { RefreshCcw, Edit } from "lucide-react";

interface ReservationSummaryProps {
  quote: {
    nights: number;
    pricePerNight: number;
    totalPrice: number;
    breakdown: Array<{ description: string; amount: number }>;
    rateDescription?: string;
    requiredDomos?: number;
    domoDistribution?: Array<{ number: number; guests: number }>;
    pricePerDomo?: number;
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

  // Calculate totals for extras
  const activitiesTotal = selectedActivities.reduce((sum, activity) => sum + activity.price, 0);
  const packagesTotal = selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0);
  const extrasTotal = activitiesTotal + packagesTotal;

  // El precio base ahora es el precio de los domos sin extras
  const basePrice = quote.totalPrice;
  // El precio total es el precio base más los extras
  const finalTotal = basePrice + extrasTotal;

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
      
      {/* Eliminamos los detalles del desglose que muestran la suma redundante */}
      
      {/* Mostrar distribución de domos si está disponible */}
      {quote.domoDistribution && quote.domoDistribution.length > 0 && quote.pricePerDomo && (
        <div className="mt-3 bg-secondary/10 p-3 rounded-md">
          <p className="font-medium mb-2">Distribución por domo:</p>
          <div className="grid grid-cols-1 gap-2">
            {quote.domoDistribution.map(domo => (
              <div key={domo.number} className="p-2 bg-secondary/30 rounded-md flex justify-between">
                <span>Domo {domo.number}: {domo.guests} {domo.guests === 1 ? 'persona' : 'personas'}</span>
                <span className="font-medium">{formatCurrency(quote.pricePerDomo)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Show extras breakdown if selected */}
      {hasSelectedExtras && (
        <>
          {selectedActivities.length > 0 && (
            <div className="flex justify-between items-center text-indigo-700">
              <span>Total actividades ({selectedActivities.length})</span>
              <span>{formatCurrency(activitiesTotal)}</span>
            </div>
          )}
          
          {selectedPackages.length > 0 && (
            <div className="flex justify-between items-center text-indigo-700">
              <span>Total paquetes ({selectedPackages.length})</span>
              <span>{formatCurrency(packagesTotal)}</span>
            </div>
          )}
          
          {extrasTotal > 0 && (
            <div className="flex justify-between items-center font-medium text-indigo-800 bg-indigo-50 p-2 rounded mt-2">
              <span>Total extras incluidos</span>
              <span>{formatCurrency(extrasTotal)}</span>
            </div>
          )}
          
          <ExtrasDetails 
            selectedActivities={selectedActivities}
            selectedPackages={selectedPackages}
          />
        </>
      )}
      
      <hr className="my-2" />
      
      <div className="flex justify-between items-center font-bold">
        <span>Total</span>
        <span>{formatCurrency(finalTotal)}</span>
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
          <Edit size={16} />
          Modificar reserva
        </Button>
      </div>
    </div>
  );
};

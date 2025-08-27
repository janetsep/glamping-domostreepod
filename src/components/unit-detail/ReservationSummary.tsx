
import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, ThemedPackage } from "@/types";
import { ExtrasDetails } from "./ExtrasDetails";
import { RefreshCcw, CreditCard } from "lucide-react";

interface ReservationSummaryProps {
  quote: {
    nights: number;
    pricePerNight: number;
    totalPrice: number;
    breakdown: Array<{ 
      description: string; 
      amount: number;
      guests?: number;
      domoNumber?: number;
    }>;
    rateDescription?: string;
    requiredDomos?: number;
    domoDistribution?: Array<{ number: number; guests: number }>;
    season?: 'high' | 'medium' | 'low';
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

  // Calcular totales de extras
  const activitiesTotal = selectedActivities.reduce((sum, activity) => sum + activity.price, 0);
  const packagesTotal = selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0);
  const extrasTotal = activitiesTotal + packagesTotal;

  // Precio base es el precio de los domos sin extras
  const basePrice = quote.totalPrice;
  // Precio total es el precio base más los extras
  const finalTotal = basePrice + extrasTotal;
  
  // Función para mostrar el título de temporada
  const getSeasonTitle = () => {
    if (!quote.season) return null;
    
    const seasonNames = {
      high: "Temporada alta (junio a agosto)",
      medium: "Temporada media (marzo a mayo)",
      low: "Temporada baja (septiembre a febrero)"
    };
    
    return (
      <div className="text-sm font-medium mb-2 text-amber-600">
        {seasonNames[quote.season]}
      </div>
    );
  };

  // Función para mostrar mensaje para domos adicionales sin huéspedes
  const getDomoDescription = (item: any) => {
    if (item.guests === 0) {
      return (
        <>
          <span>{item.domoNumber}: 2 personas</span>
          <span className="text-xs text-amber-600 ml-2">(Domo adicional)</span>
        </>
      );
    }
    return <span>{item.domoNumber}: {item.guests} {item.guests === 1 ? 'persona' : 'personas'}</span>;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Resumen de tu estadía</h3>
      
      {getSeasonTitle()}
      
      {/* Mostrar desglose detallado para paquetes de celebración */}
      {quote.breakdown && Array.isArray(quote.breakdown) && quote.breakdown.length > 0 && (
        <div className="space-y-2">
          {quote.breakdown.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <span className={`${index === 0 ? 'font-medium text-gray-700' : 'text-gray-600'}`}>
                {item.description}
              </span>
              <span className={`${index === 0 ? 'font-semibold' : 'font-medium'}`}>
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Fallback para formato anterior */}
      {quote.breakdown && !Array.isArray(quote.breakdown) && (
        <div className="flex justify-between items-center font-medium">
          <span className="text-gray-700">Estadía total</span>
          <span className="font-semibold">{formatCurrency(quote.totalPrice)}</span>
        </div>
      )}
      
      {quote.rateDescription && (
        <div className="text-sm text-cyan-600 mb-2">
          {quote.rateDescription}
        </div>
      )}
      
      <hr className="my-2" />
      
      {/* Mostrar distribución de domos detallada */}
      {quote.domoDistribution && quote.domoDistribution.length > 0 && (
        <div className="mt-3 bg-secondary/10 p-3 rounded-md">
          <div className="grid grid-cols-1 gap-2">
            {/* Mostrar todos los domos de la distribución, incluso los que no tienen huéspedes */}
            {quote.breakdown
              .filter(item => item.domoNumber && item.domoNumber > 0)
              .map(item => (
                <div key={item.domoNumber} className="p-2 bg-secondary/30 rounded-md flex justify-between">
                  <div className="flex items-center">
                    {getDomoDescription(item)}
                  </div>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {/* Mostrar desglose de extras si están seleccionados */}
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
          disabled={isLoading}
          className="flex-1 flex items-center gap-2"
        >
          <CreditCard size={16} />
          {isLoading ? "Procesando pago..." : "Pagar con WebPay"}
        </Button>
        
        <Button
          onClick={onReserve}
          variant="outline"
          className="flex-1 flex items-center gap-2"
        >
          <RefreshCcw size={16} />
          Modificar cotización
        </Button>
      </div>

      <div className="text-xs text-gray-500 mt-2 text-center">
        Serás redirigido a WebPay para completar el pago de forma segura
      </div>
    </div>
  );
};

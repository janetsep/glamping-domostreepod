
import { Button } from "@/components/ui/button";
import { Activity, ThemedPackage } from "@/types";

interface ReservationSummaryProps {
  quote: {
    nights: number;
    pricePerNight: number;
    basePrice: number;
    totalPrice: number;
    breakdown: Array<{ description: string; amount: number }>;
    rateDescription?: string;
  };
  isAvailable: boolean;
  isLoading: boolean;
  onReserve: () => void;
  onConfirm: () => void;
  buttonText: string;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  hasSelectedExtras: boolean;
}

export const ReservationSummary = ({
  quote,
  isAvailable,
  isLoading,
  onReserve,
  onConfirm,
  buttonText,
  selectedActivities,
  selectedPackages,
  hasSelectedExtras
}: ReservationSummaryProps) => {
  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <h3 className="text-lg font-semibold">Resumen de reserva</h3>
      
      {quote.rateDescription && (
        <div className="text-sm font-medium text-primary px-2 py-1 bg-primary/10 rounded-md inline-block mb-2">
          {quote.rateDescription}
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Precio base por noche:</span>
          <span>${quote.pricePerNight.toLocaleString()}</span>
        </div>
        
        {quote.breakdown.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.description}:</span>
            <span>${Math.round(item.amount).toLocaleString()}</span>
          </div>
        ))}
        
        {hasSelectedExtras && (
          <>
            <div className="border-t border-gray-200 my-2"></div>
            {selectedActivities.length > 0 && (
              <div className="flex justify-between text-sm font-medium">
                <span>Actividades seleccionadas ({selectedActivities.length}):</span>
                <span>${selectedActivities.reduce((acc, act) => acc + act.price, 0).toLocaleString()}</span>
              </div>
            )}
            
            {selectedPackages.length > 0 && (
              <div className="flex justify-between text-sm font-medium">
                <span>Paquetes temáticos ({selectedPackages.length}):</span>
                <span>${selectedPackages.reduce((acc, pkg) => acc + pkg.price, 0).toLocaleString()}</span>
              </div>
            )}
          </>
        )}
        
        <div className="border-t border-gray-200 my-2"></div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${quote.totalPrice.toLocaleString()}</span>
        </div>
      </div>
      
      <Button
        className="w-full"
        onClick={isAvailable ? onConfirm : onReserve}
        disabled={isLoading}
      >
        {isLoading ? "Procesando..." : buttonText}
      </Button>
    </div>
  );
};

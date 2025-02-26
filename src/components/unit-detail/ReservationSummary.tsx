
import { Button } from "@/components/ui/button";

interface ReservationSummaryProps {
  quote: {
    breakdown: Array<{ description: string; amount: number }>;
    totalPrice: number;
  };
  isAvailable: boolean;
  isLoading: boolean;
  onReserve: () => void;
}

export const ReservationSummary = ({
  quote,
  isAvailable,
  isLoading,
  onReserve,
}: ReservationSummaryProps) => {
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

      <Button
        className="w-full"
        size="lg"
        disabled={isLoading || !isAvailable}
        onClick={onReserve}
      >
        {isAvailable ? "Reservar ahora" : "Fechas no disponibles"}
      </Button>
    </div>
  );
};


import { Button } from "@/components/ui/button";

interface ReservationButtonProps {
  startDate?: Date;
  endDate?: Date;
  hasSufficientDomos: boolean;
  calculatedRequiredDomos: number;
  availableDomos?: number;
  onReservation: () => void;
}

export const ReservationButton = ({
  startDate,
  endDate,
  hasSufficientDomos,
  calculatedRequiredDomos,
  availableDomos,
  onReservation
}: ReservationButtonProps) => {
  const canQuote = startDate && endDate && hasSufficientDomos;

  console.log('🔍 [ReservationButton] Estado del botón:', {
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    hasSufficientDomos,
    calculatedRequiredDomos,
    availableDomos,
    canQuote
  });

  const getButtonText = () => {
    if (!startDate || !endDate) {
      return "Selecciona fechas para cotizar";
    }
    if (availableDomos === undefined) {
      return "Verificando disponibilidad...";
    }
    if (!hasSufficientDomos) {
      return `Necesitas reducir huéspedes (${calculatedRequiredDomos} domo${calculatedRequiredDomos === 1 ? "" : "s"} requeridos, ${availableDomos} disponible${availableDomos === 1 ? "" : "s"})`;
    }
    return "Cotizar";
  };

  return (
    <Button 
      type="button" 
      className="w-full" 
      size="lg" 
      onClick={onReservation} 
      disabled={!canQuote}
    >
      {getButtonText()}
    </Button>
  );
};

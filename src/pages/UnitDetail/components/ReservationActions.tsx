
import { Button } from "@/components/ui/button";
import { Activity, ThemedPackage } from "@/types";

interface ReservationActionsProps {
  onReservation: () => void;
  isAvailable: boolean | null;
  startDate?: Date;
  endDate?: Date;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  isPartialAvailability?: boolean;
}

export const ReservationActions = ({
  onReservation,
  isAvailable,
  startDate,
  endDate,
  selectedActivities,
  selectedPackages,
  isPartialAvailability = false
}: ReservationActionsProps) => {
  return (
    <div className="space-y-2">
      <Button 
        className="w-full" 
        size="lg"
        onClick={onReservation}
        disabled={!startDate || !endDate || (isAvailable === false && !isPartialAvailability)}
      >
        {isAvailable === true ? 'Cotizar estadía' : 'Verificar disponibilidad'}
      </Button>
      
      {(selectedActivities.length > 0 || selectedPackages.length > 0) && (
        <div className="text-sm text-center text-primary">
          Has seleccionado {selectedActivities.length} actividades y {selectedPackages.length} paquetes.
        </div>
      )}
    </div>
  );
};

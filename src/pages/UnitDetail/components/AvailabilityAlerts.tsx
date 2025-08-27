import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Check } from "lucide-react";
interface AvailabilityAlertsProps {
  availableDomos?: number;
  calculatedRequiredDomos: number;
  guests: number;
}
export const AvailabilityAlerts = ({
  availableDomos,
  calculatedRequiredDomos,
  guests
}: AvailabilityAlertsProps) => {
  if (availableDomos === undefined || calculatedRequiredDomos <= 0) {
    return null;
  }
  if (availableDomos >= calculatedRequiredDomos) {
    return;
  }
  if (availableDomos > 0) {
    return <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Disponibilidad limitada</AlertTitle>
        <AlertDescription className="text-amber-700">
          Solo hay {availableDomos} domo{availableDomos === 1 ? "" : "s"} para el rango completo. Necesitas {calculatedRequiredDomos} domos para {guests} huésped{guests > 1 ? "es" : ""}. Te sugerimos reducir huéspedes o modificar fechas.
        </AlertDescription>
      </Alert>;
  }
  return <Alert variant="destructive" className="bg-red-50 border-red-200">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-800">No disponible</AlertTitle>
      <AlertDescription className="text-red-700">
        No hay domos disponibles para todas las noches seleccionadas.
      </AlertDescription>
    </Alert>;
};
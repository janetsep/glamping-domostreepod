interface AvailabilityAlertsProps {
  isAvailable: boolean | null;
  availableDomos?: number;
  requiredDomos?: number;
  guests: number;
}

export const AvailabilityAlerts = ({ 
  isAvailable, 
  availableDomos, 
  requiredDomos, 
  guests 
}: AvailabilityAlertsProps) => {
  return (
    <>
      {isAvailable === false && (
        <div className="p-3 bg-red-50 border border-red-100 rounded text-red-800 text-sm mt-4">
          No hay disponibilidad para las fechas seleccionadas. Por favor, selecciona otras fechas.
        </div>
      )}
      
      {availableDomos !== undefined && requiredDomos !== undefined && availableDomos < requiredDomos && (
        <div className="p-3 bg-amber-50 border border-amber-100 rounded text-amber-800 text-sm mt-4">
          No hay suficientes domos disponibles. Se necesitan {requiredDomos} domos para {guests} huéspedes, 
          pero solo hay {availableDomos} disponibles. Por favor, reduce la cantidad de huéspedes o selecciona otras fechas.
        </div>
      )}
    </>
  );
};

import { Minus, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reservationContent } from "@/data/content/reservation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DomoCounterProps {
  requiredDomos: number;
  setRequiredDomos: (domos: number) => void;
  minRequiredDomos: number;
  maxDomos?: number;
  availableDomos?: number;
  guests: number;
}

export const DomoCounter = ({
  requiredDomos,
  setRequiredDomos,
  minRequiredDomos,
  maxDomos = 3, // Limitado al 75% del total de domos
  availableDomos,
  guests
}: DomoCounterProps) => {
  // Determinar el máximo de domos que se pueden seleccionar
  // Si hay disponibles, respetamos ese límite, si no, usamos el máximo configurado
  const effectiveMaxDomos = availableDomos !== undefined ? 
    Math.min(availableDomos, maxDomos) : maxDomos;
  
  // Calcular cuántos huéspedes habrá por domo (redondeado hacia arriba)
  const guestsPerDomo = Math.ceil(guests / requiredDomos);
  
  // Calcular la capacidad máxima por domo (típicamente 4)
  const maxCapacityPerDomo = 4;
  
  // Comprobar si estamos excediendo la capacidad por domo
  const isExceedingCapacity = guestsPerDomo > maxCapacityPerDomo;

  const handleDecrease = () => {
    if (requiredDomos > minRequiredDomos) {
      setRequiredDomos(requiredDomos - 1);
    }
  };

  const handleIncrease = () => {
    if (requiredDomos < effectiveMaxDomos) {
      setRequiredDomos(requiredDomos + 1);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">
            {reservationContent.guests.requiredDomos}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Cada domo tiene capacidad para un máximo de 4 personas.
                  Se necesitan al menos {minRequiredDomos} domos para {guests} {guests === 1 ? 'persona' : 'personas'}.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDecrease}
            disabled={requiredDomos <= minRequiredDomos}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="w-6 text-center font-medium">
            {requiredDomos}
          </span>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleIncrease}
            disabled={requiredDomos >= effectiveMaxDomos}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 flex justify-between">
        <span>{guests} {reservationContent.guests.total}</span>
        <span>{guestsPerDomo} {reservationContent.guests.guestsPerDomo}</span>
      </div>
      
      {isExceedingCapacity && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>
            Estás excediendo la capacidad máxima por domo. Por favor, selecciona más domos o reduce el número de huéspedes.
          </AlertDescription>
        </Alert>
      )}
      
      {requiredDomos < minRequiredDomos && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>
            Para {guests} {guests === 1 ? 'huésped' : 'huéspedes'} necesitas al menos {minRequiredDomos} {minRequiredDomos === 1 ? 'domo' : 'domos'}.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

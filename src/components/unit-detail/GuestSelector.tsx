
import React, { useState, useEffect } from "react";
import { Minus, Plus, Users, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestSelectorProps {
  guests: number;
  setGuests?: React.Dispatch<React.SetStateAction<number>>;
  maxGuests: number;
  onChange?: (guests: number) => void;
  onGuestsChange?: (guests: number) => void;
  maxDomos?: number;
  requiredDomos?: number;
  onDomosChange?: (domos: number) => void;
}

export const GuestSelector = ({ 
  guests, 
  setGuests, 
  maxGuests,
  onChange,
  onGuestsChange,
  maxDomos = 4,
  requiredDomos: initialRequiredDomos,
  onDomosChange
}: GuestSelectorProps) => {
  // Calcular domos requeridos inicialmente basado en huéspedes
  const maxDomoGuests = 4; // Capacidad máxima por domo
  const calculatedRequiredDomos = Math.ceil(guests / maxDomoGuests);
  
  // Estado local para domos si no se proporciona desde fuera
  const [localDomos, setLocalDomos] = useState(initialRequiredDomos || calculatedRequiredDomos);
  
  // Usar el valor calculado o el proporcionado externamente
  const requiredDomos = initialRequiredDomos || localDomos;

  // Recalcular domos cuando cambia el número de huéspedes
  useEffect(() => {
    const newRequiredDomos = Math.ceil(guests / maxDomoGuests);
    if (!initialRequiredDomos) {
      setLocalDomos(newRequiredDomos);
    }
  }, [guests, maxDomoGuests, initialRequiredDomos]);

  const increaseGuests = () => {
    // Permitir hasta 16 huéspedes en total
    if (guests < 16) {
      const newGuestCount = guests + 1;
      if (setGuests) setGuests(newGuestCount);
      if (onChange) onChange(newGuestCount);
      if (onGuestsChange) onGuestsChange(newGuestCount);
    }
  };

  const decreaseGuests = () => {
    if (guests > 1) {
      const newGuestCount = guests - 1;
      if (setGuests) setGuests(newGuestCount);
      if (onChange) onChange(newGuestCount);
      if (onGuestsChange) onGuestsChange(newGuestCount);
    }
  };

  const increaseDomos = () => {
    if (requiredDomos < maxDomos) {
      const newDomos = requiredDomos + 1;
      if (!initialRequiredDomos) {
        setLocalDomos(newDomos);
      }
      if (onDomosChange) {
        onDomosChange(newDomos);
      }
    }
  };

  const decreaseDomos = () => {
    // Asegurar un mínimo de domos según los huéspedes
    const minDomos = Math.ceil(guests / maxDomoGuests);
    if (requiredDomos > minDomos && requiredDomos > 1) {
      const newDomos = requiredDomos - 1;
      if (!initialRequiredDomos) {
        setLocalDomos(newDomos);
      }
      if (onDomosChange) {
        onDomosChange(newDomos);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Huéspedes
        </label>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-primary mr-2" />
            <span>{guests} {guests === 1 ? 'huésped' : 'huéspedes'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
              onClick={decreaseGuests}
              disabled={guests <= 1}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Menos huéspedes</span>
            </Button>
            <span className="w-6 text-center">{guests}</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
              onClick={increaseGuests}
              disabled={guests >= 16}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Más huéspedes</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Domos
        </label>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Home className="w-5 h-5 text-primary mr-2" />
            <span>{requiredDomos} {requiredDomos === 1 ? 'domo' : 'domos'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
              onClick={decreaseDomos}
              disabled={requiredDomos <= Math.ceil(guests / maxDomoGuests) || requiredDomos <= 1}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Menos domos</span>
            </Button>
            <span className="w-6 text-center">{requiredDomos}</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
              onClick={increaseDomos}
              disabled={requiredDomos >= maxDomos}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Más domos</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mt-1">
          Cada domo aloja máximo {maxDomoGuests} personas.
        </p>
        <p className="text-sm text-muted-foreground">
          Configuración actual: {guests} {guests === 1 ? 'huésped' : 'huéspedes'} en {requiredDomos} {requiredDomos === 1 ? 'domo' : 'domos'}.
        </p>
        {requiredDomos > Math.ceil(guests / maxDomoGuests) && (
          <p className="text-sm text-amber-600 mt-1">
            Has seleccionado más domos de los necesarios. Esto te dará más espacio y privacidad.
          </p>
        )}
      </div>
    </div>
  );
};

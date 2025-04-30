
import React from "react";
import { Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestSelectorProps {
  guests: number;
  setGuests: React.Dispatch<React.SetStateAction<number>>;
  maxGuests: number;
  onChange?: (guests: number) => void;
  onGuestsChange?: (guests: number) => void; // Agregado para compatibilidad
  maxDomos?: number; // Agregado para compatibilidad
}

export const GuestSelector = ({ 
  guests, 
  setGuests, 
  maxGuests,
  onChange,
  onGuestsChange // Nuevo parámetro
}: GuestSelectorProps) => {
  const increaseGuests = () => {
    if (guests < maxGuests) {
      const newGuestCount = guests + 1;
      setGuests(newGuestCount);
      if (onChange) onChange(newGuestCount);
      if (onGuestsChange) onGuestsChange(newGuestCount);
    }
  };

  const decreaseGuests = () => {
    if (guests > 1) {
      const newGuestCount = guests - 1;
      setGuests(newGuestCount);
      if (onChange) onChange(newGuestCount);
      if (onGuestsChange) onGuestsChange(newGuestCount);
    }
  };

  // Calculate required domos based on the current guest count
  // Assuming each domo can host up to 4 guests (or whatever the maxGuests value is)
  const maxDomoGuests = 4; // Este es el valor por defecto si no tenemos acceso al valor real por domo
  const requiredDomos = Math.ceil(guests / maxDomoGuests);

  return (
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
            disabled={guests >= maxGuests}
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Más huéspedes</span>
          </Button>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mt-1">
          Cada domo aloja máximo {maxDomoGuests} personas.
        </p>
        <p className="text-sm text-muted-foreground">
          {requiredDomos > 1 
            ? `Para ${guests} huéspedes necesitarás ${requiredDomos} domos.` 
            : `Para ${guests} huéspedes necesitarás 1 domo.`
          }
        </p>
      </div>
    </div>
  );
};


import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoIcon } from 'lucide-react';

interface GuestSelectorProps {
  maxGuests: number;
  guests: number;
  onGuestsChange: (guests: number) => void;
  maxDomos: number;
  requiredDomos?: number;
  onDomosChange?: (domos: number) => void;
  availableDomos?: number;
}

export const GuestSelector = ({
  maxGuests = 16,
  guests,
  onGuestsChange,
  maxDomos = 4,
  requiredDomos = 1,
  onDomosChange,
  availableDomos
}: GuestSelectorProps) => {
  const handleGuestsChange = (value: string) => {
    const newGuestCount = parseInt(value);
    
    if (!isNaN(newGuestCount)) {
      onGuestsChange(newGuestCount);
    }
  };
  
  const handleDomosChange = (value: string) => {
    const newDomosCount = parseInt(value);
    
    if (!isNaN(newDomosCount) && onDomosChange) {
      onDomosChange(newDomosCount);
    }
  };

  // Limitamos el máximo número de domos que se pueden seleccionar
  const effectiveMaxDomos = availableDomos !== undefined && availableDomos < maxDomos 
    ? availableDomos 
    : maxDomos;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="select-guests" className="block mb-2">
            Huéspedes
          </Label>
          <Select
            value={guests.toString()}
            onValueChange={handleGuestsChange}
          >
            <SelectTrigger id="select-guests">
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map(
                  (num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'huésped' : 'huéspedes'}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="select-domos" className="block mb-2 flex items-center">
            Domos requeridos
            {availableDomos !== undefined && availableDomos < maxDomos && (
              <span className="ml-2 inline-flex items-center text-amber-500 text-xs">
                <InfoIcon className="h-3 w-3 mr-1" />
                Solo {availableDomos} disponibles
              </span>
            )}
          </Label>
          <Select
            value={requiredDomos.toString()}
            onValueChange={handleDomosChange}
            disabled={!onDomosChange}
          >
            <SelectTrigger id="select-domos">
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from({ length: effectiveMaxDomos }, (_, i) => i + 1).map(
                  (num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'domo' : 'domos'}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          Cada domo puede acomodar hasta 4 personas.
          {requiredDomos > 1 && (
            <span> Has seleccionado {requiredDomos} domos.</span>
          )}
        </p>
      </div>
    </div>
  );
};

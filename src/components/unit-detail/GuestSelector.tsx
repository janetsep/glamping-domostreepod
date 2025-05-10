
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

  return (
    <div className="space-y-4">
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

      <div className="text-sm text-muted-foreground">
        <p>
          Cada domo puede acomodar hasta 4 personas.
          {requiredDomos > 0 && (
            <span className="font-medium"> Se necesitarán {requiredDomos} {requiredDomos === 1 ? 'domo' : 'domos'} para {guests} {guests === 1 ? 'huésped' : 'huéspedes'}.</span>
          )}
          {availableDomos !== undefined && availableDomos < requiredDomos && (
            <span className="text-amber-600 block mt-1">
              <InfoIcon className="h-3 w-3 inline mr-1" />
              Solo hay {availableDomos} {availableDomos === 1 ? 'domo disponible' : 'domos disponibles'} para las fechas seleccionadas.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface GuestSelectorProps {
  maxGuests: number;
  guests: number;
  onGuestsChange: (guests: number) => void;
  maxDomos?: number;
}

export const GuestSelector = ({
  maxGuests,
  guests,
  onGuestsChange,
  maxDomos = 4,
}: GuestSelectorProps) => {
  const [error, setError] = useState<string | null>(null);
  const maxTotalGuests = maxDomos * maxGuests;

  useEffect(() => {
    const requiredDomos = Math.ceil(guests / maxGuests);
    
    if (guests > maxTotalGuests) {
      setError(`El máximo de huéspedes permitido es ${maxTotalGuests}`);
    } else {
      setError(null);
    }
    
    onGuestsChange(guests);
  }, [guests, onGuestsChange, maxTotalGuests, maxGuests]);

  const calculateRequiredDomos = () => {
    return Math.ceil(guests / maxGuests);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="guests">Número de huéspedes</Label>
        <Select
          value={guests.toString()}
          onValueChange={(value) => {
            const newGuests = parseInt(value);
            if (newGuests <= maxTotalGuests) {
              onGuestsChange(newGuests);
            }
          }}
        >
          <SelectTrigger id="guests">
            <SelectValue placeholder="Selecciona el número de huéspedes" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: maxTotalGuests + 1 }, (_, i) => i).map((num) => (
              <SelectItem key={`guest-${num}`} value={num.toString()}>
                {num} {num === 1 ? "huésped" : "huéspedes"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-primary/10 p-3 rounded-md">
        <p className="text-sm font-medium">Domos necesarios: {calculateRequiredDomos()}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Huéspedes totales: {guests} personas
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Cada domo aloja máximo {maxGuests} personas.
        </p>
      </div>
    </div>
  );
};

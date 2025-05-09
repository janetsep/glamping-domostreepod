
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Users } from "lucide-react";

interface GuestCounterProps {
  guests: number;
  setGuests: (guests: number) => void;
  maxGuests: number;
}

const GuestCounter = ({
  guests,
  setGuests,
  maxGuests
}: GuestCounterProps) => {
  const handleIncrement = () => {
    if (guests < maxGuests) {
      setGuests(guests + 1);
    }
  };

  const handleDecrement = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-cyan-600" />
          <span className="text-sm font-medium">Número de huéspedes</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleDecrement}
            disabled={guests <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{guests}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleIncrement}
            disabled={guests >= maxGuests}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Capacidad máxima: {maxGuests} huéspedes 
        {maxGuests > 4 && " (múltiples domos)"}
      </div>
    </div>
  );
};

export { GuestCounter };
export default GuestCounter;

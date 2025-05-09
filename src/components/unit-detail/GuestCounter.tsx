
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '../ui/button';

interface GuestCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

const GuestCounter = ({ value, onChange, min = 1, max = 16, label = "Huéspedes" }: GuestCounterProps) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDecrement}
          disabled={value <= min}
          className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
          aria-label="Disminuir"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="mx-4 w-6 text-center">{value}</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleIncrement}
          disabled={value >= max}
          className="rounded-full h-8 w-8 p-0 flex items-center justify-center" 
          aria-label="Aumentar"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GuestCounter;

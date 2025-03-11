
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
  onAdultsChange?: (adults: number) => void;
  onChildrenChange?: (children: number) => void;
  maxDomos?: number;
}

export const GuestSelector = ({
  maxGuests,
  guests,
  onGuestsChange,
  onAdultsChange,
  onChildrenChange,
  maxDomos = 4,
}: GuestSelectorProps) => {
  const [adults, setAdults] = useState<number>(guests > 0 ? 1 : 0);
  const [children, setChildren] = useState<number>(guests > 1 ? guests - 1 : 0);
  const [pets, setPets] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const maxTotalGuests = maxDomos * maxGuests;

  useEffect(() => {
    const total = adults + children;
    const requiredDomos = Math.ceil(total / maxGuests);
    
    if (total === maxTotalGuests && adults < 4) {
      setError("Para 16 huéspedes, se requieren al menos 4 adultos (uno por domo)");
    } 
    else if (adults < requiredDomos) {
      setError(`Se necesitan ${requiredDomos} domos. Debe haber al menos ${requiredDomos} adultos (uno por domo)`);
    } 
    else {
      setError(null);
    }
    
    onGuestsChange(total);
    if (onAdultsChange) onAdultsChange(adults);
    if (onChildrenChange) onChildrenChange(children);
  }, [adults, children, onGuestsChange, onAdultsChange, onChildrenChange, maxTotalGuests, maxGuests]);

  const calculateRequiredDomos = () => {
    const total = adults + children;
    return Math.ceil(total / maxGuests);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="adults">Adultos</Label>
          <Select
            value={adults.toString()}
            onValueChange={(value) => {
              const newAdults = parseInt(value);
              if (newAdults + children <= maxTotalGuests) {
                setAdults(newAdults);
              }
            }}
          >
            <SelectTrigger id="adults">
              <SelectValue placeholder="Número de adultos" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxTotalGuests + 1 }, (_, i) => i).map((num) => (
                <SelectItem key={`adult-${num}`} value={num.toString()}>
                  {num} {num === 1 ? "adulto" : "adultos"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="children">Niños</Label>
          <Select
            value={children.toString()}
            onValueChange={(value) => {
              const newChildren = parseInt(value);
              if (adults + newChildren <= maxTotalGuests) {
                setChildren(newChildren);
              }
            }}
          >
            <SelectTrigger id="children">
              <SelectValue placeholder="Número de niños" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxTotalGuests + 1 }, (_, i) => i).map((num) => (
                <SelectItem key={`child-${num}`} value={num.toString()}>
                  {num} {num === 1 ? "niño" : "niños"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pets">Mascotas</Label>
          <Select
            value={pets.toString()}
            onValueChange={(value) => setPets(parseInt(value))}
          >
            <SelectTrigger id="pets">
              <SelectValue placeholder="Número de mascotas" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 9 }, (_, i) => i).map((num) => (
                <SelectItem key={`pet-${num}`} value={num.toString()}>
                  {num} {num === 1 ? "mascota" : "mascotas"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          Huéspedes totales: {adults + children} personas
          {pets > 0 && ` y ${pets} ${pets === 1 ? 'mascota' : 'mascotas'}`}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Cada domo aloja máximo {maxGuests} personas y hasta 2 mascotas pequeñas.
        </p>
      </div>
    </div>
  );
};


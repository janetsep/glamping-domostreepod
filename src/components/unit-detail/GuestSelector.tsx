
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GuestSelectorProps {
  maxGuests: number;
  guests: number;
  onGuestsChange: (guests: number) => void;
}

export const GuestSelector = ({
  maxGuests,
  guests,
  onGuestsChange,
}: GuestSelectorProps) => {
  return (
    <Select
      value={guests.toString()}
      onValueChange={(value) => onGuestsChange(parseInt(value))}
    >
      <SelectTrigger>
        <SelectValue placeholder="Número de huéspedes" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
          <SelectItem key={num} value={num.toString()}>
            {num} {num === 1 ? "huésped" : "huéspedes"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

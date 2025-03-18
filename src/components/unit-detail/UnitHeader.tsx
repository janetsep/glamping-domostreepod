
import { Users } from "lucide-react";

interface UnitHeaderProps {
  name: string;
  size: string;
  maxGuests: number;
  description: string;
}

export const UnitHeader = ({ name, size, maxGuests, description }: UnitHeaderProps) => {
  return (
    <>
      <h1 className="text-3xl font-display font-bold text-primary mb-2">
        {name}
      </h1>
      
      <div className="flex items-center text-gray-600 mb-4">
        <span className="text-sm bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
          {size}
        </span>
        <span className="mx-2">•</span>
        <div className="flex items-center">
          <Users size={16} className="mr-1" />
          <span>Hasta {maxGuests} personas</span>
        </div>
      </div>
      
      <p className="text-gray-700 mb-6 text-lg">{description}</p>
    </>
  );
};

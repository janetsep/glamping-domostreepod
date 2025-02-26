
import { Users } from "lucide-react";
import type { GlampingUnit } from "@/lib/supabase";

interface UnitInfoProps {
  unit: GlampingUnit;
}

export const UnitInfo = ({ unit }: UnitInfoProps) => {
  return (
    <div>
      <img
        src={unit.image_url || "/placeholder.svg"}
        alt={unit.name}
        className="w-full h-96 object-cover rounded-lg"
      />
      <div className="mt-6">
        <h1 className="text-3xl font-display font-bold text-primary mb-4">
          {unit.name}
        </h1>
        <p className="text-gray-600 mb-4">{unit.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>Hasta {unit.max_guests} personas</span>
          </div>
        </div>
      </div>
    </div>
  );
};


import { Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { GlampingUnit } from "@/lib/supabase";

interface GlampingUnitsProps {
  units: GlampingUnit[];
  isLoading: boolean;
}

const GlampingUnits = ({ units, isLoading }: GlampingUnitsProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-display font-bold text-primary mb-12 text-center">
          Nuestros Glampings
        </h3>
        {isLoading ? (
          <div className="text-center">Cargando unidades...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {units.map((unit) => (
              <div key={unit.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02] animate-fadeIn">
                <img
                  src={unit.image_url || "/placeholder.svg"}
                  alt={unit.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-display font-bold mb-2">{unit.name}</h4>
                  <p className="text-gray-600 mb-4">
                    {unit.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>Hasta {unit.max_guests} personas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>Vista al bosque</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">${unit.price_per_night.toLocaleString()}/noche</span>
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/unit/${unit.id}`)}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GlampingUnits;

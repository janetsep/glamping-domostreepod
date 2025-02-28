
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

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-display font-bold text-primary mb-12 text-center">
            Nuestros Glampings
          </h3>
          <div className="text-center text-lg">Cargando unidades...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-display font-bold text-primary mb-12 text-center">
          Nuestros Glampings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {units.map((unit) => (
            <div 
              key={unit.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02] animate-fadeIn relative group"
              onClick={() => navigate(`/unit/${unit.id}`)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={unit.image_url || "/placeholder.svg"}
                  alt={unit.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay que aparece al hacer hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h4 className="text-xl font-display font-bold text-white mb-2">{unit.name}</h4>
                  <p className="text-white/90 text-sm mb-4 line-clamp-3">
                    {unit.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/80 mb-3">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>Hasta {unit.max_guests} personas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>Vista al bosque</span>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-white">${unit.price_per_night.toLocaleString()}/noche</span>
                </div>
              </div>
              
              {/* Información visible sin hover */}
              <div className="p-6 group-hover:bg-primary/5 transition-colors">
                <h4 className="text-xl font-display font-bold mb-2">{unit.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">${unit.price_per_night.toLocaleString()}/noche</span>
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/unit/${unit.id}`);
                    }}
                  >
                    Ver detalles
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlampingUnits;

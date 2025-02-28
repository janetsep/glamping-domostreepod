
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

  // Imágenes interiores actualizadas para mostrar en carrusel
  const interiorImages = [
    "/lovable-uploads/381ffefb-15d1-43c6-b9a2-576aefbb71ab.png",
    "/lovable-uploads/7f7e32a2-1e84-49ce-9d9c-fd06aece4b05.png",
    "/lovable-uploads/21690294-058b-4ab7-9d01-fcf2bd94b8b3.png"
  ];

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
        <h3 className="text-3xl font-display font-bold text-primary mb-4 text-center">
          Nuestros Glampings
        </h3>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Disfruta de amplios espacios interiores con vistas panorámicas al bosque. Cada domo está equipado con camas confortables y áreas de estar.
        </p>

        {/* Galería de imágenes interiores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {interiorImages.map((img, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md h-64">
              <img 
                src={img} 
                alt={`Interior del domo ${index + 1}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {units.map((unit) => (
            <div 
              key={unit.id} 
              className="rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02] animate-fadeIn cursor-pointer"
              onClick={() => navigate(`/unit/${unit.id}`)}
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={unit.image_url || "/placeholder.svg"}
                  alt={unit.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {/* Overlay oscuro permanente pero sutil con información básica */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-xl font-display font-bold text-white">{unit.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-white/90 my-2">
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
                
                {/* Overlay con mensaje de clic para más información */}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button 
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/unit/${unit.id}`);
                    }}
                  >
                    Ver más información
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

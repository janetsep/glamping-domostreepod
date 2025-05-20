
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { GlampingUnit } from "@/lib/supabase";
import { travelerTypesContent } from "@/data/content/travelerTypes";
import { Button } from "@/components/ui/button";

interface PackagesProps {
  units: GlampingUnit[];
  isLoading: boolean;
}

const Packages = ({ units, isLoading }: PackagesProps) => {
  const navigate = useNavigate();
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  const handleTravelerTypeClick = (typeId: string) => {
    navigate(`/tipo-viajero/${typeId}`);
  };

  return (
    <section id="packages" className="py-10 bg-secondary/10">
      {/* Franja de título sin texto */}
      <div className="w-full bg-primary/5 border-b border-primary/10 py-3 mb-8">
        <div className="container mx-auto px-4">
          {/* Título removido de la franja */}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">Descubre Nuestros Domos</h2>
        <p className="text-xl text-center text-gray-600 mb-10 max-w-3xl mx-auto">Alojamientos personalizados para cada tipo de viajero. Nuestros domos se adaptan a tus necesidades y te ofrecen una experiencia única en Valle Las Trancas.</p>
        
        {/* Tipos de viajero con efecto hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {travelerTypesContent.travelerTypes.map(type => (
            <div 
              key={type.id}
              className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
              onMouseEnter={() => setHoveredType(type.id)}
              onMouseLeave={() => setHoveredType(null)}
              onClick={() => handleTravelerTypeClick(type.id)}
            >
              <div className="relative h-64 cursor-pointer">
                <img 
                  src={type.image} 
                  alt={type.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white text-xl font-semibold">
                    {type.name}
                  </h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-gray-700 line-clamp-2">
                  {type.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <Button 
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTravelerTypeClick(type.id);
                    }}
                  >
                    Ver experiencia
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button 
            size="lg" 
            onClick={() => navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9')}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            Reservar ahora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Packages;

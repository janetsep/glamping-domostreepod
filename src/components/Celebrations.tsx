
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/Section";
import { celebrationsContent } from "@/data/content/celebrations";
import { PartyPopper, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Celebrations = () => {
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    // Navegamos a la página de detalle de celebración
    navigate(`/celebracion/${id}`);
    // No es necesario hacer scroll aquí ya que el useEffect en CelebrationDetail se encargará de eso
  };

  return (
    <Section
      id="celebrations"
      title={celebrationsContent.title}
      subtitle={celebrationsContent.subtitle}
      centered
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {celebrationsContent.celebrations.map((celebration) => (
          <div 
            key={celebration.id} 
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div 
              className="relative h-64 cursor-pointer"
              onClick={() => handleNavigate(celebration.id)}
            >
              <img 
                src={celebration.image} 
                alt={celebration.name} 
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <h3 className="text-white font-semibold text-xl p-4">
                  {celebration.name}
                </h3>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-gray-700 line-clamp-3">
                {celebration.description}
              </p>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => handleNavigate(celebration.id)}
                >
                  <Info className="mr-2 h-4 w-4" />
                  Ver detalles
                </Button>
                
                <Button 
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  onClick={() => handleNavigate(celebration.id)}
                >
                  <PartyPopper className="mr-2 h-4 w-4" />
                  Reservar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Celebrations;

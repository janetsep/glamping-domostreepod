import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/Section";
import { travelerTypesContent } from "@/data/content/travelerTypes";
import { useNavigate } from "react-router-dom";

const TravelerTypes = () => {
  const navigate = useNavigate();
  
  const handleTravelerTypeClick = (typeId: string) => {
    navigate(`/tipo-viajero/${typeId}`);
  };

  return (
    <Section
      id="traveler-types"
      title={travelerTypesContent.title}
      subtitle={travelerTypesContent.subtitle}
      centered
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {travelerTypesContent.travelerTypes.map((type) => (
          <div 
            key={type.id} 
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-64">
              <img 
                src={type.image} 
                alt={type.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <h3 className="text-white font-semibold text-xl p-4">
                  {type.name}
                </h3>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-gray-700 line-clamp-3">
                {type.description}
              </p>
              
              <div className="flex justify-end">
                <Button 
                  className="bg-gradient-to-r from-primary to-pink-500 text-white hover:from-primary/90 hover:to-pink-500/90"
                  onClick={() => handleTravelerTypeClick(type.id)}
                >
                  Ver detalles
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default TravelerTypes;

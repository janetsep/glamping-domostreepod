
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/Section";
import { celebrationsContent } from "@/data/content/celebrations";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Skeleton } from "@/components/ui/skeleton";

const Celebrations = () => {
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    // Navegamos a la página de detalle de celebración
    navigate(`/celebracion/${id}`);
  };

  return (
    <Section
      id="celebrations"
      title={celebrationsContent.title}
      subtitle={celebrationsContent.subtitle}
      centered
      className="pt-24 pb-12"
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
              <LazyLoadImage
                src={celebration.image}
                alt={celebration.name}
                effect="opacity"
                threshold={200}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
                placeholder={<Skeleton className="w-full h-full" />}
                wrapperClassName="w-full h-full"
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
              
              <div className="flex justify-center">
                <Button 
                  className="bg-gradient-to-r from-primary to-pink-500 text-white hover:from-primary/90 hover:to-pink-500/90"
                  onClick={() => handleNavigate(celebration.id)}
                >
                  <Info className="mr-2 h-4 w-4" />
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

export default Celebrations;

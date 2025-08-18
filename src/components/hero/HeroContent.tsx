import React, { RefObject } from "react";
import ScrollArrow from "../ScrollArrow";
import { Button } from "@/components/ui/button";
import { Star, ConciergeBell } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroContentProps {
  isLoaded: boolean;
  benefitsRef: RefObject<HTMLElement>;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  isLoaded,
  benefitsRef
}) => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 relative z-[2] h-full flex flex-col items-center justify-center pt-[76px]">
      <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Etiqueta simple */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
          <Star className="h-4 w-4 text-primary fill-current" />
          <span className="text-white text-sm font-medium">EXPERIENCIA PREMIUM</span>
          <Star className="h-4 w-4 text-primary fill-current" />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-shadow leading-tight">
          Glamping TreePod
          <span className="block text-3xl md:text-4xl lg:text-5xl text-primary mt-2">
            Valle Las Trancas
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 text-shadow max-w-3xl mx-auto leading-relaxed">
          Domos geodésicos de lujo en el corazón de la Cordillera de los Andes. 
          <span className="block mt-2 text-base md:text-lg text-primary">
            Tecnología Starlink • Confort Premium • Sostenibilidad
          </span>
        </p>
        
        {/* Rating */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="text-white/90 text-base font-medium">166+ Huéspedes Satisfechos</span>
        </div>
        
        {/* Botones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button 
            size="lg" 
            onClick={() => navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9')}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ConciergeBell className="h-5 w-5 mr-2" />
            Reservar Experiencia
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            onClick={() => benefitsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="border-white text-white hover:bg-white hover:text-primary px-6 py-3 text-base"
          >
            Descubrir Más
          </Button>
        </div>
        
        {/* Scroll indicator */}
        <div className="mt-6">
          <ScrollArrow targetRef={benefitsRef} />
        </div>
      </div>
    </div>
  );
};

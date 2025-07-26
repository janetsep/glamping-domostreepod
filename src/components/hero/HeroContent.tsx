import React, { RefObject } from "react";
import ScrollArrow from "../ScrollArrow";

interface HeroContentProps {
  isLoaded: boolean;
  benefitsRef: RefObject<HTMLElement>;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  isLoaded,
  benefitsRef
}) => {
  return (
    <div className="container mx-auto px-4 relative z-10 h-full flex flex-col items-center justify-center pt-[76px]">
      <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 text-shadow tracking-wide leading-tight">
          Glamping Sostenible en Chile
        </h1>
        <p className="text-base md:text-lg font-body text-white/90 mb-8 text-shadow max-w-xl mx-auto leading-relaxed">
          Domos geodésicos con wifi Starlink y vista al bosque en la Cordillera de los Andes.
        </p>
        
        {/* Widget Elfsight de reseñas - Reemplaza el botón */}
        <div className="mb-6 elfsight-app-58776635-7259-470b-9077-f838d052ebab" data-elfsight-app-lazy></div>
        
        {/* ScrollArrow positioned below the button */}
        <ScrollArrow targetRef={benefitsRef} />
      </div>
    </div>
  );
};

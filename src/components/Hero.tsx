import React from "react";
import { useHeroLogic } from "./hero/useHeroLogic";
import { ImageCarousel } from "./hero/ImageCarousel";
import { HeroContent } from "./hero/HeroContent";
import { CarouselIndicators } from "./hero/CarouselIndicators";

const Hero = () => {
  const {
    benefitsRef,
    heroRef,
    currentImageIndex,
    goToImage,
    isLoaded,
    images
  } = useHeroLogic();
  return (
    <section id="hero" ref={heroRef} className="h-screen relative overflow-hidden -mt-[76px]">
      {/* Background images carousel with overlay - Optimizado para lazy loading */}
      <ImageCarousel images={images} currentImageIndex={currentImageIndex} />
      
      {/* Hero content */}
      <HeroContent isLoaded={isLoaded} benefitsRef={benefitsRef} />
      
      {/* Carousel indicators */}
      <CarouselIndicators 
        images={images} 
        currentImageIndex={currentImageIndex} 
        onImageSelect={goToImage} 
      />
    </section>
  );
};
export default Hero;

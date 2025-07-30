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
      {/* Background images carousel */}
      <ImageCarousel images={images} currentImageIndex={currentImageIndex} />
      
      {/* Simple overlay */}
      <div className="absolute inset-0 bg-black/40 z-5"></div>
      
      {/* Hero content */}
      <HeroContent isLoaded={isLoaded} benefitsRef={benefitsRef} />
      
      {/* Carousel indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <CarouselIndicators 
          images={images} 
          currentImageIndex={currentImageIndex} 
          onImageSelect={goToImage} 
        />
      </div>
    </section>
  );
};
export default Hero;

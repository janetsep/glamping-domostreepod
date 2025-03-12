
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "./navigation/useNavigation";
import ScrollArrow from "./ScrollArrow";
import { ConciergeBell } from "lucide-react";

const Hero = () => {
  const {
    handleReserveClick
  } = useNavigation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const benefitsRef = useRef<HTMLElement>(null);
  const images = ["/lovable-uploads/65a640f0-862a-47e4-bc80-4d6cc1f2599b.png", "/lovable-uploads/ed56aab2-6ded-4bab-a2ab-2471f2fc6442.png", "/lovable-uploads/5bcb79d0-1a05-40e3-9088-2836fa262778.png", "/lovable-uploads/3f3be815-8b79-44fa-89b0-d3d4f795e9a7.png", "/lovable-uploads/fd23279d-7903-4b82-871d-b0ab29e6e890.png"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);

    // Set loaded after a short delay for animation
    setTimeout(() => setIsLoaded(true), 300);

    // Find the benefits section for the scroll arrow
    const benefitsElement = document.getElementById("benefits");
    if (benefitsElement && benefitsRef.current !== benefitsElement) {
      benefitsRef.current = benefitsElement as HTMLElement;
    }
    return () => clearInterval(interval);
  }, [images.length]);

  return <section id="hero" className="h-screen relative overflow-hidden -mt-[76px]">
      {/* Background images carousel with overlay */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => <div key={index} className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${currentImageIndex === index ? "opacity-100" : "opacity-0"}`}>
            <img src={image} alt={`Bosque y naturaleza ${index + 1}`} className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-in-out" />
          </div>)}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60 backdrop-blur-[1px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col items-center justify-center pt-[76px]">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 text-shadow tracking-wide leading-tight">Sumérgete en el lujo natural de Valle Las Trancas</h1>
          <p className="text-base md:text-lg font-body text-white/90 mb-8 text-shadow max-w-xl mx-auto leading-relaxed">Descubre un destino único donde la naturaleza, la comodidad y la historia se entrelazan</p>
          <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white text-base md:text-lg font-medium px-8 py-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden group" onClick={handleReserveClick}>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-cyan-300 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
            <ConciergeBell className="h-5 w-5 mr-2 relative z-10" />
            <span className="relative z-10">Reserva una Experiencia</span>
          </Button>
          
          {/* ScrollArrow positioned below the button */}
          <ScrollArrow targetRef={benefitsRef} />
        </div>
      </div>
      
      {/* Carousel indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {images.map((_, index) => <button key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index ? "bg-cyan-400 w-6" : "bg-white/50 hover:bg-white/80"}`} onClick={() => setCurrentImageIndex(index)} aria-label={`Ver imagen ${index + 1}`} />)}
      </div>
    </section>;
};

export default Hero;

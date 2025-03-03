
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "./navigation/useNavigation";

const Hero = () => {
  const { handleReserveClick } = useNavigation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    "/lovable-uploads/65a640f0-862a-47e4-bc80-4d6cc1f2599b.png",
    "/lovable-uploads/ed56aab2-6ded-4bab-a2ab-2471f2fc6442.png",
    "/lovable-uploads/5bcb79d0-1a05-40e3-9088-2836fa262778.png",
    "/lovable-uploads/3f3be815-8b79-44fa-89b0-d3d4f795e9a7.png",
    "/lovable-uploads/fd23279d-7903-4b82-871d-b0ab29e6e890.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambiar imagen cada 5 segundos
    
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="hero" className="h-screen relative overflow-hidden">
      {/* Carrusel de imágenes de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img 
              src={image} 
              alt={`Bosque y naturaleza ${index + 1}`}
              className="w-full h-full object-cover object-center scale-105"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
        <div className="max-w-3xl mx-auto text-center animate-fadeIn">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 text-shadow tracking-wide leading-tight">
            Un refugio entre las copas de los árboles
          </h1>
          <p className="text-base md:text-lg font-body text-white/90 mb-8 text-shadow max-w-xl mx-auto leading-relaxed">
            Donde la naturaleza y el lujo se encuentran
          </p>
          <Button 
            size="lg" 
            className="bg-cyan-500 hover:bg-cyan-600 text-white text-base md:text-lg font-medium px-8 py-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            onClick={handleReserveClick}
          >
            Reserva tu Experiencia
          </Button>
        </div>
      </div>
      
      {/* Indicadores del carrusel */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImageIndex === index ? "bg-white w-4" : "bg-white/50"
            }`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Ver imagen ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Indicador de scroll con forma de domo */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/90">
          <path d="M20 0C12.268 0 6 11.789 6 16C6 20.211 12.268 32 20 32C27.732 32 34 20.211 34 16C34 11.789 27.732 0 20 0Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 16H34" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 0V32" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13 8C13 8 20 10 27 8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13 24C13 24 20 22 27 24" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;

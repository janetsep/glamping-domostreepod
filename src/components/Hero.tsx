
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleReserveClick = () => {
    navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9');
  };

  return (
    <section id="hero" className="h-screen relative overflow-hidden">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/221f04ad-9f65-4671-866a-1844175adeb0.png" 
          alt="Domo geodésico entre árboles con cielo azul" 
          className="w-full h-full object-cover object-center scale-110 transition-transform duration-60000 ease-linear animate-subtle-zoom"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
        <div className="max-w-3xl mx-auto text-center animate-fadeIn">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 text-shadow tracking-wide">
            Un refugio entre las copas de los árboles
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 text-shadow max-w-xl mx-auto leading-relaxed">
            Donde la naturaleza y el lujo se encuentran
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-white text-lg font-semibold px-8 py-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            onClick={handleReserveClick}
          >
            Reserva tu Experiencia
          </Button>
        </div>
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

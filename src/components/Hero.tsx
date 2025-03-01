
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Usar una ID de unidad que exista en la base de datos
  const handleReserveClick = () => {
    navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Botón de reserva flotante que aparece al hacer scroll */}
      {isScrolled && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 shadow-lg"
            onClick={handleReserveClick}
          >
            ¡Reserva tu Experiencia Ahora!
          </Button>
        </div>
      )}

      <section className="h-screen relative">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/221f04ad-9f65-4671-866a-1844175adeb0.png" 
            alt="Domo geodésico entre árboles con cielo azul" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="max-w-3xl mx-auto text-center animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 text-shadow">
              Sumérgete en el lujo natural de Valle Las Trancas
            </h2>
            <p className="text-xl text-white/90 mb-8 text-shadow">
              Desconéctate del estrés y sumérgete en la naturaleza con lujo, privacidad y confort.
            </p>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-lg font-semibold px-8 py-6"
              onClick={handleReserveClick}
            >
              ¡Reserva tu Experiencia Ahora!
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;

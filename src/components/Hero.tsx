
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  // Usar una ID de unidad que exista en la base de datos
  const handleReserveClick = () => {
    navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9');
  };

  return (
    <section className="pt-24 pb-12 relative">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/abaa63a0-8f4a-4939-96f9-808ed3d09802.png" 
          alt="Domo geodésico entre árboles con cielo azul" 
          className="w-full h-full object-cover object-center object-[center_40%]"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fadeIn">
          <h2 className="text-5xl font-display font-bold text-white mb-6 text-shadow">
            Domos Treepod: Vive la naturaleza con todo el confort
          </h2>
          <p className="text-xl text-white/90 mb-8 text-shadow">
            Experimenta el lujo de la naturaleza en nuestro exclusivo glamping de domos geodésicos
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90"
            onClick={handleReserveClick}
          >
            Reserva tu estadía
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

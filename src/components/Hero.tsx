
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  // Usar una ID de unidad que exista en la base de datos
  const handleReserveClick = () => {
    navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9');
  };

  return (
    <section className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center animate-fadeIn">
          <h2 className="text-5xl font-display font-bold text-primary mb-6">
            Domos Treepod: Vive la naturaleza con todo el confort
          </h2>
          <p className="text-lg text-gray-600 mb-8">
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

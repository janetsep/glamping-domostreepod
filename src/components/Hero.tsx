
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate('/unit/1')}
          >
            Reserva tu estadía
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

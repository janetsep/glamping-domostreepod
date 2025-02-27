
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-3xl font-display font-bold mb-6">
          ¿Listo para vivir una experiencia única?
        </h3>
        <p className="text-lg mb-8 opacity-90">
          Reserva ahora y disfruta de una estadía inolvidable
        </p>
        <Button
          size="lg"
          className="bg-white text-primary hover:bg-white/90"
          onClick={() => navigate('/unit/1')}
        >
          Hacer una reserva
        </Button>
      </div>
    </section>
  );
};

export default CTASection;

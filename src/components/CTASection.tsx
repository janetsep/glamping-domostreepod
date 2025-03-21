
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ConciergeBell } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  // Usar una ID de unidad que exista en la base de datos
  const handleReserveClick = () => {
    navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9');
  };

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
          className="bg-white text-primary hover:bg-white/90 flex items-center gap-2"
          onClick={handleReserveClick}
        >
          <ConciergeBell className="h-5 w-5" />
          <span>Reservar</span>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;

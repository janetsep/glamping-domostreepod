
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  // Usar una ID de unidad que exista en la base de datos
  const handleReserveClick = () => {
    navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9');
  };

  return (
    <nav className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/21690294-058b-4ab7-9d01-fcf2bd94b8b3.png" 
            alt="Domos Treepod" 
            className="h-16 mr-2"
          />
        </div>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="hidden md:inline-flex"
          >
            Inicio
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/units")}
            className="hidden md:inline-flex"
          >
            Unidades
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/about")}
            className="hidden md:inline-flex"
          >
            Nosotros
          </Button>
          <Button
            variant={isMobile ? "ghost" : "default"}
            onClick={handleReserveClick}
          >
            Reservar
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

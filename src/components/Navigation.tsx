
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

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
            onClick={() => navigate("/unit/1")}
          >
            Reservar
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

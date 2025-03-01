
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/21690294-058b-4ab7-9d01-fcf2bd94b8b3.png" 
            alt="Domos Treepod" 
            className="h-16 mr-2 cursor-pointer"
            onClick={() => scrollToSection('hero')}
          />
        </div>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={() => scrollToSection('packages')}
            className="hidden md:inline-flex"
          >
            Domos
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection('benefits')}
            className="hidden md:inline-flex"
          >
            Galería
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection('testimonials')}
            className="hidden md:inline-flex"
          >
            Actividades
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection('benefits')}
            className="hidden md:inline-flex"
          >
            Servicios
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection('testimonials')}
            className="hidden md:inline-flex"
          >
            Experiencias
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection('location')}
            className="hidden md:inline-flex"
          >
            Ubicación
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

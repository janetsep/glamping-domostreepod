
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

        <div className="flex gap-4 items-center">
          {/* Chilean flag */}
          <div className="hidden md:block mr-2">
            <svg width="24" height="16" viewBox="0 0 512 336" xmlns="http://www.w3.org/2000/svg">
              <rect y="0" width="512" height="336" fill="#FFFFFF" />
              <rect y="168" width="512" height="168" fill="#D80027" />
              <rect y="0" width="170" height="168" fill="#0052B4" />
              <path d="M85,67.8l14.7,45.3h47.6l-38.5,28l14.7,45.3L85,158.4l-38.5,28l14.7-45.3l-38.5-28h47.6L85,67.8z" fill="#FFFFFF" />
            </svg>
          </div>
          
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


import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detectar scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReserveClick = () => {
    navigate('/unit/48a7a330-ebae-4e79-8f53-31a84ac900d9');
  };

  const scrollToSection = (id: string) => {
    // Si estamos en la página principal, desplazamos a la sección
    if (window.location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si estamos en otra página, primero navegamos a la principal y luego al ID
      navigate(`/#${id}`);
    }
    
    // Cerrar menú móvil si está abierto
    setMobileMenuOpen(false);
  };

  const navigateToPage = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`py-4 sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img 
              src="/lovable-uploads/21690294-058b-4ab7-9d01-fcf2bd94b8b3.png" 
              alt="Domos Treepod" 
              className={`h-14 transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'}`}
            />
          </Link>
        </div>

        {/* Menú móvil */}
        {isMobile && (
          <>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Panel desplegable */}
            <div className={`fixed inset-0 bg-white z-40 transition-transform duration-300 pt-20 ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <div className="container px-4 flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('hero')} 
                  className="py-3 border-b border-gray-100 text-left text-lg"
                >
                  Inicio
                </button>
                <button 
                  onClick={() => scrollToSection('packages')} 
                  className="py-3 border-b border-gray-100 text-left text-lg"
                >
                  Domos
                </button>
                <button 
                  onClick={() => scrollToSection('benefits')} 
                  className="py-3 border-b border-gray-100 text-left text-lg"
                >
                  Servicios
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="py-3 border-b border-gray-100 text-left text-lg"
                >
                  Experiencias
                </button>
                <button 
                  onClick={() => scrollToSection('location')} 
                  className="py-3 border-b border-gray-100 text-left text-lg"
                >
                  Ubicación
                </button>
                <button 
                  onClick={() => scrollToSection('blog')} 
                  className="py-3 border-b border-gray-100 text-left text-lg"
                >
                  Blog
                </button>
                <button 
                  onClick={() => navigateToPage('/sobre-nosotros')} 
                  className="py-3 border-b border-gray-100 text-left text-lg"
                >
                  Sobre Nosotros
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="py-3 border-b border-gray-100 text-left text-lg"
                >
                  Contacto
                </button>
                
                <Button
                  variant="default"
                  onClick={handleReserveClick}
                  className="mt-6 w-full py-6 text-lg"
                >
                  Reservar Ahora
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Menú escritorio */}
        <div className="hidden md:flex gap-2 items-center">
          {/* Chilean flag */}
          <div className="hidden lg:block mr-2">
            <svg width="24" height="16" viewBox="0 0 512 336" xmlns="http://www.w3.org/2000/svg">
              <rect y="0" width="512" height="336" fill="#FFFFFF" />
              <rect y="168" width="512" height="168" fill="#D80027" />
              <rect y="0" width="170" height="168" fill="#0052B4" />
              <path d="M85,67.8l14.7,45.3h47.6l-38.5,28l14.7,45.3L85,158.4l-38.5,28l14.7-45.3l-38.5-28h47.6L85,67.8z" fill="#FFFFFF" />
            </svg>
          </div>
          
          <Button
            variant={isScrolled ? "ghost" : "link"}
            onClick={() => scrollToSection('hero')}
            className={`text-base md:text-lg font-medium ${isScrolled ? 'text-gray-700' : 'text-white text-shadow'}`}
          >
            Inicio
          </Button>
          <Button
            variant={isScrolled ? "ghost" : "link"}
            onClick={() => scrollToSection('packages')}
            className={`text-base md:text-lg font-medium ${isScrolled ? 'text-gray-700' : 'text-white text-shadow'}`}
          >
            Domos
          </Button>
          <Button
            variant={isScrolled ? "ghost" : "link"}
            onClick={() => scrollToSection('benefits')}
            className={`text-base md:text-lg font-medium ${isScrolled ? 'text-gray-700' : 'text-white text-shadow'}`}
          >
            Servicios
          </Button>
          <Button
            variant={isScrolled ? "ghost" : "link"}
            onClick={() => scrollToSection('testimonials')}
            className={`text-base md:text-lg font-medium ${isScrolled ? 'text-gray-700' : 'text-white text-shadow'}`}
          >
            Experiencias
          </Button>
          <Button
            variant={isScrolled ? "ghost" : "link"}
            onClick={() => scrollToSection('location')}
            className={`text-base md:text-lg font-medium ${isScrolled ? 'text-gray-700' : 'text-white text-shadow'}`}
          >
            Ubicación
          </Button>
          <Button
            variant={isScrolled ? "ghost" : "link"}
            onClick={() => scrollToSection('blog')}
            className={`text-base md:text-lg font-medium ${isScrolled ? 'text-gray-700' : 'text-white text-shadow'}`}
          >
            Blog
          </Button>
          <Button
            variant={isScrolled ? "ghost" : "link"}
            onClick={() => navigateToPage('/sobre-nosotros')}
            className={`text-base md:text-lg font-medium ${isScrolled ? 'text-gray-700' : 'text-white text-shadow'}`}
          >
            Sobre Nosotros
          </Button>
          <Button
            variant={isScrolled ? "ghost" : "link"}
            onClick={() => scrollToSection('contact')}
            className={`text-base md:text-lg font-medium ${isScrolled ? 'text-gray-700' : 'text-white text-shadow'}`}
          >
            Contacto
          </Button>
          <Button
            variant={isScrolled ? "default" : "outline"}
            onClick={handleReserveClick}
            className={`text-base md:text-lg ${isScrolled ? "bg-primary" : "bg-transparent text-white border-white hover:bg-white/20 hover:text-white"}`}
          >
            Reservar
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

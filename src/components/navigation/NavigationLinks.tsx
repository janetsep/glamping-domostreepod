
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface NavigationLinksProps {
  isMobile: boolean;
  isScrolled: boolean;
  scrollToSection: (id: string) => void;
  navigateToPage: (path: string) => void;
}

export const NavigationLinks = ({
  isMobile,
  isScrolled,
  scrollToSection,
  navigateToPage
}: NavigationLinksProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/index";
  
  const links = [
    { name: "Inicio", path: "/" },
    { name: "Domos", id: "packages" },
    { name: "Servicios", id: "benefits" },
    { name: "Comentarios", id: "testimonials" },
    { name: "Ubicación", id: "location" },
    { name: "Blog", id: "blog" },
    { name: "Sobre Nosotros", path: "/sobre-nosotros" },
    { name: "Contacto", id: "contact" },
  ];

  const handleClick = (link: { name: string; id?: string; path?: string }) => {
    if (link.path) {
      // For static pages like "Sobre Nosotros", use navigateToPage
      navigateToPage(link.path);
    } else if (link.id) {
      if (isHomePage) {
        // If on home page, just scroll to section
        scrollToSection(link.id);
      } else {
        // If on another page, navigate to home with hash
        navigateToPage(`/#${link.id}`);
      }
    }
  };

  if (isMobile) {
    return (
      <>
        {links.map((link) => (
          <button 
            key={link.name}
            onClick={() => handleClick(link)}
            className="py-3 border-b border-gray-100 text-left text-lg"
          >
            {link.name}
          </button>
        ))}
      </>
    );
  }

  return (
    <>
      {links.map((link) => (
        <Button
          key={link.name}
          variant={isScrolled ? "ghost" : "link"}
          onClick={() => handleClick(link)}
          className={`text-base md:text-lg font-medium ${isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-white text-shadow'}`}
        >
          {link.name}
        </Button>
      ))}
    </>
  );
};

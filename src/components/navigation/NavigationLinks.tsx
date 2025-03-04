
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { Home, Package, ListChecks, MessageSquare, MapPin, BookOpen, Info, Mail } from "lucide-react";

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
    { name: "Inicio", path: "/", icon: Home },
    { name: "Domos", id: "packages", icon: Package },
    { name: "Servicios", id: "benefits", icon: ListChecks },
    { name: "Comentarios", id: "testimonials", icon: MessageSquare },
    { name: "Ubicación", id: "location", icon: MapPin },
    { name: "Blog", id: "blog", icon: BookOpen },
    { name: "Sobre Nosotros", path: "/sobre-nosotros", icon: Info },
    { name: "Contacto", id: "contact", icon: Mail },
  ];

  const handleClick = (link: { name: string; id?: string; path?: string }) => {
    if (link.path) {
      navigateToPage(link.path);
    } else if (link.id) {
      if (isHomePage) {
        scrollToSection(link.id);
      } else {
        navigateToPage(`/#${link.id}`);
      }
    }
  };

  if (isMobile) {
    return (
      <>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button 
              key={link.name}
              onClick={() => handleClick(link)}
              className="w-full py-4 border-b border-gray-100 text-left text-lg flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200 px-4"
            >
              <Icon className="h-5 w-5 text-cyan-500" />
              {link.name}
            </button>
          );
        })}
      </>
    );
  }

  return (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Button
            key={link.name}
            variant={isScrolled ? "ghost" : "link"}
            onClick={() => handleClick(link)}
            className={`text-base font-medium gap-2 ${
              isScrolled 
                ? 'text-gray-700 hover:text-cyan-500 hover:bg-gray-50/50' 
                : 'text-white text-shadow hover:text-white/90'
            }`}
          >
            <Icon className={`h-4 w-4 ${isScrolled ? 'text-cyan-500' : 'text-white'}`} />
            {link.name}
          </Button>
        );
      })}
    </>
  );
};


import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { 
  Home, 
  Moon, 
  Sun, 
  MessageSquare, 
  MapPin, 
  Leaf, 
  Trees, 
  Mail,
  Coffee,
  Mountain,
  BedDouble
} from "lucide-react";
import { packageData } from "../packages/packageData";

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
  
  // Use actual Glamping unit names from packageData
  const domoNames = packageData.map(pkg => pkg.title).join(', ');
  
  const links = [
    { name: "Inicio", path: "/", icon: Home },
    { name: "Domos", id: "packages", icon: BedDouble, description: domoNames },
    { name: "Servicios", id: "benefits", icon: Coffee, description: "Incluye desayuno, WiFi y más" },
    { name: "Comentarios", id: "testimonials", icon: MessageSquare },
    { name: "Ubicación", id: "location", icon: MapPin, description: "Sur de Chile" },
    { name: "Blog", id: "blog", icon: Leaf },
    { name: "Sobre Nosotros", path: "/sobre-nosotros", icon: Trees },
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
      <div className="flex flex-col space-y-2">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <button 
              key={link.name}
              onClick={() => handleClick(link)}
              className="group w-full py-4 text-left text-lg flex items-center gap-3 hover:translate-x-1 transition-all duration-300 px-4"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 text-cyan-500 group-hover:from-cyan-500 group-hover:to-cyan-400 group-hover:text-white transition-all duration-300">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display tracking-wide group-hover:text-cyan-500 transition-colors duration-300">
                  {link.name}
                </span>
                {link.description && (
                  <span className="text-xs text-gray-500 mt-0.5 group-hover:text-cyan-400 transition-colors duration-300">
                    {link.description}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-1 items-center">
      {links.map((link) => {
        const Icon = link.icon;
        
        // Create an active state for better UX
        const isActive = (link.path && location.pathname === link.path) || 
                        (link.id && isHomePage && location.hash === `#${link.id}`);
        
        return (
          <Button
            key={link.name}
            variant={isScrolled ? "ghost" : "link"}
            onClick={() => handleClick(link)}
            className={`relative overflow-hidden text-base font-medium px-3 py-2 gap-2 group ${
              isScrolled 
                ? 'text-gray-700 hover:text-cyan-500 hover:bg-cyan-50/50' 
                : 'text-white text-shadow hover:text-white/90'
            } ${isActive ? (isScrolled ? 'bg-cyan-50 text-cyan-500' : 'bg-white/10') : ''}`}
          >
            <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ease-out ${
              isActive 
                ? 'scale-x-100 bg-cyan-500' 
                : 'scale-x-0 group-hover:scale-x-100 bg-cyan-500'
            }`} />
            
            <Icon className={`h-4 w-4 transition-all duration-300 ${
              isScrolled 
                ? isActive ? 'text-cyan-500' : 'text-cyan-400 group-hover:text-cyan-500' 
                : 'text-white group-hover:text-white'
            }`} />
            
            <span className="relative">
              {link.name}
            </span>
          </Button>
        );
      })}
    </div>
  );
};

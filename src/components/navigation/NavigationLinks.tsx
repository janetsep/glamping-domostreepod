import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { 
  Home, 
  Tent,
  MapPin, 
  ChefHat,
  Mail,
  Sparkles,
  Mountain,
  Dumbbell
} from "lucide-react";
import { packageData } from "../packages/packageData";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface NavigationLinksProps {
  isMobile: boolean;
  isScrolled: boolean;
  scrollToSection: (id: string) => void;
  navigateToPage: (path: string) => void;
}

export interface NavLink {
  name: string;
  path: string | null;
  icon: any;
  id: string | null;
  description?: string;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  name: string;
  id: string | null;
  path: string | null;
  icon: any;
}

// Navigation links with icons
export const navigationLinks: NavLink[] = [
  { name: "Inicio", path: "/", icon: Home, id: null },
  { name: "Domos", id: "packages", icon: Tent, path: null, description: "Nuestras opciones de alojamiento" },
  { 
    name: "Experiencias", 
    id: "benefits", 
    icon: Sparkles, 
    path: null, 
    description: "Descubre lo que ofrecemos",
    submenu: [
      { name: "Wellness y relajación", id: "benefits", path: null, icon: Dumbbell },
      { name: "Aventura y trekking", id: "benefits", path: null, icon: Mountain },
      { name: "Gastronomía local", id: "benefits", path: null, icon: ChefHat }
    ]
  },
  { name: "Cómo llegar", id: "location", icon: MapPin, path: null, description: "Sur de Chile" },
  { name: "Contacto", id: "contact", icon: Mail, path: null }
];

export const NavigationLinks = ({
  isMobile,
  isScrolled,
  scrollToSection,
  navigateToPage
}: NavigationLinksProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/index";
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  
  // Use actual Glamping unit names from packageData
  const domoNames = packageData.map(pkg => pkg.title).join(', ');
  
  const handleClick = (link: NavLink, index: number) => {
    // If link has submenu, toggle it
    if (link.submenu && link.submenu.length > 0) {
      setOpenSubmenu(openSubmenu === index ? null : index);
      return;
    }
    
    if (link.path) {
      navigateToPage(link.path);
      setOpenSubmenu(null);
    } else if (link.id) {
      if (isHomePage) {
        scrollToSection(link.id);
        setOpenSubmenu(null);
      } else {
        navigateToPage(`/#${link.id}`);
        setOpenSubmenu(null);
      }
    }
  };

  const handleSubmenuClick = (submenuItem: SubMenuItem) => {
    if (submenuItem.path) {
      navigateToPage(submenuItem.path);
      setOpenSubmenu(null);
    } else if (submenuItem.id) {
      if (isHomePage) {
        scrollToSection(submenuItem.id);
        setOpenSubmenu(null);
      } else {
        navigateToPage(`/#${submenuItem.id}`);
        setOpenSubmenu(null);
      }
    }
  };

  // Mobile navigation
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2">
        {navigationLinks.map((link, index) => {
          const Icon = link.icon;
          const hasSubmenu = link.submenu && link.submenu.length > 0;
          const isOpen = openSubmenu === index;
          
          return (
            <div key={link.name} className="space-y-1">
              <button 
                onClick={() => handleClick(link, index)}
                className="group w-full py-4 text-left text-lg flex items-center gap-3 hover:translate-x-1 transition-all duration-300 px-4"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 text-cyan-500 group-hover:from-cyan-500 group-hover:to-cyan-400 group-hover:text-white transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col flex-grow">
                  <span className="font-display tracking-wide group-hover:text-cyan-500 transition-colors duration-300">
                    {link.name}
                  </span>
                  {link.description && (
                    <span className="text-xs text-gray-500 mt-0.5 group-hover:text-cyan-400 transition-colors duration-300">
                      {link.description}
                    </span>
                  )}
                </div>
                {hasSubmenu && (
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                )}
              </button>
              
              {/* Submenu for mobile */}
              {hasSubmenu && isOpen && (
                <div className="ml-14 space-y-1 mt-1 mb-2">
                  {link.submenu!.map((submenuItem) => {
                    const SubIcon = submenuItem.icon;
                    return (
                      <button
                        key={submenuItem.name}
                        onClick={() => handleSubmenuClick(submenuItem)}
                        className="group flex items-center gap-3 w-full py-3 px-4 text-left text-base hover:translate-x-1 transition-all duration-300"
                      >
                        <SubIcon className="h-4 w-4 text-cyan-400" />
                        <span className="text-gray-700 group-hover:text-cyan-500 transition-colors duration-300">
                          {submenuItem.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop navigation
  return (
    <div className="flex gap-1 items-center">
      {navigationLinks.map((link, index) => {
        const Icon = link.icon;
        const hasSubmenu = link.submenu && link.submenu.length > 0;
        const isOpen = openSubmenu === index;
        
        // Create an active state for better UX
        const isActive = (link.path && location.pathname === link.path) || 
                        (link.id && isHomePage && location.hash === `#${link.id}`);
        
        return (
          <div key={link.name} className="relative">
            <Button
              variant={isScrolled ? "ghost" : "link"}
              onClick={() => handleClick(link, index)}
              className={`relative overflow-hidden text-base font-medium px-3 py-2 gap-2 group ${
                isScrolled 
                  ? 'text-gray-700 hover:text-cyan-500 hover:bg-cyan-50/50' 
                  : 'text-white text-shadow hover:text-white'
              } ${isActive ? (isScrolled ? 'bg-cyan-50 text-cyan-500' : 'bg-white/20') : ''}`}
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
              
              {hasSubmenu && (
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              )}
            </Button>
            
            {/* Submenu dropdown for desktop */}
            {hasSubmenu && isOpen && (
              <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  {link.submenu!.map((submenuItem) => {
                    const SubIcon = submenuItem.icon;
                    return (
                      <button
                        key={submenuItem.name}
                        onClick={() => handleSubmenuClick(submenuItem)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-500 flex items-center gap-2"
                      >
                        <SubIcon className="h-4 w-4" />
                        {submenuItem.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

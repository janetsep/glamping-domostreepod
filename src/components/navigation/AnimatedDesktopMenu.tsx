
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Sun } from "lucide-react";
import { 
  Home, 
  Coffee, 
  MessageSquare, 
  MapPin, 
  Leaf, 
  Mail,
  BedDouble
} from "lucide-react";
import { packageData } from "../packages/packageData";

interface AnimatedDesktopMenuProps {
  isScrolled: boolean;
  handleReserveClick: () => void;
  scrollToSection: (id: string) => void;
  navigateToPage: (path: string) => void;
}

const AnimatedDesktopMenu = ({
  isScrolled,
  handleReserveClick,
  scrollToSection,
  navigateToPage
}: AnimatedDesktopMenuProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/index";
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Navigation links with icons
  const navigationLinks = [
    { name: "Inicio", path: "/", icon: Home, id: null },
    { name: "Domos", id: "packages", icon: BedDouble, path: null },
    { name: "Servicios", id: "benefits", icon: Coffee, path: null },
    { name: "Comentarios", id: "testimonials", icon: MessageSquare, path: null },
    { name: "Ubicación", id: "location", icon: MapPin, path: null },
    { name: "Blog", id: "blog", icon: Leaf, path: null },
    { name: "Contacto", id: "contact", icon: Mail, path: null },
  ];

  // Animation states
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Determine active tab based on location
  useEffect(() => {
    let foundActiveIndex = 0;
    
    if (location.pathname !== "/" && location.pathname !== "/index") {
      // Find the matching route path
      const pathMatch = navigationLinks.findIndex(link => link.path === location.pathname);
      if (pathMatch !== -1) {
        foundActiveIndex = pathMatch;
      }
    } else if (location.hash) {
      // If we're on homepage and have a hash, find the matching id
      const hashId = location.hash.substring(1);
      const hashMatch = navigationLinks.findIndex(link => link.id === hashId);
      if (hashMatch !== -1) {
        foundActiveIndex = hashMatch;
      }
    }
    
    setActiveIndex(foundActiveIndex);
  }, [location.pathname, location.hash]);

  // Handle hover animation
  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  // Handle active tab animation
  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  // Set initial active tab position
  useEffect(() => {
    requestAnimationFrame(() => {
      const initialElement = tabRefs.current[activeIndex];
      if (initialElement) {
        const { offsetLeft, offsetWidth } = initialElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Handle navigation
  const handleNavClick = (index: number) => {
    setActiveIndex(index);
    const link = navigationLinks[index];
    
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

  return (
    <div className="hidden md:flex gap-3 items-center">
      {/* Chilean flag with subtle animation */}
      <div className="hidden lg:block mr-2 hover:animate-pulse transition-all duration-300">
        <svg width="24" height="16" viewBox="0 0 512 336" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
          <rect y="0" width="512" height="336" fill="#FFFFFF" />
          <rect y="168" width="512" height="168" fill="#D80027" />
          <rect y="0" width="170" height="168" fill="#0052B4" />
          <path d="M85,67.8l14.7,45.3h47.6l-38.5,28l14.7,45.3L85,158.4l-38.5,28l14.7-45.3l-38.5-28h47.6L85,67.8z" fill="#FFFFFF" />
        </svg>
      </div>
      
      {/* Animated Tab Navigation */}
      <div className="relative">
        {/* Hover Highlight */}
        <div
          className={`absolute h-[34px] transition-all duration-300 ease-out rounded-[6px] flex items-center ${
            isScrolled 
              ? 'bg-[#0e0f1114] dark:bg-[#ffffff1a]' 
              : 'bg-white/10 dark:bg-[#ffffff1a]'
          }`}
          style={{
            ...hoverStyle,
            opacity: hoveredIndex !== null ? 1 : 0,
          }}
        />

        {/* Active Indicator */}
        <div
          className={`absolute bottom-[-6px] h-[2px] transition-all duration-300 ease-out ${
            isScrolled 
              ? 'bg-cyan-500 dark:bg-cyan-400' 
              : 'bg-white dark:bg-cyan-400'
          }`}
          style={activeStyle}
        />

        {/* Tabs */}
        <div className="relative flex space-x-[3px] items-center">
          {navigationLinks.map((link, index) => {
            const Icon = link.icon;
            const isActive = index === activeIndex;
            
            return (
              <div
                key={link.name}
                ref={(el) => (tabRefs.current[index] = el)}
                className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[34px] ${
                  isActive 
                    ? isScrolled 
                      ? 'text-cyan-500 dark:text-cyan-400' 
                      : 'text-white dark:text-white' 
                    : isScrolled 
                      ? 'text-gray-600 dark:text-gray-400'
                      : 'text-white/80 dark:text-gray-300'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleNavClick(index)}
              >
                <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full gap-2">
                  <Icon className="h-4 w-4" />
                  {link.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Theme Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleDarkMode}
        className={`ml-2 ${
          isScrolled 
            ? 'text-gray-700 hover:text-cyan-500 hover:bg-cyan-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50' 
            : 'text-white hover:bg-white/10 dark:text-gray-300 dark:hover:bg-gray-800/50'
        }`}
      >
        {isDarkMode ? 
          <Sun className="h-[1.2rem] w-[1.2rem]" /> : 
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        }
      </Button>
      
      {/* Reserve Button */}
      <Button
        variant={isScrolled ? "default" : "outline"}
        onClick={handleReserveClick}
        className={`text-base font-medium relative overflow-hidden group transition-all duration-300 ${
          isScrolled 
            ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white dark:from-cyan-600 dark:to-cyan-500 dark:hover:from-cyan-500 dark:hover:to-cyan-400' 
            : 'bg-transparent text-white border-white hover:bg-white/20 hover:text-white dark:border-gray-600 dark:text-gray-300 dark:hover:border-cyan-500'
        }`}
      >
        <span className="relative z-10 flex items-center gap-1">
          <Sparkles className="h-4 w-4" />
          <span>Reservar</span>
          <span className="opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs transition-all duration-500 overflow-hidden whitespace-nowrap">
            Ahora
          </span>
        </span>
        <span className={`absolute inset-0 w-full h-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
          isScrolled ? "bg-cyan-600 dark:bg-cyan-400" : "bg-white/30 dark:bg-cyan-500/30"
        }`}></span>
      </Button>
    </div>
  );
};

export default AnimatedDesktopMenu;

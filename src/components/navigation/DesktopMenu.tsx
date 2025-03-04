
import { Button } from "@/components/ui/button";
import { NavigationLinks } from "./NavigationLinks";
import { Sparkles } from "lucide-react";

interface DesktopMenuProps {
  isScrolled: boolean;
  handleReserveClick: () => void;
  scrollToSection: (id: string) => void;
  navigateToPage: (path: string) => void;
}

const DesktopMenu = ({ 
  isScrolled, 
  handleReserveClick, 
  scrollToSection, 
  navigateToPage 
}: DesktopMenuProps) => {
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
      
      <NavigationLinks 
        isMobile={false} 
        isScrolled={isScrolled} 
        scrollToSection={scrollToSection}
        navigateToPage={navigateToPage}
      />
      
      <Button
        variant={isScrolled ? "default" : "outline"}
        onClick={handleReserveClick}
        className={`text-base font-medium relative overflow-hidden group transition-all duration-300 ${
          isScrolled 
            ? "bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white" 
            : "bg-transparent text-white border-white hover:bg-white/20 hover:text-white"
        }`}
      >
        <span className="relative z-10 flex items-center gap-1">
          <span>Reservar</span>
          <span className="opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs transition-all duration-500 overflow-hidden whitespace-nowrap">
            Ahora
          </span>
        </span>
        <span className={`absolute inset-0 w-full h-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
          isScrolled ? "bg-cyan-600" : "bg-white/30"
        }`}></span>
      </Button>
    </div>
  );
};

export default DesktopMenu;

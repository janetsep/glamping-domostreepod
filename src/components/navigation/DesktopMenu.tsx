
import { Button } from "@/components/ui/button";
import { NavigationLinks } from "./NavigationLinks";

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
      
      <NavigationLinks 
        isMobile={false} 
        isScrolled={isScrolled} 
        scrollToSection={scrollToSection}
        navigateToPage={navigateToPage}
      />
      
      <Button
        variant={isScrolled ? "default" : "outline"}
        onClick={handleReserveClick}
        className={`text-base md:text-lg ${isScrolled ? "bg-cyan-500 hover:bg-cyan-600 text-white" : "bg-transparent text-white border-white hover:bg-white/20 hover:text-white"}`}
      >
        Reservar
      </Button>
    </div>
  );
};

export default DesktopMenu;

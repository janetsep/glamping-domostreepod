import { NavigationLinks } from "./NavigationLinks";
import ReserveButton from "./ReserveButton";
import AnimatedTabIndicator from "./AnimatedTabIndicator";
import { MessageSquare } from "lucide-react";

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
  navigateToPage,
}: AnimatedDesktopMenuProps) => {
  return (
    <div className="flex items-center gap-2">
      <NavigationLinks
        isMobile={false}
        isScrolled={isScrolled}
        scrollToSection={scrollToSection}
        navigateToPage={navigateToPage}
      />
      
      {/* WhatsApp Contact Button */}
      <a 
        href="https://wa.me/56912345678" 
        target="_blank" 
        rel="noopener noreferrer"
        className="ml-4 mr-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <MessageSquare className="h-4 w-4" />
      </a>
      
      <ReserveButton
        isScrolled={isScrolled}
        handleReserveClick={handleReserveClick}
      />
      
      <AnimatedTabIndicator 
        isScrolled={isScrolled} 
        hoveredIndex={null}
      />
    </div>
  );
};

export default AnimatedDesktopMenu;

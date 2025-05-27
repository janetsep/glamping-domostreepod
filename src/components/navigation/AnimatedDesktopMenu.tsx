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
    <div className="flex items-center">
      <NavigationLinks
        isMobile={false}
        isScrolled={isScrolled}
        scrollToSection={scrollToSection}
        navigateToPage={navigateToPage}
      />
      <a 
        href="https://wa.me/56912345678" 
        target="_blank" 
        rel="noopener noreferrer"
        className="ml-4 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <MessageSquare className="h-5 w-5" />
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

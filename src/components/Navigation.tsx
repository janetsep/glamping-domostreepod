
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { useScrollDetection } from "./navigation/useScrollDetection";
import { useNavigation } from "./navigation/useNavigation";
import Logo from "./navigation/Logo";
import MobileMenu from "./navigation/MobileMenu";
import DesktopMenu from "./navigation/DesktopMenu";

const Navigation = () => {
  const isMobile = useMobile();
  const isScrolled = useScrollDetection();
  const { handleReserveClick, scrollToSection, navigateToPage } = useNavigation();

  return (
    <nav className={`py-4 sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Logo isScrolled={isScrolled} />

        {isMobile ? (
          <MobileMenu 
            isScrolled={isScrolled} 
            handleReserveClick={handleReserveClick} 
            scrollToSection={scrollToSection} 
            navigateToPage={navigateToPage} 
          />
        ) : (
          <DesktopMenu 
            isScrolled={isScrolled} 
            handleReserveClick={handleReserveClick} 
            scrollToSection={scrollToSection} 
            navigateToPage={navigateToPage} 
          />
        )}
      </div>
    </nav>
  );
};

export default Navigation;

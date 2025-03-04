
import { useMobile } from "@/hooks/use-mobile";
import { useScrollDetection } from "./navigation/useScrollDetection";
import { useNavigation } from "./navigation/useNavigation";
import Logo from "./navigation/Logo";
import MobileMenu from "./navigation/MobileMenu";
import AnimatedDesktopMenu from "./navigation/AnimatedDesktopMenu";

const Navigation = () => {
  const isMobile = useMobile();
  const isScrolled = useScrollDetection();
  const { handleReserveClick, scrollToSection, navigateToPage } = useNavigation();

  return (
    <nav className={`py-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm dark:bg-[#0e0f11]/95' : 'bg-black/40 backdrop-blur-[2px]'
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
          <AnimatedDesktopMenu 
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

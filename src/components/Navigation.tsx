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
    <>
      <nav className={`py-3 md:py-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-surface/95 backdrop-blur-lg border-b border-border shadow-lg' 
          : 'bg-surface/80 backdrop-blur-md'
      }`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
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
    </>
  );
};

export default Navigation;

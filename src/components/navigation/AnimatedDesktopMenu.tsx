
import { useRef } from "react";
import ChileanFlag from "./ChileanFlag";
import AnimatedTabIndicator from "./AnimatedTabIndicator";
import NavTabs from "./NavTabs";
import ThemeToggle from "./ThemeToggle";
import ReserveButton from "./ReserveButton";
import { useMenuAnimation } from "./useMenuAnimation";
import { navigationLinks } from "./NavigationLinks";

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
  const {
    isHomePage,
    activeIndex,
    setActiveIndex,
    hoveredIndex,
    setHoveredIndex,
    hoverStyle,
    activeStyle
  } = useMenuAnimation(navigationLinks);

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
      {/* Chilean flag */}
      <ChileanFlag />
      
      {/* Animated Tab Navigation */}
      <div className="relative">
        {/* Animated Indicators */}
        <AnimatedTabIndicator
          isScrolled={isScrolled}
          activeStyle={activeStyle}
          hoverStyle={hoverStyle}
          hoveredIndex={hoveredIndex}
        />

        {/* Tabs */}
        <NavTabs
          navigationLinks={navigationLinks}
          isScrolled={isScrolled}
          activeIndex={activeIndex}
          setHoveredIndex={setHoveredIndex}
          handleNavClick={handleNavClick}
        />
      </div>
      
      {/* Theme Toggle */}
      <ThemeToggle isScrolled={isScrolled} />
      
      {/* Reserve Button */}
      <ReserveButton isScrolled={isScrolled} handleReserveClick={handleReserveClick} />
    </div>
  );
};

export default AnimatedDesktopMenu;


import { NavigationLinks } from "./NavigationLinks";
import { ReserveButton } from "./ReserveButton";
import { AnimatedTabIndicator } from "./AnimatedTabIndicator";

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
      <ReserveButton
        isScrolled={isScrolled}
        handleReserveClick={handleReserveClick}
      />
      <AnimatedTabIndicator />
    </div>
  );
};

export default AnimatedDesktopMenu;

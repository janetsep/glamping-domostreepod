
import { useLocation } from "react-router-dom";
import DesktopNavLinks from "./DesktopNavLinks";
import MobileNavLinks from "./MobileNavLinks";
import { packageData } from "../packages/packageData";

interface NavigationLinksProps {
  isMobile: boolean;
  isScrolled: boolean;
  scrollToSection: (id: string) => void;
  navigateToPage: (path: string) => void;
}

export const NavigationLinks = ({
  isMobile,
  isScrolled,
  scrollToSection,
  navigateToPage
}: NavigationLinksProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/index";
  
  // Mobile navigation
  if (isMobile) {
    return <MobileNavLinks scrollToSection={scrollToSection} navigateToPage={navigateToPage} isHomePage={isHomePage} />;
  }

  // Desktop navigation
  return <DesktopNavLinks isScrolled={isScrolled} scrollToSection={scrollToSection} navigateToPage={navigateToPage} />;
};

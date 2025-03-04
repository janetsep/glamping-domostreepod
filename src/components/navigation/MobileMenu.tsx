
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationLinks } from "./NavigationLinks";

interface MobileMenuProps {
  isScrolled: boolean;
  handleReserveClick: () => void;
  scrollToSection: (id: string) => void;
  navigateToPage: (path: string) => void;
}

const MobileMenu = ({ 
  isScrolled, 
  handleReserveClick, 
  scrollToSection, 
  navigateToPage 
}: MobileMenuProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const onScrollToSection = (id: string) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };
  
  const onNavigateToPage = (path: string) => {
    navigateToPage(path);
    setMobileMenuOpen(false);
  };

  const onReserveClick = () => {
    handleReserveClick();
    setMobileMenuOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`p-2 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>
      
      <div 
        className={`fixed inset-0 bg-white/95 backdrop-blur-sm z-40 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="container px-4 flex flex-col pt-20">
          <NavigationLinks 
            isMobile={true} 
            isScrolled={isScrolled} 
            scrollToSection={onScrollToSection}
            navigateToPage={onNavigateToPage}
          />
          
          <Button
            variant="default"
            onClick={onReserveClick}
            className="mt-8 py-6 text-lg bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            Reservar Ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

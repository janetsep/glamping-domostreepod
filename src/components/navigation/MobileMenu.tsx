
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
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
        className="p-2 text-gray-700"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Panel desplegable */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform duration-300 pt-20 ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="container px-4 flex flex-col space-y-4">
          <NavigationLinks 
            isMobile={true} 
            isScrolled={isScrolled} 
            scrollToSection={onScrollToSection}
            navigateToPage={onNavigateToPage}
          />
          
          <Button
            variant="default"
            onClick={onReserveClick}
            className="mt-6 w-full py-6 text-lg bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            Reservar Ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

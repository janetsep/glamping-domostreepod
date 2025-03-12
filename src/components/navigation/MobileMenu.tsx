
import { useState, useEffect, useRef } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);
  
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

  // Handle clicks outside menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`p-2 rounded-full ${isScrolled ? 'text-cyan-500 hover:bg-cyan-50' : 'text-white hover:bg-white/10'}`}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>
      
      <div 
        className={`fixed inset-0 bg-gradient-to-br from-white/95 to-cyan-50/95 backdrop-blur-md z-40 transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div ref={menuRef} className="container px-4 flex flex-col pt-20">
          <div className="overflow-hidden">
            <div className={`transition-all duration-500 transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
              <NavigationLinks 
                isMobile={true} 
                isScrolled={isScrolled} 
                scrollToSection={onScrollToSection}
                navigateToPage={onNavigateToPage}
              />
            </div>
          </div>
          
          <div className={`mt-8 transition-all duration-500 delay-200 transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Button
              variant="default"
              onClick={onReserveClick}
              className="w-full py-6 text-lg bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Reservar Ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

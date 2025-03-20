
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { NavLink, SubMenuItem, navigationLinks } from "./navigationData";

interface DesktopNavLinksProps {
  isScrolled: boolean;
  scrollToSection: (id: string) => void;
  navigateToPage: (path: string) => void;
}

const DesktopNavLinks = ({
  isScrolled,
  scrollToSection,
  navigateToPage
}: DesktopNavLinksProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/index";
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const handleClick = (link: NavLink, index: number) => {
    // If link has submenu, toggle it
    if (link.submenu && link.submenu.length > 0) {
      setOpenSubmenu(openSubmenu === index ? null : index);
      return;
    }
    
    if (link.path) {
      navigateToPage(link.path);
      setOpenSubmenu(null);
    } else if (link.id) {
      if (isHomePage) {
        scrollToSection(link.id);
        setOpenSubmenu(null);
      } else {
        navigateToPage(`/#${link.id}`);
        setOpenSubmenu(null);
      }
    }
  };

  const handleSubmenuClick = (submenuItem: SubMenuItem, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the parent menu from closing
    
    if (submenuItem.path) {
      navigateToPage(submenuItem.path);
    } else if (submenuItem.id) {
      if (isHomePage) {
        // If the submenu has a specific tab to navigate to
        if (submenuItem.tabId) {
          // Navigate to the section first
          scrollToSection(`${submenuItem.id}`);
          // Set the hash in the URL for the specific tab
          window.location.hash = `${submenuItem.id}-${submenuItem.tabId}`;
        } else {
          scrollToSection(submenuItem.id);
        }
      } else {
        // If not on homepage, navigate with appropriate hash
        if (submenuItem.tabId) {
          navigateToPage(`/#${submenuItem.id}-${submenuItem.tabId}`);
        } else {
          navigateToPage(`/#${submenuItem.id}`);
        }
      }
    }
    
    // Close the submenu after clicking
    setOpenSubmenu(null);
  };

  return (
    <div className="flex gap-4 items-center">
      {navigationLinks.map((link, index) => {
        const Icon = link.icon;
        const hasSubmenu = link.submenu && link.submenu.length > 0;
        const isOpen = openSubmenu === index;
        
        // Create an active state for better UX
        const isActive = (link.path && location.pathname === link.path) || 
                        (link.id && isHomePage && location.hash === `#${link.id}`);
        
        return (
          <div key={link.name} className="relative">
            <Button
              variant="ghost"
              onClick={() => handleClick(link, index)}
              className={`relative overflow-hidden text-base font-medium gap-1 group ${
                isScrolled 
                  ? 'text-gray-700 hover:text-cyan-500' 
                  : 'text-gray-700 hover:text-cyan-500'
              } ${isActive ? (isScrolled ? 'text-cyan-500' : 'text-cyan-500') : ''}`}
            >
              <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ease-out ${
                isActive 
                  ? 'scale-x-100 bg-cyan-500' 
                  : 'scale-x-0 group-hover:scale-x-100 bg-cyan-500'
              }`} />
              
              <Icon className={`h-4 w-4 transition-all duration-300 ${
                isActive ? 'text-cyan-500' : 'text-cyan-400'
              }`} />
              
              <span className="relative">
                {link.name}
              </span>
              
              {hasSubmenu && (
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              )}
            </Button>
            
            {/* Submenu dropdown for desktop */}
            {hasSubmenu && isOpen && (
              <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  {link.submenu!.map((submenuItem) => {
                    const SubIcon = submenuItem.icon;
                    return (
                      <button
                        key={submenuItem.name}
                        onClick={(e) => handleSubmenuClick(submenuItem, e)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-500 flex items-center gap-2"
                      >
                        <SubIcon className="h-4 w-4" />
                        {submenuItem.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DesktopNavLinks;

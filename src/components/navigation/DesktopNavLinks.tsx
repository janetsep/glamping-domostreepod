
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
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
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<string | null>(null);

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
    e.stopPropagation();
    
    // If submenu item has nested submenu, toggle it
    if (submenuItem.submenu && submenuItem.submenu.length > 0) {
      setOpenNestedSubmenu(openNestedSubmenu === submenuItem.name ? null : submenuItem.name);
      return;
    }
    
    if (submenuItem.path) {
      navigateToPage(submenuItem.path);
    } else if (submenuItem.id) {
      if (isHomePage) {
        if (submenuItem.tabId) {
          scrollToSection(`${submenuItem.id}`);
          window.location.hash = `${submenuItem.id}-${submenuItem.tabId}`;
        } else {
          scrollToSection(submenuItem.id);
        }
      } else {
        if (submenuItem.tabId) {
          navigateToPage(`/#${submenuItem.id}-${submenuItem.tabId}`);
        } else {
          navigateToPage(`/#${submenuItem.id}`);
        }
      }
    }
    
    setOpenSubmenu(null);
    setOpenNestedSubmenu(null);
  };

  const handleNestedSubmenuClick = (nestedItem: SubMenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (nestedItem.path) {
      navigateToPage(nestedItem.path);
    } else if (nestedItem.id) {
      if (isHomePage) {
        if (nestedItem.tabId) {
          scrollToSection(`${nestedItem.id}`);
          window.location.hash = `${nestedItem.id}-${nestedItem.tabId}`;
        } else {
          scrollToSection(nestedItem.id);
        }
      } else {
        if (nestedItem.tabId) {
          navigateToPage(`/#${nestedItem.id}-${nestedItem.tabId}`);
        } else {
          navigateToPage(`/#${nestedItem.id}`);
        }
      }
    }
    
    setOpenSubmenu(null);
    setOpenNestedSubmenu(null);
  };

  return (
    <div className="flex gap-4 items-center">
      {navigationLinks.map((link, index) => {
        const Icon = link.icon;
        const hasSubmenu = link.submenu && link.submenu.length > 0;
        const isOpen = openSubmenu === index;
        
        const isActive = (link.path && location.pathname === link.path) || 
                        (link.id && isHomePage && location.hash === `#${link.id}`);
        
        return (
          <div key={link.name} className="relative">
            <Button
              variant="ghost"
              onClick={() => handleClick(link, index)}
              className={`relative text-base font-medium gap-1 group transition-all duration-300 
                ${isScrolled ? 'text-gray-700' : 'text-gray-700'}
                ${isActive ? (isScrolled ? 'text-cyan-500' : 'text-cyan-500') : ''}
                bg-transparent hover:bg-gradient-to-r hover:from-primary/20 hover:to-pink-500/20 hover:text-white
                rounded-md px-3 py-1
              `}
            >
              <Icon className={`h-4 w-4 transition-all duration-300 ${
                isActive ? 'text-cyan-500' : 'text-cyan-400'
              }`} />
              
              <span className="relative z-10">
                {link.name}
              </span>
              
              {hasSubmenu && (
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              )}
            </Button>
            
            {hasSubmenu && isOpen && (
              <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  {link.submenu!.map((submenuItem) => {
                    const SubIcon = submenuItem.icon;
                    const hasNestedSubmenu = submenuItem.submenu && submenuItem.submenu.length > 0;
                    const isNestedOpen = openNestedSubmenu === submenuItem.name;
                    
                    return (
                      <div key={submenuItem.name} className="relative">
                        <button
                          onClick={(e) => handleSubmenuClick(submenuItem, e)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-500 flex items-center gap-2 justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <SubIcon className="h-4 w-4" />
                            {submenuItem.name}
                          </div>
                          {hasNestedSubmenu && (
                            <ChevronRight className={`h-3 w-3 transition-transform duration-300 ${isNestedOpen ? 'rotate-90' : ''}`} />
                          )}
                        </button>
                        
                        {hasNestedSubmenu && isNestedOpen && (
                          <div className="absolute left-full top-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ml-1">
                            <div className="py-1">
                              {submenuItem.submenu!.map((nestedItem) => {
                                const NestedIcon = nestedItem.icon;
                                return (
                                  <button
                                    key={nestedItem.name}
                                    onClick={(e) => handleNestedSubmenuClick(nestedItem, e)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-500 flex items-center gap-2"
                                  >
                                    <NestedIcon className="h-4 w-4" />
                                    {nestedItem.name}
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
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DesktopNavLinks;

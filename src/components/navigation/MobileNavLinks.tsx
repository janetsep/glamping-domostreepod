
import { useState } from "react";
import { navigationLinks } from "./navigationData";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavLink, SubMenuItem } from "./navigationData";

interface MobileNavLinksProps {
  scrollToSection: (id: string) => void;
  navigateToPage: (path: string) => void;
  isHomePage: boolean;
}

const MobileNavLinks = ({
  scrollToSection,
  navigateToPage,
  isHomePage
}: MobileNavLinksProps) => {
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<string | null>(null);
  
  const handleClick = (link: NavLink, index: number) => {
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
    <div className="flex flex-col space-y-2">
      {navigationLinks.map((link, index) => {
        const Icon = link.icon;
        const hasSubmenu = link.submenu && link.submenu.length > 0;
        const isOpen = openSubmenu === index;
        
        return (
          <div key={link.name} className="space-y-1">
            <button 
              onClick={() => handleClick(link, index)}
              className="group w-full py-4 text-left text-lg flex items-center gap-3 hover:translate-x-1 transition-all duration-300 px-4"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 text-cyan-500 group-hover:from-cyan-500 group-hover:to-cyan-400 group-hover:text-white transition-all duration-300">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col flex-grow">
                <span className="font-display tracking-wide group-hover:text-cyan-500 transition-colors duration-300">
                  {link.name}
                </span>
                {link.description && (
                  <span className="text-xs text-gray-500 mt-0.5 group-hover:text-cyan-400 transition-colors duration-300">
                    {link.description}
                  </span>
                )}
              </div>
              {hasSubmenu && (
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              )}
            </button>
            
            {hasSubmenu && isOpen && (
              <div className="ml-14 space-y-1 mt-1 mb-2">
                {link.submenu!.map((submenuItem) => {
                  const SubIcon = submenuItem.icon;
                  const hasNestedSubmenu = submenuItem.submenu && submenuItem.submenu.length > 0;
                  const isNestedOpen = openNestedSubmenu === submenuItem.name;
                  
                  return (
                    <div key={submenuItem.name} className="space-y-1">
                      <button
                        onClick={(e) => handleSubmenuClick(submenuItem, e)}
                        className="group flex items-center gap-3 w-full py-3 px-4 text-left text-base hover:translate-x-1 transition-all duration-300"
                      >
                        <SubIcon className="h-4 w-4 text-cyan-400" />
                        <span className="text-gray-700 group-hover:text-cyan-500 transition-colors duration-300 flex-grow">
                          {submenuItem.name}
                        </span>
                        {hasNestedSubmenu && (
                          <ChevronRight className={`h-3 w-3 transition-transform duration-300 ${isNestedOpen ? 'rotate-90' : ''}`} />
                        )}
                      </button>
                      
                      {hasNestedSubmenu && isNestedOpen && (
                        <div className="ml-8 space-y-1">
                          {submenuItem.submenu!.map((nestedItem) => {
                            const NestedIcon = nestedItem.icon;
                            return (
                              <button
                                key={nestedItem.name}
                                onClick={(e) => handleNestedSubmenuClick(nestedItem, e)}
                                className="group flex items-center gap-3 w-full py-2 px-4 text-left text-sm hover:translate-x-1 transition-all duration-300"
                              >
                                <NestedIcon className="h-3 w-3 text-cyan-400" />
                                <span className="text-gray-600 group-hover:text-cyan-500 transition-colors duration-300">
                                  {nestedItem.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MobileNavLinks;

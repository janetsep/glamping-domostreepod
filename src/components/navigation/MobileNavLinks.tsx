
import { useState } from "react";
import { navigationLinks } from "./navigationData";
import { ChevronDown } from "lucide-react";
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
        scrollToSection(submenuItem.id);
      } else {
        navigateToPage(`/#${submenuItem.id}`);
      }
    }
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
            
            {/* Submenu for mobile */}
            {hasSubmenu && isOpen && (
              <div className="ml-14 space-y-1 mt-1 mb-2">
                {link.submenu!.map((submenuItem) => {
                  const SubIcon = submenuItem.icon;
                  return (
                    <button
                      key={submenuItem.name}
                      onClick={(e) => handleSubmenuClick(submenuItem, e)}
                      className="group flex items-center gap-3 w-full py-3 px-4 text-left text-base hover:translate-x-1 transition-all duration-300"
                    >
                      <SubIcon className="h-4 w-4 text-cyan-400" />
                      <span className="text-gray-700 group-hover:text-cyan-500 transition-colors duration-300">
                        {submenuItem.name}
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
  );
};

export default MobileNavLinks;


import { useRef } from "react";
import { NavLink } from "./navigationData";

interface NavTabsProps {
  navigationLinks: NavLink[];
  isScrolled: boolean;
  activeIndex: number;
  setHoveredIndex: (index: number | null) => void;
  handleNavClick: (index: number) => void;
}

const NavTabs = ({
  navigationLinks,
  isScrolled,
  activeIndex,
  setHoveredIndex,
  handleNavClick
}: NavTabsProps) => {
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="relative flex space-x-[3px] items-center">
      {navigationLinks.map((link, index) => {
        const Icon = link.icon;
        const isActive = index === activeIndex;
        const hasSubmenu = link.submenu && link.submenu.length > 0;
        
        return (
          <div
            key={link.name}
            ref={(el) => (tabRefs.current[index] = el)}
            className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[34px] flex items-center ${
              isActive 
                ? isScrolled 
                  ? 'text-cyan-500 dark:text-cyan-400' 
                  : 'text-white font-semibold text-shadow-sm dark:text-white' 
                : isScrolled 
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-white font-medium text-shadow-sm dark:text-white'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleNavClick(index)}
          >
            <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full gap-2">
              <Icon className="h-4 w-4" />
              {link.name}
              {hasSubmenu && (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NavTabs;

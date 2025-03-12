
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { navigationLinks, NavLink } from "./navigationData";

export const useMenuAnimation = (navLinks = navigationLinks) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/index";
  
  // Animation states
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Determine active tab based on location
  useEffect(() => {
    let foundActiveIndex = 0;
    
    if (location.pathname !== "/" && location.pathname !== "/index") {
      // Find the matching route path
      const pathMatch = navLinks.findIndex(link => link.path === location.pathname);
      if (pathMatch !== -1) {
        foundActiveIndex = pathMatch;
      }
    } else if (location.hash) {
      // If we're on homepage and have a hash, find the matching id
      const hashId = location.hash.substring(1);
      const hashMatch = navLinks.findIndex(link => link.id === hashId);
      if (hashMatch !== -1) {
        foundActiveIndex = hashMatch;
      }
    }
    
    setActiveIndex(foundActiveIndex);
  }, [location.pathname, location.hash, navLinks]);

  // Handle hover animation
  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  // Handle active tab animation
  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  // Set initial active tab position
  useEffect(() => {
    requestAnimationFrame(() => {
      const initialElement = tabRefs.current[activeIndex];
      if (initialElement) {
        const { offsetLeft, offsetWidth } = initialElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  return {
    tabRefs,
    isHomePage,
    activeIndex,
    setActiveIndex,
    hoveredIndex,
    setHoveredIndex,
    hoverStyle,
    activeStyle
  };
};


import { CSSProperties } from "react";

interface AnimatedTabIndicatorProps {
  isScrolled: boolean;
  activeStyle: CSSProperties;
  hoverStyle: CSSProperties;
  hoveredIndex: number | null;
}

const AnimatedTabIndicator = ({
  isScrolled,
  activeStyle,
  hoverStyle,
  hoveredIndex
}: AnimatedTabIndicatorProps) => {
  return (
    <>
      {/* Hover Highlight */}
      <div
        className={`absolute h-[34px] transition-all duration-300 ease-out rounded-[6px] flex items-center ${
          isScrolled 
            ? 'bg-[#0e0f1114] dark:bg-[#ffffff1a]' 
            : 'bg-white/10 dark:bg-[#ffffff1a]'
        }`}
        style={{
          ...hoverStyle,
          opacity: hoveredIndex !== null ? 1 : 0,
        }}
      />

      {/* Active Indicator */}
      <div
        className={`absolute bottom-[-6px] h-[2px] transition-all duration-300 ease-out ${
          isScrolled 
            ? 'bg-cyan-500 dark:bg-cyan-400' 
            : 'bg-white dark:bg-cyan-400'
        }`}
        style={activeStyle}
      />
    </>
  );
};

export default AnimatedTabIndicator;

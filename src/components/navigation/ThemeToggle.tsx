
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface ThemeToggleProps {
  isScrolled: boolean;
}

const ThemeToggle = ({ isScrolled }: ThemeToggleProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check initial theme on mount
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleDarkMode}
      className={`ml-2 ${
        isScrolled 
          ? 'text-gray-700 hover:text-cyan-500 hover:bg-cyan-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50' 
          : 'text-white hover:bg-white/10 dark:text-gray-300 dark:hover:bg-gray-800/50'
      }`}
    >
      {isDarkMode ? 
        <Sun className="h-[1.2rem] w-[1.2rem]" /> : 
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      }
    </Button>
  );
};

export default ThemeToggle;

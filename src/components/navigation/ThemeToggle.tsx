
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import { useEffect } from "react";

interface ThemeToggleProps {
  isScrolled: boolean;
}

const ThemeToggle = ({ isScrolled }: ThemeToggleProps) => {
  // Set light theme by default and ensure it stays that way
  useEffect(() => {
    // Remove dark class if present
    document.documentElement.classList.remove("dark");
  }, []);

  // The button is now just decorative with no functionality
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`ml-2 ${
        isScrolled 
          ? 'text-gray-700 hover:text-cyan-500 hover:bg-cyan-50/50 dark:text-gray-300 dark:hover:bg-gray-800/50' 
          : 'text-white hover:bg-white/10 dark:text-gray-300 dark:hover:bg-gray-800/50'
      }`}
      // No onClick handler to disable functionality
      aria-label="Theme"
    >
      <Moon className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
};

export default ThemeToggle;

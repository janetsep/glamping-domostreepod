
import { Button } from "@/components/ui/button";
import { Conciergebell } from "lucide-react";

interface ReserveButtonProps {
  isScrolled: boolean;
  handleReserveClick: () => void;
}

const ReserveButton = ({
  isScrolled,
  handleReserveClick
}: ReserveButtonProps) => {
  return <Button variant={isScrolled ? "default" : "outline"} onClick={handleReserveClick} className={`text-base font-medium relative overflow-hidden group transition-all duration-300 ${isScrolled ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white dark:from-cyan-600 dark:to-cyan-500 dark:hover:from-cyan-500 dark:hover:to-cyan-400' : 'bg-transparent text-white border-white hover:bg-white/20 hover:text-white dark:border-gray-600 dark:text-gray-300 dark:hover:border-cyan-500'}`}>
      <span className="relative z-10 flex items-center gap-1">
        <Conciergebell className="h-4 w-4" />
        <span>Reservar</span>
        <span className="opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs transition-all duration-500 overflow-hidden whitespace-nowrap"></span>
      </span>
      <span className={`absolute inset-0 w-full h-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${isScrolled ? "bg-cyan-600 dark:bg-cyan-400" : "bg-white/30 dark:bg-cyan-500/30"}`}></span>
    </Button>;
};

export default ReserveButton;

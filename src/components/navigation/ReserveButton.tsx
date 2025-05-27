import { Button } from "@/components/ui/button";
import { ConciergeBell } from "lucide-react";

interface ReserveButtonProps {
  isScrolled: boolean;
  handleReserveClick: () => void;
}

const ReserveButton = ({
  isScrolled,
  handleReserveClick
}: ReserveButtonProps) => {
  return (
    <Button 
      onClick={handleReserveClick} 
      className="bg-gradient-to-r from-primary to-pink-500 text-white ml-4 px-5 py-2 rounded-md flex items-center gap-2 transition-all duration-300 hover:from-primary/90 hover:to-pink-500/90"
      size="default"
    >
      <ConciergeBell className="h-4 w-4" />
      <span>Reservar</span>
    </Button>
  );
};

export default ReserveButton;

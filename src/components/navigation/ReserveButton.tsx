
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
      className="bg-cyan-500 hover:bg-cyan-600 text-white ml-4 px-5 py-2 rounded-md flex items-center gap-2"
    >
      <ConciergeBell className="h-4 w-4" />
      <span>Reservar</span>
    </Button>
  );
};

export default ReserveButton;

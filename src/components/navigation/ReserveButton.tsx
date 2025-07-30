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
      className="btn-primary ml-4"
      size="default"
    >
      <ConciergeBell className="h-4 w-4 mr-2" />
      <span>Reservar</span>
    </Button>
  );
};

export default ReserveButton;

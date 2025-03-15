
import { Button } from "@/components/ui/button";
import { ConciergeBell } from "lucide-react";
import { useNavigation } from "./useNavigation";

const FloatingReserveButton = () => {
  const { handleReserveClick } = useNavigation();

  return (
    <Button
      onClick={handleReserveClick}
      className="fixed bottom-20 right-6 z-50 rounded-full shadow-lg bg-cyan-500 hover:bg-cyan-600 text-white p-4 flex items-center gap-2 animate-fade-in"
      size="lg"
    >
      <ConciergeBell className="h-5 w-5" />
      <span>Reservar</span>
    </Button>
  );
};

export default FloatingReserveButton;

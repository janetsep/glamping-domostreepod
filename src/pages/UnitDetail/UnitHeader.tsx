
import { ArrowLeft } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface UnitHeaderProps {
  navigate: NavigateFunction;
}

export const UnitHeader = ({ navigate }: UnitHeaderProps) => {
  return (
    <Button variant="ghost" className="mb-6" onClick={() => navigate("/")}>
      <ArrowLeft className="mr-2" />
      Volver a Domos
    </Button>
  );
};

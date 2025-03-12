
import { ArrowLeft } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlampingUnit } from "@/lib/supabase";

interface UnitHeaderProps {
  navigate?: NavigateFunction;
  unit?: GlampingUnit;
}

export const UnitHeader = ({ navigate, unit }: UnitHeaderProps) => {
  const handleNavigation = () => {
    if (navigate) {
      navigate("/");
    }
  };

  return (
    <Button variant="ghost" className="mb-6" onClick={handleNavigation}>
      <ArrowLeft className="mr-2" />
      Volver a Domos
    </Button>
  );
};


import { ArrowLeft } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { unitDetailContent } from "@/data/siteContent";
import { useNavigation } from "@/components/navigation/useNavigation";

interface UnitHeaderProps {
  navigate: NavigateFunction;
}

export const UnitHeader = ({ navigate }: UnitHeaderProps) => {
  const { navigateToPage } = useNavigation();
  
  const handleBackClick = () => {
    // Navegar a la página principal con el hash para la sección de paquetes
    navigateToPage("/#packages");
  };
  
  return (
    <Button variant="ghost" className="mb-6" onClick={handleBackClick}>
      <ArrowLeft className="mr-2" />
      {unitDetailContent.backButton}
    </Button>
  );
};

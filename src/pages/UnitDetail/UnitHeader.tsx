
import { ArrowLeft } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { unitDetailContent } from "@/data/siteContent";
import { useNavigation } from "@/components/navigation/useNavigation";

interface UnitHeaderProps {
  navigate: NavigateFunction;
}

export const UnitHeader = ({ navigate }: UnitHeaderProps) => {
  const { navigateToHome } = useNavigation();
  
  const handleBackClick = () => {
    // Primero navegamos a la página principal
    navigateToHome();
    
    // Después de un breve retraso para asegurar que la navegación se completó
    // hacemos scroll hacia la sección de paquetes
    setTimeout(() => {
      const packagesSection = document.getElementById('packages');
      if (packagesSection) {
        packagesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300); // Pequeño retraso para asegurar que la navegación se completó
  };
  
  return (
    <Button variant="ghost" className="mb-6" onClick={handleBackClick}>
      <ArrowLeft className="mr-2" />
      {unitDetailContent.backButton}
    </Button>
  );
};


import { GlampingUnit } from "@/lib/supabase";
import { UnitInfo } from "@/components/unit-detail/UnitInfo";
import { UnitFeatures } from "@/components/unit-detail/UnitFeatures";
import { ImageGallery } from "@/components/unit-detail/ImageGallery";
import { UnitExperience } from "@/components/unit-detail/UnitExperience";
import { UnitPolicies } from "@/components/unit-detail/UnitPolicies";
import { CompactReservationProgress } from "@/components/unit-detail/CompactReservationProgress";

interface UnitContentProps {
  unit: GlampingUnit;
  currentStep?: number;
  showQuote?: boolean;
  isProcessingPayment?: boolean;
  isReservationConfirmed?: boolean;
}

export const UnitContent = ({ 
  unit, 
  currentStep = 1, 
  showQuote = false, 
  isProcessingPayment = false, 
  isReservationConfirmed = false 
}: UnitContentProps) => {
  return (
    <div className="space-y-8">
      {/* Indicador de progreso sobre la imagen */}
      <div className="relative">
        <ImageGallery unit={unit} />
        <div className="absolute top-4 left-4 right-4 z-10">
          <CompactReservationProgress 
            currentStep={currentStep}
            showQuote={showQuote}
            isProcessingPayment={isProcessingPayment}
            isReservationConfirmed={isReservationConfirmed}
          />
        </div>
      </div>
      
      <UnitInfo unit={unit} />
      <UnitFeatures unit={unit} />
      <UnitExperience />
      <UnitPolicies />
    </div>
  );
};

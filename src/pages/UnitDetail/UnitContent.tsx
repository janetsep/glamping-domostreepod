
import { GlampingUnit } from "@/lib/supabase";
import { UnitInfo } from "@/components/unit-detail/UnitInfo";
import { UnitFeatures } from "@/components/unit-detail/UnitFeatures";
import { ImageGallery } from "@/components/unit-detail/ImageGallery";
import { UnitExperience } from "@/components/unit-detail/UnitExperience";
import { UnitPolicies } from "@/components/unit-detail/UnitPolicies";

interface UnitContentProps {
  unit: GlampingUnit;
  currentStep?: number;
  showQuote?: boolean;
  isProcessingPayment?: boolean;
  isReservationConfirmed?: boolean;
}

export const UnitContent = ({ 
  unit
}: UnitContentProps) => {
  return (
    <div className="space-y-8 max-h-screen overflow-y-auto pr-4">
      <ImageGallery unit={unit} />
      <UnitInfo unit={unit} />
      <UnitFeatures unit={unit} />
      <UnitExperience />
      <UnitPolicies />
    </div>
  );
};

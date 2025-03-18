
import type { GlampingUnit } from "@/lib/supabase";
import { ImageGallery } from "./ImageGallery";
import { UnitHeader } from "./UnitHeader";
import { UnitFeatures } from "./UnitFeatures";
import { UnitPolicies } from "./UnitPolicies";
import { UnitExperience } from "./UnitExperience";
import { 
  getDomoImages, 
  getFeatures, 
  getPolicies, 
  getUnitDetail,
  getExperienceImages
} from "./utils/unitHelpers";

interface UnitInfoProps {
  unit: GlampingUnit;
}

export const UnitInfo = ({ unit }: UnitInfoProps) => {
  // Obtener los datos necesarios usando las funciones de utilidad
  const images = getDomoImages(unit.name);
  const features = getFeatures(unit.name);
  const policies = getPolicies();
  const unitDetail = getUnitDetail(unit.name);
  const experienceImages = getExperienceImages();
  
  return (
    <div>
      {/* Galería de imágenes */}
      <ImageGallery images={images} unitName={unit.name} />
      
      <div className="mt-6">
        {/* Encabezado con información básica */}
        <UnitHeader 
          name={unit.name}
          size={unitDetail.size}
          maxGuests={unit.max_guests}
          description={unitDetail.description}
        />
        
        {/* Características y comodidades */}
        <UnitFeatures features={features} />
        
        {/* Políticas e información importante */}
        <UnitPolicies policies={policies} />
        
        {/* Experiencia TreePod */}
        <UnitExperience 
          experience={unitDetail.experience}
          experienceImages={experienceImages}
        />
      </div>
    </div>
  );
};

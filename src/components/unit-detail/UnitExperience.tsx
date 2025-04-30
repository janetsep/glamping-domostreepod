
import { unitExperienceContent } from "@/data/content/unitDetail";

interface UnitExperienceProps {
  experience?: string;
  experienceImages?: string[];
  images?: any; // Para mantener compatibilidad con llamadas existentes
}

export const UnitExperience = ({ 
  experience, 
  experienceImages = [],
  images 
}: UnitExperienceProps) => {
  // Si nos pasan imágenes en el formato antiguo, las usamos
  const displayImages = images || experienceImages || [];
  
  // Si no se proporciona experiencia, usamos una predeterminada
  const defaultExperience = "En TreePod vivirás una experiencia única en medio del bosque nativo. Disfruta del sonido de la naturaleza, descansa en nuestras tinajas de agua mineralizada y conecta con el entorno natural del Valle Las Trancas.";
  const displayExperience = experience || defaultExperience;
  
  return (
    <div className="bg-green-50 p-5 rounded-lg border border-green-100">
      <h3 className="font-semibold text-green-800 mb-2">{unitExperienceContent.title}</h3>
      <p className="text-green-700 mb-4">
        {displayExperience}
      </p>
      
      {/* Galería de imágenes de experiencia */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {Array.isArray(displayImages) && displayImages.map((img, index) => (
          <div key={index} className="h-32 md:h-40 rounded-md overflow-hidden">
            <img 
              src={typeof img === 'string' ? img : img?.url || ''} 
              alt={`Experiencia TreePod ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-green-200">
        <p className="text-sm text-green-700">
          <strong>{unitExperienceContent.stayIncludes}</strong> {unitExperienceContent.stayIncludesText}
        </p>
      </div>
    </div>
  );
};

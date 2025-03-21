
interface UnitExperienceProps {
  experience: string;
  experienceImages: string[];
}

export const UnitExperience = ({ experience, experienceImages }: UnitExperienceProps) => {
  return (
    <div className="bg-green-50 p-5 rounded-lg border border-green-100">
      <h3 className="font-semibold text-green-800 mb-2">Tu experiencia TreePod</h3>
      <p className="text-green-700 mb-4">
        {experience}
      </p>
      
      {/* Galería de imágenes de experiencia */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {experienceImages.map((img, index) => (
          <div key={index} className="h-32 md:h-40 rounded-md overflow-hidden">
            <img 
              src={img} 
              alt={`Experiencia TreePod ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-green-200">
        <p className="text-sm text-green-700">
          <strong>¿Qué incluye tu estadía?</strong> Acceso a senderos exclusivos, desayuno con productos locales, tinajas de agua mineralizada proveniente de las termas de Chillán (previa reserva y pago extra) y la tranquilidad absoluta del bosque nativo en el Valle Las Trancas.
        </p>
      </div>
    </div>
  );
};

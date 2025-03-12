
import { MapPin } from "lucide-react";

const AboutSection = () => {
  return (
    <div>
      <img 
        alt="Domos Treepod Logo" 
        className="h-24 mb-4" 
        src="/lovable-uploads/ab978d5a-f892-4040-8138-26bc24a5e298.png" 
      />
      <p className="text-gray-600 mb-4 text-sm">
        Experimenta la magia de dormir entre los árboles en nuestros exclusivos domos 
        suspendidos en pleno corazón de Valle Las Trancas, Chile.
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4 text-cyan-500" />
        <span>Valle Las Trancas, Chile</span>
      </div>
    </div>
  );
};

export default AboutSection;

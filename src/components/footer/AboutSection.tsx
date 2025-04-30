
import { MapPin } from "lucide-react";
import { footerContent } from "@/data/content/footer";

const AboutSection = () => {
  return (
    <div>
      <img 
        alt="Domos Treepod Logo" 
        className="h-24 mb-4" 
        src="/lovable-uploads/ab978d5a-f892-4040-8138-26bc24a5e298.png" 
      />
      <p className="text-gray-600 mb-4 text-sm">
        {footerContent.aboutText}
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4 text-cyan-500" />
        <span>{footerContent.address}</span>
      </div>
    </div>
  );
};

export default AboutSection;

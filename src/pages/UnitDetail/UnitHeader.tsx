
import { ArrowLeft } from "lucide-react";
import { unitDetailContent } from "@/data/content/unitDetail";

interface UnitHeaderProps {
  navigate: (path: string) => void;
}

export const UnitHeader = ({ navigate }: UnitHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center mb-6">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-primary hover:text-primary/70 transition-colors mb-2 md:mb-0"
      >
        <ArrowLeft size={18} />
        <span>{unitDetailContent.backButton}</span>
      </button>
    </div>
  );
};

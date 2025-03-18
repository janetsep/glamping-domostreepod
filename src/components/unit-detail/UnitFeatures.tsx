
import { Check } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface UnitFeaturesProps {
  features: Feature[];
}

export const UnitFeatures = ({ features }: UnitFeaturesProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-3">Comodidades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2 text-gray-700">
            <span className="mt-1">{feature.icon}</span>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
    </>
  );
};

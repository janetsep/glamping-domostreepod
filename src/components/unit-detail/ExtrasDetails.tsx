
import React from "react";
import { Activity, ThemedPackage } from "@/types";

interface ExtrasDetailsProps {
  selectedActivities?: Activity[];
  selectedPackages?: ThemedPackage[];
}

export const ExtrasDetails: React.FC<ExtrasDetailsProps> = ({
  selectedActivities = [],
  selectedPackages = [],
}) => {
  const formatActivitiesAndPackages = () => {
    let items = [];
    
    if (selectedActivities.length > 0) {
      items.push(`${selectedActivities.length} actividades: ${selectedActivities.map((a: Activity) => a.name).join(", ")}`);
    }
    
    if (selectedPackages.length > 0) {
      items.push(`${selectedPackages.length} paquetes: ${selectedPackages.map((p: ThemedPackage) => p.title).join(", ")}`);
    }
    
    return items.join(" y ");
  };

  const extrasText = formatActivitiesAndPackages();
  
  if (!extrasText) return null;

  return (
    <div className="mt-2 p-3 bg-indigo-50 rounded-md">
      <p className="text-sm text-indigo-700">
        <span className="font-medium text-indigo-800">Extras incluidos: </span> 
        {extrasText}
      </p>
    </div>
  );
};

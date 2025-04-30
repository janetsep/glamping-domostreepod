
import React from "react";
import { UnitInfo } from "@/components/unit-detail/UnitInfo";
import { UnitFeatures } from "@/components/unit-detail/UnitFeatures";
import { UnitPolicies } from "@/components/unit-detail/UnitPolicies";
import { UnitExperience } from "@/components/unit-detail/UnitExperience";

interface UnitContentProps {
  unit: any;
  domoImages: any;
  travelerType?: string;
}

const UnitContent: React.FC<UnitContentProps> = ({ unit, domoImages, travelerType = 'default' }) => {
  return (
    <div className="space-y-8">
      <UnitInfo 
        unitName={unit.name}
        name={unit.display_name}
        unitId={unit.id}
        travelerType={travelerType}
      />
      
      <UnitFeatures unitName={unit.name} />
      
      <UnitPolicies />
      
      <UnitExperience images={domoImages} />
    </div>
  );
};

export default UnitContent;

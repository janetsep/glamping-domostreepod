
import { UnitInfo } from "@/components/unit-detail/UnitInfo";
import { GlampingUnit } from "@/lib/supabase";

interface UnitContentProps {
  unit: GlampingUnit;
}

export const UnitContent = ({ unit }: UnitContentProps) => {
  return <UnitInfo unit={unit} />;
};

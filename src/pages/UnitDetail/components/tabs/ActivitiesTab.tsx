
import { ActivitiesSelector } from "@/components/unit-detail/ActivitiesSelector";
import { Activity } from "@/types";

interface ActivitiesTabProps {
  selectedActivities: Activity[];
  onActivityToggle: (activity: Activity) => void;
  total: number;
}

export const ActivitiesTab = ({
  selectedActivities,
  onActivityToggle,
  total
}: ActivitiesTabProps) => {
  return (
    <ActivitiesSelector
      selectedActivities={selectedActivities}
      onActivityToggle={onActivityToggle}
      total={total}
    />
  );
};

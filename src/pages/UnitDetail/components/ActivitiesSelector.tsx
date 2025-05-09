
import { Activity } from '@/types';

interface ActivitiesSelectorProps {
  activities: Activity[];
  selectedActivities: Activity[];
  onActivityToggle: (activity: Activity) => void;
  totalPrice?: number;
}

export const ActivitiesSelector = ({ activities, selectedActivities, onActivityToggle, totalPrice }: ActivitiesSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Actividades disponibles</h3>
      {totalPrice !== undefined && totalPrice > 0 && (
        <div className="text-right text-sm font-medium text-primary">
          Total actividades: ${totalPrice.toLocaleString()}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity) => {
          const isSelected = selectedActivities.some((a) => a.id === activity.id);
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <input
                type="checkbox"
                id={`activity-${activity.id}`}
                checked={isSelected}
                onChange={() => onActivityToggle(activity)}
                className="mt-1"
              />
              <label htmlFor={`activity-${activity.id}`} className="flex-1 cursor-pointer">
                <div className="font-medium">{activity.title || activity.name}</div>
                <div className="text-sm text-gray-500">{activity.description}</div>
                <div className="text-sm font-medium mt-1">${activity.price.toLocaleString()}</div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitiesSelector;

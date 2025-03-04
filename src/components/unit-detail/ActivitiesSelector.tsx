
import { useState, useEffect } from "react";
import { Activity } from "@/types";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Check, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivitiesSelectorProps {
  selectedActivities: Activity[];
  onActivityToggle: (activity: Activity) => void;
}

export const ActivitiesSelector = ({
  selectedActivities,
  onActivityToggle,
}: ActivitiesSelectorProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error fetching activities:", error);
          return;
        }

        setActivities(data || []);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const isSelected = (activity: Activity) => {
    return selectedActivities.some((a) => a.id === activity.id);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No hay actividades disponibles en este momento.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {activities.map((activity) => (
        <Card
          key={activity.id}
          className={`p-3 cursor-pointer transition-colors flex items-center ${
            isSelected(activity)
              ? "bg-primary/10 border-primary"
              : "hover:bg-secondary/20"
          }`}
          onClick={() => onActivityToggle(activity)}
        >
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">{activity.name}</div>
              <div className="text-sm font-semibold text-primary">
                ${activity.price.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center mt-1">
              <div className="text-xs text-muted-foreground mr-2 line-clamp-1">
                {activity.description}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{activity.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div
            className={`h-5 w-5 rounded border flex items-center justify-center ml-3 ${
              isSelected(activity)
                ? "bg-primary border-primary text-white"
                : "border-gray-300"
            }`}
          >
            {isSelected(activity) && <Check className="h-3 w-3" />}
          </div>
        </Card>
      ))}
    </div>
  );
};

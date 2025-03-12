
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Activity, ThemedPackage } from "@/types";
import { DateGuestsTab } from "./components/tabs/DateGuestsTab";
import { ActivitiesTab } from "./components/tabs/ActivitiesTab";
import { PackagesTab } from "./components/tabs/PackagesTab";
import { TabHeader } from "./components/tabs/TabHeader";

interface ReservationTabsProps {
  tab: string;
  onTabChange: (tab: string) => void;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  maxGuests: number;
  guests: number;
  onGuestsChange: (guests: number) => void;
  onAdultsChange?: (adults: number) => void;
  onChildrenChange?: (children: number) => void;
  isAvailable: boolean | null;
  selectedActivities: Activity[];
  onActivityToggle: (activity: Activity) => void;
  activitiesTotal: number;
  selectedPackages: ThemedPackage[];
  onPackageToggle: (pkg: ThemedPackage) => void;
  packagesTotal: number;
  unitId: string;
}

export const ReservationTabs = ({
  tab,
  onTabChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  maxGuests,
  guests,
  onGuestsChange,
  onAdultsChange,
  onChildrenChange,
  isAvailable,
  selectedActivities,
  onActivityToggle,
  activitiesTotal,
  selectedPackages,
  onPackageToggle,
  packagesTotal,
  unitId
}: ReservationTabsProps) => {
  return (
    <Tabs 
      defaultValue="dates" 
      value={tab} 
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabHeader />
      
      <TabsContent value="dates" className="space-y-4">
        <DateGuestsTab 
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          maxGuests={maxGuests}
          guests={guests}
          onGuestsChange={onGuestsChange}
          onAdultsChange={onAdultsChange}
          onChildrenChange={onChildrenChange}
          isAvailable={isAvailable}
          unitId={unitId}
        />
      </TabsContent>
      
      <TabsContent value="activities">
        <ActivitiesTab 
          selectedActivities={selectedActivities}
          onActivityToggle={onActivityToggle}
          total={activitiesTotal}
        />
      </TabsContent>
      
      <TabsContent value="packages">
        <PackagesTab 
          selectedPackages={selectedPackages}
          onPackageToggle={onPackageToggle}
          total={packagesTotal}
        />
      </TabsContent>
    </Tabs>
  );
};

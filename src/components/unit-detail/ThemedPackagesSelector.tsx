
import { useState, useEffect } from "react";
import { ThemedPackage } from "@/types";
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

interface ThemedPackagesSelectorProps {
  selectedPackages: ThemedPackage[];
  onPackageToggle: (pkg: ThemedPackage) => void;
  total?: number; // Added total prop
}

export const ThemedPackagesSelector = ({
  selectedPackages,
  onPackageToggle,
  total,
}: ThemedPackagesSelectorProps) => {
  const [packages, setPackages] = useState<ThemedPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("themed_packages")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error fetching themed packages:", error);
          return;
        }

        setPackages(data || []);
      } catch (error) {
        console.error("Error fetching themed packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const isSelected = (pkg: ThemedPackage) => {
    return selectedPackages.some((p) => p.id === pkg.id);
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

  if (packages.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No hay paquetes temáticos disponibles en este momento.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {total !== undefined && total > 0 && (
        <div className="text-right text-sm font-medium text-primary">
          Total paquetes: ${total.toLocaleString()}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`p-3 cursor-pointer transition-colors flex items-center ${
              isSelected(pkg)
                ? "bg-primary/10 border-primary"
                : "hover:bg-secondary/20"
            }`}
            onClick={() => onPackageToggle(pkg)}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-black">{pkg.title}</div>
                <div className="text-sm font-semibold text-primary">
                  ${pkg.price.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center mt-1">
                <div className="text-xs text-muted-foreground mr-2 line-clamp-1">
                  {pkg.description}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{pkg.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div
              className={`h-5 w-5 rounded border flex items-center justify-center ml-3 ${
                isSelected(pkg)
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300"
              }`}
            >
              {isSelected(pkg) && <Check className="h-3 w-3" />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
export const DateSelectionHeader = () => {
  return <div className="flex justify-between items-center">
      <h3 className="text-sm font-medium">Seleccionar Estadía</h3>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">
              Selecciona las fechas de entrada y salida. El sistema verificará automáticamente
              la disponibilidad en todos nuestros domos (4 en total).
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>;
};

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

interface AlternativeDatesProps {
  alternativeDates: { startDate: Date; endDate: Date }[];
  onSelectDate: (startDate: Date, endDate: Date) => void;
  requiredDomos: number;
}

export const AlternativeDates: React.FC<AlternativeDatesProps> = ({
  alternativeDates,
  onSelectDate,
  requiredDomos
}) => {
  if (!alternativeDates || alternativeDates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-2">
        <CalendarCheck className="h-5 w-5 text-amber-500" />
        <h3 className="font-medium text-amber-800">
          Fechas alternativas disponibles
        </h3>
      </div>
      
      <div className="space-y-3">
        {alternativeDates.map((dateRange, index) => (
          <Card key={index} className="bg-amber-50 border-amber-200">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base text-amber-800">Opción {index + 1}</CardTitle>
              <CardDescription className="text-amber-700">
                Disponibilidad completa para {requiredDomos} domos
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <p className="font-medium text-sm">
                Del {format(dateRange.startDate, "d 'de' MMMM", { locale: es })} al{" "}
                {format(dateRange.endDate, "d 'de' MMMM, yyyy", { locale: es })}
              </p>
            </CardContent>
            <CardFooter className="py-3 px-4">
              <Button 
                variant="outline" 
                className="w-full border-amber-400 bg-amber-100 text-amber-900 hover:bg-amber-200"
                onClick={() => onSelectDate(dateRange.startDate, dateRange.endDate)}
              >
                Seleccionar estas fechas
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

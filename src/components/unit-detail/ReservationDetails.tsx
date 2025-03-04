
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Activity, ThemedPackage } from "@/types";

interface ReservationDetailsProps {
  startDate?: Date;
  endDate?: Date;
  guests?: number;
  quote: any;
  paymentDetails: any;
}

export const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  startDate,
  endDate,
  guests,
  quote,
  paymentDetails,
}) => {
  const formatDateShort = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatActivitiesAndPackages = () => {
    const activities = quote?.selectedActivities || [];
    const packages = quote?.selectedPackages || [];
    
    let items = [];
    
    if (activities.length > 0) {
      items.push(`${activities.length} actividades: ${activities.map((a: Activity) => a.name).join(", ")}`);
    }
    
    if (packages.length > 0) {
      items.push(`${packages.length} paquetes: ${packages.map((p: ThemedPackage) => p.title).join(", ")}`);
    }
    
    return items.join(" y ");
  };

  return (
    <Card className="p-6 bg-white">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Fechas:</span>
          <span>
            {formatDateShort(startDate)} - {formatDateShort(endDate)}
          </span>
        </div>

        {guests && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Huéspedes:</span>
            <span>{guests}</span>
          </div>
        )}

        {quote && (
          <>
            <div className="flex justify-between items-center">
              <span className="font-medium">Noches:</span>
              <span>{quote.nights}</span>
            </div>
            
            {quote.basePrice && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Precio base:</span>
                <span>{formatCurrency(quote.basePrice)}</span>
              </div>
            )}
            
            {quote.activitiesTotal > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Actividades:</span>
                <span>{formatCurrency(quote.activitiesTotal)}</span>
              </div>
            )}
            
            {quote.packagesTotal > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Paquetes temáticos:</span>
                <span>{formatCurrency(quote.packagesTotal)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between items-center font-bold">
              <span>Total:</span>
              <span>{formatCurrency(quote.totalPrice)}</span>
            </div>
          </>
        )}

        {paymentDetails && (
          <div className="mt-4 p-3 bg-green-50 rounded-md">
            <h4 className="font-medium text-green-800 mb-1">Detalles del pago</h4>
            <div className="text-sm text-green-700">
              <p>Código de autorización: {paymentDetails.authorization_code || 'N/A'}</p>
              <p>Número de tarjeta: {paymentDetails.card_detail?.card_number || 'N/A'}</p>
            </div>
          </div>
        )}

        {formatActivitiesAndPackages() && (
          <div className="mt-2 p-3 bg-indigo-50 rounded-md">
            <p className="text-sm text-indigo-700">
              <span className="font-medium text-indigo-800">Extras incluidos: </span> 
              {formatActivitiesAndPackages()}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

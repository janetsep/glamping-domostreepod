
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Activity, ThemedPackage } from "@/types";
import { PaymentDetails } from "./PaymentDetails";
import { ExtrasDetails } from "./ExtrasDetails";

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

        <PaymentDetails paymentDetails={paymentDetails} />

        <ExtrasDetails 
          selectedActivities={quote?.selectedActivities} 
          selectedPackages={quote?.selectedPackages} 
        />
      </div>
    </Card>
  );
};

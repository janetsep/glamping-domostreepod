
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Activity, ThemedPackage } from "@/types";
import { PaymentDetails } from "./PaymentDetails";
import { ExtrasDetails } from "./ExtrasDetails";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

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
    return format(date, 'PPP', {locale: es});
  };

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    return differenceInDays(endDate, startDate);
  };

  const nights = quote?.nights || calculateNights();

  return (
    <Card className="p-6 bg-white">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-3">Detalles de tu reserva</h3>
        
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

        {quote?.pets > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Mascotas:</span>
            <span>{quote.pets}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="font-medium">Noches:</span>
          <span>{nights}</span>
        </div>
        
        {quote?.basePrice !== undefined && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Precio por noche:</span>
            <span>{formatCurrency(quote.basePrice / nights)}</span>
          </div>
        )}
        
        {quote?.basePrice !== undefined && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Subtotal alojamiento:</span>
            <span>{formatCurrency(quote.basePrice)}</span>
          </div>
        )}
        
        {quote?.petsPrice > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Cargo por mascotas:</span>
            <span>{formatCurrency(quote.petsPrice)}</span>
          </div>
        )}
        
        {quote?.activitiesTotal > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Actividades:</span>
            <span>{formatCurrency(quote.activitiesTotal)}</span>
          </div>
        )}
        
        {quote?.packagesTotal > 0 && (
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

        <PaymentDetails paymentDetails={paymentDetails} />

        <ExtrasDetails 
          selectedActivities={quote?.selectedActivities} 
          selectedPackages={quote?.selectedPackages} 
        />
        
        <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <p className="font-medium text-blue-800 mb-1">Información importante</p>
          <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
            <li>Check-in: a partir de las 15:00 hrs.</li>
            <li>Check-out: hasta las 12:00 hrs.</li>
            <li>Llevar toallas y artículos de aseo personal.</li>
            <li>Si traes mascotas, infórmanos con anticipación.</li>
            <li>Contacto de emergencia: +56 9 1234 5678</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};


import React, { forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, ThemedPackage } from "@/types";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { ClientInformationForm } from "./ClientInformationForm";

interface ReservationConfirmationProps {
  startDate?: Date;
  endDate?: Date;
  guests?: number;
  quote: any;
  paymentDetails: any;
  onNewQuote: () => void;
  reservationId?: string | null;
}

export const ReservationConfirmation = forwardRef<HTMLDivElement, ReservationConfirmationProps>(
  ({ startDate, endDate, guests, quote, paymentDetails, onNewQuote, reservationId }, ref) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientInfoSubmitted, setClientInfoSubmitted] = useState(false);
    
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
        items.push(`${packages.length} paquetes: ${packages.map((p: ThemedPackage) => p.name).join(", ")}`);
      }
      
      return items.join(" y ");
    };

    const handleClientInfoSubmit = async (clientInfo: { name: string; email: string; phone: string }) => {
      if (!reservationId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se encontró el ID de la reserva",
        });
        return;
      }

      setIsSubmitting(true);
      
      try {
        // Save client information to the database
        const { error } = await supabase
          .from('reservation_clients')
          .insert({
            id: reservationId,
            name: clientInfo.name,
            email: clientInfo.email,
            phone: clientInfo.phone
          });

        if (error) {
          throw error;
        }

        // Send confirmation email via edge function
        const emailResponse = await fetch(`${supabase.supabaseUrl}/functions/v1/send-reservation-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.supabaseKey}`
          },
          body: JSON.stringify({
            email: clientInfo.email,
            name: clientInfo.name,
            phone: clientInfo.phone,
            reservationDetails: {
              id: reservationId,
              startDate: startDate?.toISOString(),
              endDate: endDate?.toISOString(),
              guests,
              quote,
              paymentDetails
            }
          })
        });

        if (!emailResponse.ok) {
          console.error('Error sending email:', await emailResponse.text());
        }
        
        setClientInfoSubmitted(true);
        toast({
          title: "Información guardada",
          description: "¡Gracias! Hemos registrado tu información y te enviamos un correo con los detalles de tu reserva.",
        });
      } catch (error) {
        console.error('Error guardando información del cliente:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo guardar la información del cliente. Por favor, inténtalo de nuevo.",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div ref={ref} className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-primary mb-2">
            ¡Reserva Confirmada!
          </h2>
          <p className="text-lg mb-4">
            Tu pago ha sido procesado con éxito
          </p>
        </div>

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

        {!clientInfoSubmitted ? (
          <ClientInformationForm 
            onSubmit={handleClientInfoSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="mt-6 text-center">
            <p className="text-green-600 mb-4">
              ¡Gracias por completar tu información! Hemos enviado los detalles de tu reserva a tu correo electrónico.
            </p>
            <Button onClick={onNewQuote} variant="outline">
              Realizar otra reserva
            </Button>
          </div>
        )}
      </div>
    );
  }
);

ReservationConfirmation.displayName = "ReservationConfirmation";


import { forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail, MessageSquare } from "lucide-react";

interface ReservationConfirmationProps {
  startDate?: Date;
  endDate?: Date;
  guests: number;
  quote: any;
  paymentDetails: any;
  onNewQuote: () => void;
}

export const ReservationConfirmation = forwardRef<HTMLDivElement, ReservationConfirmationProps>(
  ({ startDate, endDate, guests, quote, paymentDetails, onNewQuote }, ref) => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isContactInfoSent, setIsContactInfoSent] = useState(false);

    const handleSendDetails = async () => {
      if (!email || !phone) {
        toast.error("Por favor, completa todos los campos");
        return;
      }

      setIsSending(true);
      try {
        // Send email confirmation
        const emailResponse = await fetch("https://gtxjfmvnzrsuaxryffnt.supabase.co/functions/v1/send-reservation-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8`
          },
          body: JSON.stringify({
            email,
            phone,
            reservationDetails: {
              startDate: startDate?.toISOString(),
              endDate: endDate?.toISOString(),
              guests,
              totalPrice: quote?.totalPrice,
              paymentDetails: {
                authorization_code: paymentDetails?.authorization_code,
                card_number: paymentDetails?.card_detail?.card_number,
                status: paymentDetails?.status
              }
            }
          })
        });

        if (!emailResponse.ok) {
          throw new Error("Error al enviar el correo electrónico");
        }

        toast.success("¡Información enviada correctamente!", {
          description: "Te hemos enviado un correo con los detalles de tu reserva"
        });
        setIsContactInfoSent(true);
      } catch (error) {
        console.error("Error sending reservation details:", error);
        toast.error("Error al enviar la información", {
          description: "Por favor, intenta nuevamente más tarde"
        });
      } finally {
        setIsSending(false);
      }
    };

    const openWhatsApp = () => {
      if (!phone) {
        toast.error("Por favor, ingresa tu número de teléfono primero");
        return;
      }
      
      // Format phone for WhatsApp - remove any non-numeric characters
      const formattedPhone = phone.replace(/\D/g, "");
      // Add country code if not present
      const whatsappPhone = formattedPhone.startsWith("56") ? formattedPhone : `56${formattedPhone}`;
      
      const message = encodeURIComponent(
        `¡Hola! Gracias por tu reserva en Domos TreePod.\n\n` +
        `Fechas: ${startDate?.toLocaleDateString()} al ${endDate?.toLocaleDateString()}\n` +
        `Huéspedes: ${guests}\n` +
        `Total: $${quote?.totalPrice.toLocaleString()}\n\n` +
        `Para cualquier consulta, estamos a tu disposición.`
      );
      
      window.open(`https://wa.me/${whatsappPhone}?text=${message}`, "_blank");
    };

    return (
      <div ref={ref} className="text-center p-8 space-y-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-display font-bold">¡Reserva confirmada!</h2>
        <p>
          Gracias por tu reserva en Domos TreePod. 
        </p>
        
        <div className="text-sm text-muted-foreground mt-4 space-y-2">
          <p>Fechas reservadas:</p>
          <p>Entrada: {startDate?.toLocaleDateString()}</p>
          <p>Salida: {endDate?.toLocaleDateString()}</p>
          <p>Huéspedes: {guests}</p>
          <p className="font-semibold mt-2">Total: ${quote?.totalPrice.toLocaleString()}</p>
          
          {paymentDetails && (
            <div className="mt-4 pt-4 border-t text-left">
              <p className="font-semibold mb-2">Detalles del pago:</p>
              <p>Método: WebPay Plus</p>
              <p>Tarjeta: {paymentDetails.card_detail?.card_number}</p>
              <p>Código de autorización: {paymentDetails.authorization_code}</p>
              <p>Estado: {paymentDetails.status}</p>
            </div>
          )}
        </div>
        
        {!isContactInfoSent ? (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Ingresa tus datos para recibir la confirmación</h3>
            <div className="space-y-4">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div className="text-left">
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Número de teléfono (WhatsApp)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  required
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleSendDetails}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar detalles de reserva"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t space-y-4">
            <p className="text-green-600 font-medium">¡Información enviada correctamente!</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={openWhatsApp} variant="outline" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Abrir WhatsApp
              </Button>
              
              <Button 
                onClick={() => window.open(`mailto:${email}`, "_blank")} 
                variant="outline"
                className="flex items-center"
              >
                <Mail className="mr-2 h-4 w-4" />
                Abrir Email
              </Button>
            </div>
          </div>
        )}
        
        <Button className="mt-6" onClick={onNewQuote}>
          Hacer nueva reserva
        </Button>
      </div>
    );
  }
);

ReservationConfirmation.displayName = "ReservationConfirmation";

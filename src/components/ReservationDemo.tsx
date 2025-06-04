import React, { useState } from 'react';
import { useReservations, useReservationFunctions } from "@/hooks/reservations";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { AvailabilityResult } from '@/types';

export const ReservationDemo = () => {
  const { data: reservations = [], isLoading } = useReservations();
  const { createReservation, checkAvailability } = useReservationFunctions();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);

  // Domo de prueba
  const demoUnit = {
    id: "1",
    name: "Domo 1",
    price: 75000
  };

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Por favor selecciona las fechas de entrada y salida");
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkAvailability(guests, checkIn, checkOut);
      setAvailability(result);
      
      if (result.isAvailable) {
        toast.success("¡Las fechas están disponibles!");
      } else {
        toast.error(result.error || "Lo sentimos, estas fechas no están disponibles");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error al verificar disponibilidad");
    } finally {
      setIsChecking(false);
    }
  };

  const handleCreateReservation = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Por favor selecciona las fechas de entrada y salida");
      return;
    }

    if (!availability?.isAvailable) {
      toast.error("Por favor verifica la disponibilidad primero");
      return;
    }

    try {
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * demoUnit.price * (availability.requiredDomos || 1);

      const reservation = await createReservation(
        demoUnit.id,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        'webpay',
        [],
        [],
        availability.requiredDomos
      );

      if (reservation) {
        toast.success("¡Reserva creada exitosamente!");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error al crear la reserva");
    }
  };

  return (
    <div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Demo de Sistema de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Información del Domo */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">{demoUnit.name}</h3>
              <p className="text-sm text-gray-600">
                Precio por noche: ${demoUnit.price.toLocaleString('es-CL')}
              </p>
            </div>

            {/* Selector de Fechas */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Fecha de Entrada</Label>
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  locale={es}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha de Salida</Label>
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  locale={es}
                  disabled={(date) => !checkIn || date <= checkIn}
                  className="rounded-md border"
                />
              </div>
            </div>

            {/* Número de Huéspedes */}
            <div className="space-y-2">
              <Label>Número de Huéspedes</Label>
              <Input
                type="number"
                min="1"
                max="16"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Estado de Disponibilidad */}
            {availability && (
              <div className={`p-4 rounded-lg ${
                availability.isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {availability.isAvailable 
                  ? `✅ Hay ${availability.availableDomes} domos disponibles. Se requieren ${availability.requiredDomos} domos para ${guests} huéspedes.`
                  : `❌ ${availability.error || 'Las fechas no están disponibles.'}`}
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex gap-4">
              <Button
                onClick={handleCheckAvailability}
                disabled={!checkIn || !checkOut || isChecking}
                variant="outline"
                className="flex-1"
              >
                {isChecking ? "Verificando..." : "Verificar Disponibilidad"}
              </Button>
              <Button
                onClick={handleCreateReservation}
                disabled={!availability?.isAvailable || isLoading}
                className="flex-1"
              >
                {isLoading ? "Procesando..." : "Crear Reserva"}
              </Button>
            </div>

            {/* Resumen de la Reserva */}
            {checkIn && checkOut && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <h4 className="font-semibold">Resumen de la Reserva</h4>
                <p>Entrada: {format(checkIn, "PPP", { locale: es })}</p>
                <p>Salida: {format(checkOut, "PPP", { locale: es })}</p>
                <p>Huéspedes: {guests}</p>
                <p>Noches: {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))}</p>
                <p>Domos requeridos: {availability?.requiredDomos || 1}</p>
                <p className="font-semibold">
                  Total: ${(Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) * demoUnit.price * (availability?.requiredDomos || 1)).toLocaleString('es-CL')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 

export default ReservationDemo;

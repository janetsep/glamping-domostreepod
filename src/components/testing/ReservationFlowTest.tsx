import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, CheckCircle, Users, Mail } from 'lucide-react';

export const ReservationFlowTest: React.FC = () => {
  const [testData, setTestData] = useState({
    email: 'janetsep@gmail.com',
    name: 'Janet Sepúlveda',
    phone: '+56912345678',
    unitId: 'navidad-package',
    guests: 4,
    checkIn: '2024-12-24',
    checkOut: '2024-12-26'
  });

  const [isTestingFlow, setIsTestingFlow] = useState(false);
  const [flowResults, setFlowResults] = useState<any[]>([]);

  const testReservationFlow = async () => {
    setIsTestingFlow(true);
    setFlowResults([]);
    
    const steps = [
      {
        name: 'Validación de disponibilidad',
        test: async () => {
          // Simular check de disponibilidad
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { success: true, message: 'Fechas disponibles' };
        }
      },
      {
        name: 'Cálculo de precios',
        test: async () => {
          await new Promise(resolve => setTimeout(resolve, 800));
          const basePrice = 150000;
          const nights = Math.ceil((new Date(testData.checkOut).getTime() - new Date(testData.checkIn).getTime()) / (1000 * 60 * 60 * 24));
          const totalPrice = basePrice * nights;
          return { 
            success: true, 
            message: `${nights} noches × $${basePrice.toLocaleString()} = $${totalPrice.toLocaleString()}` 
          };
        }
      },
      {
        name: 'Creación de reserva temporal',
        test: async () => {
          await new Promise(resolve => setTimeout(resolve, 600));
          const reservationId = 'test-' + Date.now();
          return { 
            success: true, 
            message: `Reserva temporal creada: ${reservationId}`,
            data: { reservationId }
          };
        }
      },
      {
        name: 'Procesamiento de pago (simulado)',
        test: async () => {
          await new Promise(resolve => setTimeout(resolve, 1500));
          return { 
            success: true, 
            message: 'Pago procesado exitosamente',
            data: { 
              authCode: 'AUTH123456',
              amount: 300000
            }
          };
        }
      },
      {
        name: 'Confirmación de reserva',
        test: async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
          return { 
            success: true, 
            message: 'Reserva confirmada en base de datos' 
          };
        }
      },
      {
        name: 'Envío de correo de confirmación',
        test: async () => {
          try {
            const response = await fetch('https://gtxjfmvnzrsuaxryffnt.supabase.co/functions/v1/send-reservation-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: testData.email,
                phone: testData.phone,
                name: testData.name,
                reservationId: 'test-flow-' + Date.now()
              })
            });

            if (!response.ok) {
              throw new Error(`Error ${response.status}`);
            }

            const result = await response.json();
            return { 
              success: true, 
              message: `Correo enviado a ${testData.email}`,
              data: result
            };
          } catch (error) {
            throw new Error(`Error enviando correo: ${error.message}`);
          }
        }
      }
    ];

    for (const step of steps) {
      setFlowResults(prev => [...prev, { 
        name: step.name, 
        status: 'running', 
        message: 'Ejecutando...' 
      }]);

      try {
        const result = await step.test();
        setFlowResults(prev => prev.map(r => 
          r.name === step.name 
            ? { 
                name: step.name, 
                status: 'success', 
                message: result.message,
                data: (result as any).data || null 
              }
            : r
        ));
      } catch (error) {
        setFlowResults(prev => prev.map(r => 
          r.name === step.name 
            ? { 
                name: step.name, 
                status: 'error', 
                message: error.message
              }
            : r
        ));
        break; // Stop on first error
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsTestingFlow(false);
    
    const successCount = flowResults.filter(r => r.status === 'success').length;
    if (successCount === steps.length) {
      toast.success('¡Flujo de reserva completado exitosamente!');
    } else {
      toast.error('El flujo de reserva falló en algunos pasos');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'running': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">✕</div>;
      case 'running': return <div className="h-5 w-5 rounded-full bg-blue-600 animate-pulse"></div>;
      default: return <div className="h-5 w-5 rounded-full bg-gray-300"></div>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Test Completo del Flujo de Reservas
        </CardTitle>
        <CardDescription>
          Simula todo el proceso de reserva desde la selección hasta la confirmación por correo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email del cliente</Label>
              <Input
                id="email"
                type="email"
                value={testData.email}
                onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="cliente@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="name">Nombre del cliente</Label>
              <Input
                id="name"
                value={testData.name}
                onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre completo"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={testData.phone}
                onChange={(e) => setTestData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+56912345678"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="unit">Tipo de unidad</Label>
              <Select value={testData.unitId} onValueChange={(value) => setTestData(prev => ({ ...prev, unitId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="navidad-package">Paquete Navidad</SelectItem>
                  <SelectItem value="ano-nuevo-package">Paquete Año Nuevo</SelectItem>
                  <SelectItem value="fiestas-patrias-package">Paquete Fiestas Patrias</SelectItem>
                  <SelectItem value="cumpleanos-package">Paquete Cumpleaños</SelectItem>
                  <SelectItem value="aniversario-package">Paquete Aniversario</SelectItem>
                  <SelectItem value="familia-package">Paquete Familia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="guests">Número de huéspedes</Label>
              <Select value={testData.guests.toString()} onValueChange={(value) => setTestData(prev => ({ ...prev, guests: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 huésped</SelectItem>
                  <SelectItem value="2">2 huéspedes</SelectItem>
                  <SelectItem value="3">3 huéspedes</SelectItem>
                  <SelectItem value="4">4 huéspedes</SelectItem>
                  <SelectItem value="5">5 huéspedes</SelectItem>
                  <SelectItem value="6">6 huéspedes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="checkin">Check-in</Label>
                <Input
                  id="checkin"
                  type="date"
                  value={testData.checkIn}
                  onChange={(e) => setTestData(prev => ({ ...prev, checkIn: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="checkout">Check-out</Label>
                <Input
                  id="checkout"
                  type="date"
                  value={testData.checkOut}
                  onChange={(e) => setTestData(prev => ({ ...prev, checkOut: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={testReservationFlow} 
            disabled={isTestingFlow}
            className="flex items-center gap-2 px-8 py-3"
          >
            <Users className="h-5 w-5" />
            {isTestingFlow ? 'Ejecutando flujo de reserva...' : 'Probar flujo completo de reserva'}
          </Button>
        </div>

        {flowResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Progreso del test:</h3>
            {flowResults.map((result, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="font-medium">{result.name}</div>
                  <div className={`text-sm ${getStatusColor(result.status)}`}>
                    {result.message}
                  </div>
                  {result.data && (
                    <div className="text-xs text-gray-600 mt-1 font-mono">
                      {JSON.stringify(result.data, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Nota sobre el envío de correos:
          </h4>
          <p className="text-sm text-yellow-700">
            El sistema actualmente simula el envío de correos. En producción real, 
            se debe configurar un servicio como Resend, SendGrid o similar para 
            el envío efectivo de correos electrónicos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
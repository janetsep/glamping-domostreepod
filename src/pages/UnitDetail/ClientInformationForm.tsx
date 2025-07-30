
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeInput, validateEmail, validatePhone, validateName } from "@/utils/security";
import { INPUT_MAX_LENGTHS } from "@/lib/constants";

interface ClientInformationFormProps {
  onSubmit: (clientInfo: { name: string; email: string; phone: string }) => void;
  isSubmitting: boolean;
  initialValues?: { name: string; email: string; phone: string };
}

export const ClientInformationForm = ({ 
  onSubmit, 
  isSubmitting, 
  initialValues 
}: ClientInformationFormProps) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [phone, setPhone] = useState(initialValues?.phone || "");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      if (initialValues.name) setName(initialValues.name);
      if (initialValues.email) setEmail(initialValues.email);
      if (initialValues.phone) setPhone(initialValues.phone);
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
    } = {};
    
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    
    if (!sanitizedName) {
      newErrors.name = "El nombre es obligatorio";
    } else if (!validateName(sanitizedName)) {
      newErrors.name = "El nombre no es válido (solo letras y espacios, 2-50 caracteres)";
    }
    
    if (!sanitizedEmail) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!validateEmail(sanitizedEmail)) {
      newErrors.email = "El correo electrónico no es válido";
    }
    
    if (!sanitizedPhone) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!validatePhone(sanitizedPhone)) {
      newErrors.phone = "El teléfono no es válido (8-15 dígitos)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Sanitize inputs before submission
      onSubmit({ 
        name: sanitizeInput(name), 
        email: sanitizeInput(email), 
        phone: sanitizeInput(phone) 
      });
    }
  };

  return (
    <Card className="p-6 bg-white">
      <h3 className="text-xl font-semibold mb-4">Información de contacto</h3>
      <p className="text-sm text-gray-600 mb-4">
        Para completar tu reserva, por favor ingresa tus datos de contacto:
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            placeholder="Ej: Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-red-500" : ""}
            maxLength={INPUT_MAX_LENGTHS.name}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ej: correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-red-500" : ""}
            maxLength={INPUT_MAX_LENGTHS.email}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            placeholder="Ej: +56 9 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
            maxLength={INPUT_MAX_LENGTHS.phone}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar información"}
        </Button>
      </form>
    </Card>
  );
};

-- Agregar campo para categorizar el tipo de reserva
ALTER TABLE public.reservations 
ADD COLUMN reservation_type TEXT DEFAULT 'normal';

-- Crear un tipo enum para los tipos de reserva
CREATE TYPE public.reservation_type_enum AS ENUM ('normal', 'celebracion', 'actividad', 'romance', 'familia', 'especial');

-- Actualizar la columna para usar el enum
ALTER TABLE public.reservations 
ALTER COLUMN reservation_type TYPE reservation_type_enum 
USING reservation_type::reservation_type_enum;

-- Agregar comentario para documentar los tipos
COMMENT ON COLUMN public.reservations.reservation_type IS 'Tipo de reserva: normal, celebracion, actividad, romance, familia, especial';
-- Crear el tipo enum primero
CREATE TYPE public.reservation_type_enum AS ENUM ('normal', 'celebracion', 'actividad', 'romance', 'familia', 'especial');

-- Agregar campo para categorizar el tipo de reserva usando el enum directamente
ALTER TABLE public.reservations 
ADD COLUMN reservation_type reservation_type_enum DEFAULT 'normal';

-- Agregar comentario para documentar los tipos
COMMENT ON COLUMN public.reservations.reservation_type IS 'Tipo de reserva: normal, celebracion, actividad, romance, familia, especial';
-- Eliminar la función en cascada para eliminar también el trigger
DROP FUNCTION IF EXISTS public.generate_reservation_code() CASCADE;
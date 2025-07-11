-- Eliminar el trigger que sobrescribe el reservation_code
DROP TRIGGER IF EXISTS generate_reservation_code_trigger ON public.reservations;

-- También eliminar la función si existe
DROP FUNCTION IF EXISTS public.generate_reservation_code();
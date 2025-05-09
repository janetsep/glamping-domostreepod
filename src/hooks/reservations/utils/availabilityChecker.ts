
/**
 * @deprecated Este archivo ha sido refactorizado.
 * Usa las funciones de la carpeta availability en su lugar.
 */

// Re-exportamos todo desde el nuevo módulo para mantener compatibilidad
export { 
  TOTAL_DOMOS,
  checkUnitAvailability,
  checkGeneralAvailability,
  findAlternativeDates
} from './availability';

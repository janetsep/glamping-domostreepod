
// This file re-exports all availability checker functions for backward compatibility
// This ensures we don't break existing functionality while improving code organization

export { TOTAL_DOMOS } from './constants';
export { checkUnitAvailability } from './unitAvailability';
export { checkGeneralAvailability } from './generalAvailability';
export { findAlternativeDates } from './alternativeDates';

import { VALIDATION_PATTERNS, INPUT_MAX_LENGTHS } from '@/lib/constants';

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags completely
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=\s*[^>\s]+/gi, '') // Remove event handlers more comprehensively
    .replace(/style\s*=\s*[^>\s]+/gi, '') // Remove style attributes
    .replace(/src\s*=\s*[^>\s]+/gi, '') // Remove src attributes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim(); // Final trim
};

// Validate email
export const validateEmail = (email: string): boolean => {
  return VALIDATION_PATTERNS.email.test(email);
};

// Validate phone
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\s/g, '');
  return VALIDATION_PATTERNS.phone.test(cleanPhone);
};

// Validate name
export const validateName = (name: string): boolean => {
  return VALIDATION_PATTERNS.name.test(name) && name.length <= INPUT_MAX_LENGTHS.name;
};

// Validate RUT (Chilean ID)
export const validateRut = (rut: string): boolean => {
  if (!VALIDATION_PATTERNS.rut.test(rut)) return false;
  
  const [number, verifier] = rut.split('-');
  let sum = 0;
  let multiplier = 2;
  
  for (let i = number.length - 1; i >= 0; i--) {
    sum += parseInt(number[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedVerifier = 11 - (sum % 11);
  const actualVerifier = verifier.toLowerCase() === 'k' ? 10 : parseInt(verifier);
  
  if (expectedVerifier === 11) return actualVerifier === 0;
  if (expectedVerifier === 10) return actualVerifier === 10;
  
  return expectedVerifier === actualVerifier;
};

// Sanitize and validate client information
export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  rut?: string;
}

export const sanitizeClientInfo = (info: ClientInfo): ClientInfo => {
  return {
    name: sanitizeInput(info.name).substring(0, INPUT_MAX_LENGTHS.name),
    email: sanitizeInput(info.email).substring(0, INPUT_MAX_LENGTHS.email),
    phone: sanitizeInput(info.phone).substring(0, INPUT_MAX_LENGTHS.phone),
    rut: info.rut ? sanitizeInput(info.rut) : undefined
  };
};

export const validateClientInfo = (info: ClientInfo): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!info.name || !validateName(info.name)) {
    errors.name = 'Nombre inválido (solo letras y espacios, 2-50 caracteres)';
  }
  
  if (!info.email || !validateEmail(info.email)) {
    errors.email = 'Correo electrónico inválido';
  }
  
  if (!info.phone || !validatePhone(info.phone)) {
    errors.phone = 'Teléfono inválido (8-15 dígitos)';
  }
  
  if (info.rut && !validateRut(info.rut)) {
    errors.rut = 'RUT inválido';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

// Rate limiting helper
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (identifier: string, maxRequests = 10, windowMs = 60000): boolean => {
  const now = Date.now();
  const record = requestCounts.get(identifier);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

// SQL injection prevention (for dynamic queries if needed)
export const escapeSqlString = (str: string): string => {
  return str.replace(/['";\\]/g, '\\$&');
};

// CSRF token generation
export const generateCSRFToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Validate CSRF token
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length === 64;
};
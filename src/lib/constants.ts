
// Environment variables - MUST be set in .env file
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// WebPay Configuration - MUST be set in .env file
export const WEBPAY_COMMERCE_CODE = import.meta.env.VITE_WEBPAY_COMMERCE_CODE || '';
export const WEBPAY_API_KEY = import.meta.env.VITE_WEBPAY_API_KEY || '';

// Environment
export const IS_PRODUCTION = import.meta.env.VITE_ENVIRONMENT === 'production';
export const IS_DEVELOPMENT = import.meta.env.VITE_ENVIRONMENT !== 'production';

// Security headers
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.transbank.cl; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://*.transbank.cl;"
};

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+0-9]{8,15}$/,
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  rut: /^[0-9]{7,8}-[0-9kK]$/
};

// Max lengths for inputs
export const INPUT_MAX_LENGTHS = {
  name: 50,
  email: 100,
  phone: 15,
  message: 500
};

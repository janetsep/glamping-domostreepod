
// Supabase configuration
export const SUPABASE_URL = "https://gtxjfmvnzrsuaxryffnt.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGpmbXZuenJzdWF4cnlmZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTg5ODIsImV4cCI6MjA1NjA5NDk4Mn0.WwPCyeZX42Jp4A4lW0jl7arXt0lzwRwm18-Ay_D4Ci8";

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

import { describe, test, expect } from 'vitest';
import { 
  sanitizeInput, 
  validateEmail, 
  validatePhone, 
  validateName,
  validateClientInfo,
  sanitizeClientInfo,
  checkRateLimit
} from '../utils/security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    test('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      const result = sanitizeInput(input);
      expect(result).toBe('alert("xss")Hello');
    });

    test('should remove javascript: protocol', () => {
      const input = 'javascript:alert("xss")';
      const result = sanitizeInput(input);
      expect(result).toBe('alert("xss")');
    });

    test('should remove event handlers', () => {
      const input = 'onclick="alert(1)" onload="bad()"';
      const result = sanitizeInput(input);
      expect(result).toBe('');
    });

    test('should preserve normal text', () => {
      const input = 'Normal user input';
      const result = sanitizeInput(input);
      expect(result).toBe('Normal user input');
    });
  });

  describe('validateEmail', () => {
    test('should validate correct emails', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true);
    });

    test('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    test('should validate correct phone numbers', () => {
      expect(validatePhone('+56912345678')).toBe(true);
      expect(validatePhone('12345678')).toBe(true);
      expect(validatePhone('+1234567890123')).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false); // Too short
      expect(validatePhone('1234567890123456')).toBe(false); // Too long
      expect(validatePhone('abc123456789')).toBe(false); // Contains letters
    });
  });

  describe('validateName', () => {
    test('should validate correct names', () => {
      expect(validateName('Juan Pérez')).toBe(true);
      expect(validateName('María José')).toBe(true);
      expect(validateName('José')).toBe(true);
    });

    test('should reject invalid names', () => {
      expect(validateName('A')).toBe(false); // Too short
      expect(validateName('Juan123')).toBe(false); // Contains numbers
      expect(validateName('')).toBe(false); // Empty
      expect(validateName('a'.repeat(51))).toBe(false); // Too long
    });
  });

  describe('validateClientInfo', () => {
    test('should validate correct client info', () => {
      const validInfo = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+56912345678'
      };
      
      const result = validateClientInfo(validInfo);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test('should reject invalid client info', () => {
      const invalidInfo = {
        name: 'A',
        email: 'invalid-email',
        phone: '123'
      };
      
      const result = validateClientInfo(invalidInfo);
      expect(result.valid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.phone).toBeDefined();
    });
  });

  describe('sanitizeClientInfo', () => {
    test('should sanitize client information', () => {
      const dirtyInfo = {
        name: '<script>alert(1)</script>Juan',
        email: 'user@example.com<script>',
        phone: '+56912345678onclick="bad()"'
      };
      
      const result = sanitizeClientInfo(dirtyInfo);
      expect(result.name).toBe('alert(1)Juan');
      expect(result.email).toBe('user@example.com');
      expect(result.phone).toBe('+56912345678');
    });

    test('should enforce max lengths', () => {
      const longInfo = {
        name: 'a'.repeat(100),
        email: 'b'.repeat(100) + '@example.com',
        phone: '1'.repeat(100)
      };
      
      const result = sanitizeClientInfo(longInfo);
      expect(result.name.length).toBeLessThanOrEqual(50);
      expect(result.email.length).toBeLessThanOrEqual(100);
      expect(result.phone.length).toBeLessThanOrEqual(15);
    });
  });

  describe('checkRateLimit', () => {
    test('should allow requests within limit', () => {
      const identifier = 'test-user-1';
      
      // First few requests should be allowed
      for (let i = 0; i < 5; i++) {
        expect(checkRateLimit(identifier, 10, 60000)).toBe(true);
      }
    });

    test('should block requests over limit', () => {
      const identifier = 'test-user-2';
      
      // Use up all requests
      for (let i = 0; i < 10; i++) {
        checkRateLimit(identifier, 10, 60000);
      }
      
      // Next request should be blocked
      expect(checkRateLimit(identifier, 10, 60000)).toBe(false);
    });

    test('should reset after time window', async () => {
      const identifier = 'test-user-3';
      
      // Use up all requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit(identifier, 5, 100); // Short window for testing
      }
      
      // Should be blocked initially
      expect(checkRateLimit(identifier, 5, 100)).toBe(false);
      
      // Wait for window to reset
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(checkRateLimit(identifier, 5, 100)).toBe(true);
    });
  });
});
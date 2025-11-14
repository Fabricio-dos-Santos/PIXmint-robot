import { describe, it, expect } from 'vitest';
import {
  onlyDigits,
  onlyHex,
  formatCPFInput,
  formatPhoneInput,
  formatWalletInput,
  detectPixKeyType,
  formatPixKeyInput,
  getRawPixKey,
  getRawWallet,
} from '../inputMasks';

describe('inputMasks utilities', () => {
  describe('onlyDigits', () => {
    it('should extract only digits', () => {
      expect(onlyDigits('123.456.789-00')).toBe('12345678900');
      expect(onlyDigits('(11) 98765-4321')).toBe('11987654321');
      expect(onlyDigits('abc123def456')).toBe('123456');
      expect(onlyDigits('')).toBe('');
    });
  });

  describe('onlyHex', () => {
    it('should extract only hexadecimal characters', () => {
      expect(onlyHex('0x123abc')).toBe('0123abc'); // 'x' is removed
      expect(onlyHex('ABC123def456')).toBe('abc123def456'); // lowercase
      expect(onlyHex('xyz')).toBe('');
      expect(onlyHex('12G34')).toBe('1234');
    });
  });

  describe('formatCPFInput', () => {
    it('should format CPF with dots and dash', () => {
      expect(formatCPFInput('123')).toBe('123');
      expect(formatCPFInput('12345678')).toBe('123.456.78');
      expect(formatCPFInput('12345678900')).toBe('123.456.789-00');
    });

    it('should handle partial CPF', () => {
      expect(formatCPFInput('1234')).toBe('123.4');
      expect(formatCPFInput('123456')).toBe('123.456');
      expect(formatCPFInput('123456789')).toBe('123.456.789');
    });
  });

  describe('formatPhoneInput', () => {
    it('should format phone with parentheses and dash', () => {
      expect(formatPhoneInput('11')).toBe('11');
      expect(formatPhoneInput('1198765')).toBe('(11) 98765');
      expect(formatPhoneInput('1198765432')).toBe('(11) 9876-5432');
      expect(formatPhoneInput('11987654321')).toBe('(11) 98765-4321');
    });

    it('should handle landline (10 digits)', () => {
      expect(formatPhoneInput('1133334444')).toBe('(11) 3333-4444');
    });
  });

  describe('formatWalletInput', () => {
    it('should add 0x prefix if missing', () => {
      expect(formatWalletInput('1234abcd')).toBe('0x1234abcd');
      expect(formatWalletInput('x1234abcd')).toBe('0x1234abcd');
    });

    it('should keep 0x prefix if present', () => {
      expect(formatWalletInput('0x1234abcd')).toBe('0x1234abcd');
    });

    it('should remove non-hex characters', () => {
      expect(formatWalletInput('0x12G34xyz')).toBe('0x1234');
    });

    it('should limit to 40 hex chars', () => {
      const longAddr = '0x' + 'a'.repeat(50);
      const result = formatWalletInput(longAddr);
      expect(result).toBe('0x' + 'a'.repeat(40));
    });
  });

  describe('detectPixKeyType', () => {
    it('should detect email', () => {
      expect(detectPixKeyType('user@example.com')).toBe('email');
      expect(detectPixKeyType('test@domain.com.br')).toBe('email');
    });

    it('should detect CPF (11 digits)', () => {
      expect(detectPixKeyType('12345678900')).toBe('cpf'); // Not a phone pattern
      expect(detectPixKeyType('123.456.789-00')).toBe('cpf');
    });

    it('should detect phone (10 or 11 digits)', () => {
      expect(detectPixKeyType('11987654321')).toBe('phone');
      expect(detectPixKeyType('(11) 98765-4321')).toBe('phone');
      expect(detectPixKeyType('1133334444')).toBe('phone');
    });

    it('should detect random key', () => {
      expect(detectPixKeyType('abc123xyz')).toBe('random');
      expect(detectPixKeyType('random-key-12345')).toBe('random');
    });
  });

  describe('formatPixKeyInput', () => {
    it('should format CPF', () => {
      expect(formatPixKeyInput('12345678900')).toBe('123.456.789-00');
    });

    it('should format phone', () => {
      expect(formatPixKeyInput('11987654321')).toBe('(11) 98765-4321');
    });

    it('should not format email', () => {
      expect(formatPixKeyInput('user@example.com')).toBe('user@example.com');
    });

    it('should not format random key', () => {
      expect(formatPixKeyInput('random-key')).toBe('random-key');
    });
  });

  describe('getRawPixKey', () => {
    it('should extract raw CPF', () => {
      expect(getRawPixKey('123.456.789-00')).toBe('12345678900');
    });

    it('should extract raw phone', () => {
      expect(getRawPixKey('(11) 98765-4321')).toBe('11987654321');
    });

    it('should keep email unchanged', () => {
      expect(getRawPixKey('user@example.com')).toBe('user@example.com');
    });

    it('should keep random key unchanged', () => {
      expect(getRawPixKey('random-key')).toBe('random-key');
    });
  });

  describe('getRawWallet', () => {
    it('should keep valid wallet unchanged', () => {
      const wallet = '0x1234567890abcdef1234567890abcdef12345678';
      expect(getRawWallet(wallet)).toBe(wallet);
    });

    it('should clean invalid characters', () => {
      expect(getRawWallet('0x12G34xyz')).toBe('0x1234');
    });
  });
});

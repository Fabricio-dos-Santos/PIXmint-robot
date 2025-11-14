import { describe, it, expect } from 'vitest';
import {
  validateName,
  validatePixKey,
  validateWallet,
  validateNetwork
} from '../fieldValidation';

describe('validateName - UX validation only', () => {
  it('should reject empty name', () => {
    const result = validateName('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Nome é obrigatório');
  });

  it('should reject name with only spaces', () => {
    const result = validateName('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Nome é obrigatório');
  });

  it('should reject name with less than 3 characters', () => {
    const result = validateName('Jo');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Nome deve ter pelo menos 3 caracteres');
  });

  it('should accept valid name (backend validates business rules)', () => {
    const result = validateName('João Silva');
    expect(result.isValid).toBe(true);
  });

  it('should accept single name (backend will validate)', () => {
    const result = validateName('Ana');
    expect(result.isValid).toBe(true);
  });

  it('should accept name with numbers (backend will validate)', () => {
    const result = validateName('João123');
    expect(result.isValid).toBe(true);
  });
});

describe('validatePixKey - UX validation only', () => {
  it('should reject empty PIX key', () => {
    const result = validatePixKey('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Chave PIX é obrigatória');
  });

  it('should reject PIX key with only spaces', () => {
    const result = validatePixKey('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Chave PIX é obrigatória');
  });

  it('should accept any non-empty PIX key (backend validates format)', () => {
    expect(validatePixKey('test@example.com').isValid).toBe(true);
    expect(validatePixKey('12345678900').isValid).toBe(true);
    expect(validatePixKey('(11) 98765-4321').isValid).toBe(true);
    expect(validatePixKey('random-key').isValid).toBe(true);
  });
});

describe('validateWallet - UX validation only', () => {
  it('should reject empty wallet', () => {
    const result = validateWallet('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Wallet é obrigatória');
  });

  it('should reject wallet without 0x prefix', () => {
    const result = validateWallet('1234567890abcdef1234567890abcdef12345678');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('deve começar com 0x');
  });

  it('should reject wallet with incorrect length', () => {
    const result = validateWallet('0x123');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('42 caracteres');
  });

  it('should accept wallet with correct format (backend validates hex)', () => {
    const result = validateWallet('0x1234567890abcdef1234567890abcdef12345678');
    expect(result.isValid).toBe(true);
  });
});

describe('validateNetwork - UX validation only', () => {
  it('should reject empty network', () => {
    const result = validateNetwork('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Network é obrigatória');
  });

  it('should accept any non-empty network (backend validates options)', () => {
    expect(validateNetwork('sepolia').isValid).toBe(true);
    expect(validateNetwork('ethereum').isValid).toBe(true);
    expect(validateNetwork('invalid').isValid).toBe(true);
  });
});

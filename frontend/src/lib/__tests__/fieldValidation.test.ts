import { describe, it, expect } from 'vitest';
import {
  validateName,
  validatePixKey,
  validateWallet,
  validateNetwork
} from '../fieldValidation';

describe('validateName', () => {
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

  it('should reject single name (needs first and last)', () => {
    const result = validateName('Ana');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Informe nome e sobrenome');
  });

  it('should reject name with 2-letter words that are not articles', () => {
    const result = validateName('Fa do Sa');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Cada nome deve ter pelo menos 3 caracteres');
  });

  it('should accept valid full name', () => {
    const result = validateName('João Silva');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept name with accents', () => {
    const result = validateName('José María');
    expect(result.isValid).toBe(true);
  });

  it('should accept name with hyphen', () => {
    const result = validateName('Ana-Clara Santos');
    expect(result.isValid).toBe(true);
  });

  it('should accept name with apostrophe', () => {
    const result = validateName("D'Angelo Silva");
    expect(result.isValid).toBe(true);
  });

  it('should accept compound names', () => {
    const result = validateName('Maria da Silva Santos');
    expect(result.isValid).toBe(true);
  });

  it('should reject name with numbers', () => {
    const result = validateName('João Silva123');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('apenas letras');
  });

  it('should reject name with special characters', () => {
    const result = validateName('João@Silva');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('apenas letras');
  });

  it('should reject name with consecutive spaces', () => {
    const result = validateName('João  Silva');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('espaços consecutivos');
  });

  it('should reject name with word less than 2 characters', () => {
    const result = validateName('João A Silva');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('pelo menos 3 caracteres');
  });

  it('should reject name ending with preposition "dos"', () => {
    const result = validateName('Fabricio dos');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('sobrenome completo');
  });

  it('should reject name ending with preposition "das"', () => {
    const result = validateName('Maria das');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('sobrenome completo');
  });

  it('should reject name ending with preposition "de"', () => {
    const result = validateName('João de');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('sobrenome completo');
  });

  it('should accept complete name with preposition in middle', () => {
    const result = validateName('Fabricio dos Santos');
    expect(result.isValid).toBe(true);
  });

  it('should accept complete name with multiple prepositions', () => {
    const result = validateName('Maria das Graças de Souza');
    expect(result.isValid).toBe(true);
  });

  it('should reject name over 100 characters', () => {
    const result = validateName('Jo ão'.repeat(50));
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Nome deve ter no máximo 100 caracteres');
  });
});

describe('validatePixKey - CPF', () => {
  it('should reject CPF with all same digits', () => {
    const result = validatePixKey('111.111.111-11');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('CPF inválido');
  });

  it('should accept valid CPF format', () => {
    const result = validatePixKey('123.456.789-01');
    expect(result.isValid).toBe(true);
  });

  it('should accept valid CPF without formatting', () => {
    const result = validatePixKey('12345678901');
    expect(result.isValid).toBe(true);
  });
});

describe('validatePixKey - Phone', () => {
  it('should accept valid 11-digit phone', () => {
    const result = validatePixKey('(11) 98765-4321');
    expect(result.isValid).toBe(true);
  });

  it('should accept valid 10-digit phone', () => {
    const result = validatePixKey('(11) 8765-4321');
    expect(result.isValid).toBe(true);
  });
});

describe('validatePixKey - Email', () => {
  it('should reject email without @', () => {
    const result = validatePixKey('test.example.com');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Chave aleatória inválida');
  });

  it('should reject email without dot after @', () => {
    const result = validatePixKey('test@example');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Email inválido');
  });

  it('should accept valid email', () => {
    const result = validatePixKey('test@example.com');
    expect(result.isValid).toBe(true);
  });

  it('should accept email with subdomain', () => {
    const result = validatePixKey('user@mail.example.com');
    expect(result.isValid).toBe(true);
  });

  it('should reject email with empty local part', () => {
    const result = validatePixKey('@example.com');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Email inválido');
  });

  it('should reject email with empty domain', () => {
    const result = validatePixKey('test@');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Email inválido');
  });
});

describe('validatePixKey - Random Key', () => {
  it('should reject random key with less than 32 characters', () => {
    const result = validatePixKey('abc123');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Chave aleatória inválida');
  });

  it('should accept valid random key (UUID format)', () => {
    const result = validatePixKey('550e8400-e29b-41d4-a716-446655440000');
    expect(result.isValid).toBe(true);
  });

  it('should accept random key without dashes', () => {
    const result = validatePixKey('550e8400e29b41d4a716446655440000');
    expect(result.isValid).toBe(true);
  });

  it('should reject random key with special characters', () => {
    const result = validatePixKey('550e8400@e29b!41d4#a716$446655440000');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Email inválido'); // Has @, detected as email but invalid
  });
});

describe('validatePixKey - General', () => {
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
});

describe('validateWallet', () => {
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

  it('should reject wallet with non-hex characters', () => {
    const result = validateWallet('0x1234567890abcdefGHIJ567890abcdef12345678');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('hexadecimais');
  });

  it('should accept valid wallet', () => {
    const result = validateWallet('0x1234567890abcdef1234567890abcdef12345678');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept wallet with uppercase hex', () => {
    const result = validateWallet('0x1234567890ABCDEF1234567890ABCDEF12345678');
    expect(result.isValid).toBe(true);
  });

  it('should accept wallet with mixed case', () => {
    const result = validateWallet('0x1234567890aBcDeF1234567890AbCdEf12345678');
    expect(result.isValid).toBe(true);
  });
});

describe('validateNetwork', () => {
  it('should reject empty network', () => {
    const result = validateNetwork('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Network é obrigatória');
  });

  it('should reject invalid network', () => {
    const result = validateNetwork('invalid-network');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('deve ser uma das opções');
  });

  it('should accept sepolia', () => {
    const result = validateNetwork('sepolia');
    expect(result.isValid).toBe(true);
  });

  it('should accept ethereum', () => {
    const result = validateNetwork('ethereum');
    expect(result.isValid).toBe(true);
  });

  it('should accept polygon', () => {
    const result = validateNetwork('polygon');
    expect(result.isValid).toBe(true);
  });

  it('should accept arbitrum', () => {
    const result = validateNetwork('arbitrum');
    expect(result.isValid).toBe(true);
  });

  it('should accept bnb', () => {
    const result = validateNetwork('bnb');
    expect(result.isValid).toBe(true);
  });

  it('should accept base', () => {
    const result = validateNetwork('base');
    expect(result.isValid).toBe(true);
  });
});

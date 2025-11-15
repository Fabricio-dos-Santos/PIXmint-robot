import { describe, it, expect } from 'vitest';
import { maskWallet, isWallet, isEmail, maskEmail, isCPF, maskCPFDisplay, isCNPJ, maskCNPJDisplay } from '../pixKeyUtils';

describe('pixKeyUtils', () => {
  it('maskWallet preserves 0x and shows 5...5', () => {
    const w = '0x1234567890abcdef12345';
    expect(isWallet(w)).toBe(true);
    expect(maskWallet(w)).toBe('0x12345...f12345'.replace('f12345', w.slice(-5)));
  });

  it('maskWallet for short wallet returns original', () => {
    const w = '0x1234567';
    expect(maskWallet(w)).toBe(w);
  });

  it('isEmail and maskEmail work', () => {
    const e = 'joao.silva@example.com';
    expect(isEmail(e)).toBe(true);
    const masked = maskEmail(e);
    expect(masked.includes('@example.com')).toBe(true);
    expect(masked.startsWith('jo')).toBe(true);
  });

  it('isCPF and maskCPFDisplay work', () => {
    const cpf = '12345678909';
    expect(isCPF(cpf)).toBe(true);
    expect(isCPF('123.456.789-09')).toBe(true); // with formatting
    expect(isCPF('1234567890')).toBe(false); // 10 digits
    expect(isCPF('123456789012')).toBe(false); // 12 digits
    expect(maskCPFDisplay(cpf)).toBe('123.***.***-09');
  });

  it('isCNPJ and maskCNPJDisplay work', () => {
    const cnpj = '12345678000190';
    expect(isCNPJ(cnpj)).toBe(true);
    expect(isCNPJ('12.345.678/0001-90')).toBe(true); // with formatting
    expect(isCNPJ('12345678900')).toBe(false); // 11 digits (CPF length)
    expect(isCNPJ('123456789012345')).toBe(false); // 15 digits
    expect(maskCNPJDisplay(cnpj)).toBe('12.***.***/****-90');
  });
});

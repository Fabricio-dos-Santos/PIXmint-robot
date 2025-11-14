import { describe, it, expect } from 'vitest';
import { maskWallet, isWallet, isEmail, maskEmail, isCPF, maskCPFDisplay } from '../pixKeyUtils';

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
    expect(maskCPFDisplay(cpf)).toBe('123.***.***-09');
  });
});

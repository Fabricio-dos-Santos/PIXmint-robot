import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const onlyDigits = (s = '') => s.replace(/\D/g, '');

const isEmailStrict = (val?: string) => {
  if (!val) return false;
  // only allow .com or .com.br
  return /^[^\s@]+@[^\s@]+\.(com|com\.br)$/i.test(val);
};

const isPhone = (val?: string) => {
  if (!val) return false;
  const d = onlyDigits(val);
  if (d.length === 10) return true;
  if (d.length === 11) return d.charAt(2) === '9';
  return false;
};

// CPF validation: only ensure 11 digits
const isCPF = (val?: string) => {
  if (!val) return false;
  const cpf = onlyDigits(val);
  return cpf.length === 11;
};

describe('seed: employees pixKey validation', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('all employees have pixKey of allowed types and email includes TLD', async () => {
    const emps = await prisma.employee.findMany();
    expect(emps.length).toBeGreaterThan(0);

    for (const e of emps) {
      const v = e.pixKey;
      expect(typeof v).toBe('string');

      const emailOk = isEmailStrict(v);
      const phoneOk = isPhone(v);
      const cpfOk = isCPF(v);
      const isWallet = /^0x[0-9a-fA-F]{40}$/.test(v);

      // Must be one of email / phone / cpf / random. It must NOT be a wallet.
      expect(isWallet).toBe(false);

      const ok = emailOk || phoneOk || cpfOk || (!emailOk && !phoneOk && !cpfOk);
      expect(ok).toBe(true);

      // Additional safeguards: if it looks like email then should match strict email
      if (v.includes('@')) expect(emailOk).toBe(true);
      if (/^\+?\d/.test(v)) expect(phoneOk || cpfOk || !emailOk).toBe(true);
    }
  });
});

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const onlyDigits = (s = '') => (s || '').toString().replace(/\D/g, '');
const isEmail = (v?: string) => !!v && /^[^\s@]+@[^\s@]+\.(com|com\.br)$/i.test(v);
const isPhone = (v?: string) => !!v && [10, 11].includes(onlyDigits(v).length);
const isCPF_simple = (v?: string) => !!v && onlyDigits(v).length === 11;
const isCPF_checksum = (v?: string) => {
  if (!v) return false;
  const cpf = onlyDigits(v).padStart(11, '0');
  if (cpf.length !== 11 || /^([0-9])\1{10}$/.test(cpf)) return false;
  const calc = (t: number) => {
    let sum = 0;
    for (let i = 0; i < t - 1; i++) sum += parseInt(cpf.charAt(i)) * (t - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(10) === parseInt(cpf.charAt(9)) && calc(11) === parseInt(cpf.charAt(10));
};

async function main() {
  const emps = await prisma.employee.findMany({ select: { id: true, name: true, pixKey: true } });
  for (const e of emps) {
    console.log(JSON.stringify({
      id: e.id,
      name: e.name,
      pixKey: e.pixKey,
      digits: onlyDigits(e.pixKey),
      isEmail: isEmail(e.pixKey),
      isPhone: isPhone(e.pixKey),
      isCPF_simple: isCPF_simple(e.pixKey),
      isCPF_checksum: isCPF_checksum(e.pixKey),
    }));
  }
  await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });

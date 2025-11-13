import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const onlyDigits = (s = '') => s.replace(/\D/g, '');
const isEmail = (v?: string) => !!v && /^[^\s@]+@[^\s@]+\.(com|com\.br)$/i.test(v);
const isPhone = (v?: string) => !!v && [10, 11].includes(onlyDigits(v).length);
// CPF validation using checksum: identify real CPFs even if they are 11 digits
const isCPF = (v?: string) => {
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
  const emps = await prisma.employee.findMany();
  const counts = { email: 0, phone: 0, cpf: 0, random: 0 } as Record<string, number>;
  const cpfItems: Array<{ id: string; pixKey: string | null }> = [];
  for (const e of emps) {
    const v = e.pixKey;
    if (isEmail(v)) counts.email++;
    else if (isPhone(v) && !isCPF(v)) counts.phone++;
    else if (isCPF(v)) { counts.cpf++; cpfItems.push({ id: e.id, pixKey: v ?? null }); }
    else counts.random++;
  }
  console.log('employees:', emps.length);
  console.log('distribution:', counts);
  console.log('cpf items:', cpfItems);
  await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });

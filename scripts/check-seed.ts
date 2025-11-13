import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const onlyDigits = (s = '') => s.replace(/\D/g, '');
const isEmail = (v?: string) => !!v && /^[^\s@]+@[^\s@]+\.(com|com\.br)$/i.test(v);
const isPhone = (v?: string) => {
  if (!v) return false;
  const d = onlyDigits(v);
  if (d.length === 10) return true;
  if (d.length === 11) return d.charAt(2) === '9';
  return false;
};
// Simplified CPF validation: consider CPF when the value contains exactly 11 digits
const isCPF = (v?: string) => !!v && onlyDigits(v).length === 11;

async function main() {
  const emps = await prisma.employee.findMany();
  const counts = { email: 0, phone: 0, cpf: 0, random: 0 } as Record<string, number>;
  const cpfItems: Array<{ id: string; pixKey: string | null }> = [];
  for (const e of emps) {
    const v = e.pixKey;
    if (isEmail(v)) counts.email++;
    else if (isPhone(v)) counts.phone++;
    else if (isCPF(v)) { counts.cpf++; cpfItems.push({ id: e.id, pixKey: v ?? null }); }
    else counts.random++;
  }
  console.log('employees:', emps.length);
  console.log('distribution:', counts);
  console.log('cpf items:', cpfItems);
  await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });

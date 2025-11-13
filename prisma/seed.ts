import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with example employees (12 entries: 3 of each type)...');
  // Generate 12 randomized employees with exactly 3 per pixKey type (email, phone, cpf, random)
  const firstNames = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eva', 'Felipe', 'Gabriela', 'Hugo', 'Inês', 'João', 'Lucas', 'Mariana'];
  const lastNames = ['Silva', 'Costa', 'Mendes', 'Rocha', 'Pereira', 'Sousa', 'Almeida', 'Barbosa', 'Lima', 'Gomes', 'Nogueira', 'Ribeiro'];

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const randomWallet = () => '0x' + Array.from({ length: 40 }).map(() => Math.floor(Math.random() * 16).toString(16)).join('');

  const genEmail = (name: string) => {
    // ensure email ends with .com or .com.br
    const base = `${name.toLowerCase().replace(/\s+/g, '.')}@pix`;
    return Math.random() < 0.5 ? `${base}.com` : `${base}.com.br`;
  };

  const genPhone = () => {
    // Generate an 11-digit Brazilian mobile number (DDD + 9 + 8 digits), prefix 9 (no country code)
    const ddd = String(rand(11, 99)).padStart(2, '0');
    const prefix = '9';
    const rest = String(rand(10000000, 99999999)).padStart(8, '0');
    return `${ddd}${prefix}${rest}`; // e.g. 11991234567
  };

  const genCPF = () => {
    // generate base 9 digits and compute verification digits
    const nums = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    const calcDigit = (arr: number[]) => {
      let sum = 0;
      for (let i = 0; i < arr.length; i++) sum += arr[i] * (arr.length + 1 - i);
      const r = (sum * 10) % 11;
      return r === 10 ? 0 : r;
    };
    const d1 = calcDigit(nums);
    const d2 = calcDigit([...nums, d1]);
    return nums.join('') + String(d1) + String(d2);
  };

  const genRandomKey = () => {
    // a short random hex/key string
    return Array.from({ length: 32 }).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  // Build employees with exactly 3 of each type
  const employees: Array<{ name: string; pixKey: string; wallet: string; network: string } > = [];
  const types: Array<'email' | 'phone' | 'cpf' | 'random'> = [
    'email','email','email',
    'phone','phone','phone',
    'cpf','cpf','cpf',
    'random','random','random'
  ];

  for (let i = 0; i < types.length; i++) {
    const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
    const wallet = randomWallet();
    let pixKey = '';
    switch (types[i]) {
      case 'email': pixKey = genEmail(name); break;
      case 'phone': pixKey = genPhone(); break;
      case 'cpf': pixKey = genCPF(); break;
      case 'random': pixKey = genRandomKey(); break;
    }
    employees.push({ name, pixKey, wallet, network: ['sepolia','ethereum','polygon','arbitrum','bnb','base'][i % 6] });
  }

  // Clear existing test/dev employees to ensure idempotent seed
  await prisma.employee.deleteMany({});

  for (const e of employees) {
    await prisma.employee.create({ data: { name: e.name, pixKey: e.pixKey, wallet: e.wallet, network: e.network as any } });
  }

  const all = await prisma.employee.findMany();
  console.log(`Seeded ${all.length} employees`);
}

main()
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

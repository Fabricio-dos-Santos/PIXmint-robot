import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with example employees...');
  // Generate 10 randomized employees with mixed pixKey types (email, phone, cpf, random, wallet)
  const firstNames = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eva', 'Felipe', 'Gabriela', 'Hugo', 'Inês', 'João'];
  const lastNames = ['Silva', 'Costa', 'Mendes', 'Rocha', 'Pereira', 'Sousa', 'Almeida', 'Barbosa', 'Lima', 'Gomes'];

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const randomWallet = () => '0x' + Array.from({ length: 40 }).map(() => Math.floor(Math.random() * 16).toString(16)).join('');

  const genEmail = (name: string) => `${name.toLowerCase().replace(/\s+/g, '.')}@pix.example`;

  const genPhone = () => {
    // Brazilian-like mobile: DDD (2) + 9 + 8 digits -> total 11
    const ddd = String(rand(11, 99)).padStart(2, '0');
    const prefix = '9';
    const rest = String(rand(10000000, 99999999)).padStart(8, '0');
    return `+55${ddd}${prefix}${rest}`;
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

  const employees: Array<{ name: string; pixKey: string; wallet: string; network: string } > = [];

  for (let i = 0; i < 10; i++) {
    const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
    const wallet = randomWallet();
    const typePick = rand(0, 4); // 0:email 1:phone 2:cpf 3:wallet 4:random
    let pixKey = '';
    switch (typePick) {
      case 0:
        pixKey = genEmail(name);
        break;
      case 1:
        pixKey = genPhone();
        break;
      case 2:
        pixKey = genCPF();
        break;
      case 3:
        pixKey = wallet;
        break;
      default:
        pixKey = genRandomKey();
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

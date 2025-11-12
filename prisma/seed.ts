import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with example employees...');

  const employees = [
    { name: 'Dev Sepolia', pixKey: 'dev1@pix', wallet: '0x' + '1'.repeat(40), network: 'sepolia' },
    { name: 'Dev Ethereum', pixKey: 'dev2@pix', wallet: '0x' + '2'.repeat(40), network: 'ethereum' },
    { name: 'Dev Polygon', pixKey: 'dev3@pix', wallet: '0x' + '3'.repeat(40), network: 'polygon' },
    { name: 'Dev Arbitrum', pixKey: 'dev4@pix', wallet: '0x' + '4'.repeat(40), network: 'arbitrum' },
    { name: 'Dev BNB', pixKey: 'dev5@pix', wallet: '0x' + '5'.repeat(40), network: 'bnb' },
    { name: 'Dev Base', pixKey: 'dev6@pix', wallet: '0x' + '6'.repeat(40), network: 'base' },
  ];

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

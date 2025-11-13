import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with example employees...');

  const employees = [
    { name: 'Ana Silva', pixKey: 'ana.silva@pix', wallet: '0x' + 'a'.repeat(40), network: 'sepolia' },
    { name: 'Bruno Costa', pixKey: 'bruno.costa@pix', wallet: '0x' + 'b'.repeat(40), network: 'ethereum' },
    { name: 'Carla Mendes', pixKey: 'carla.mendes@pix', wallet: '0x' + 'c'.repeat(40), network: 'polygon' },
    { name: 'Diego Rocha', pixKey: 'diego.rocha@pix', wallet: '0x' + 'd'.repeat(40), network: 'arbitrum' },
    { name: 'Eva Pereira', pixKey: 'eva.pereira@pix', wallet: '0x' + 'e'.repeat(40), network: 'bnb' },
    { name: 'Felipe Sousa', pixKey: 'felipe.sousa@pix', wallet: '0x' + 'f'.repeat(40), network: 'base' },
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

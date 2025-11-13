const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.employee.findMany()
  .then(r => {
    console.log(JSON.stringify(r, null, 2));
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => p.$disconnect());

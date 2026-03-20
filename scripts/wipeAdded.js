const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.task.updateMany({
    where: { description: 'Added' },
    data: { description: '' }
  });
  console.log(`Successfully wiped 'Added' from ${result.count} tasks.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

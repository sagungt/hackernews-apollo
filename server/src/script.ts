import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allLinks = await prisma.link.findUnique(
    {
      where: {
        id: 20,
      },
    },
  );
  // eslint-disable-next-line no-console
  console.log(allLinks);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

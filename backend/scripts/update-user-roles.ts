import { prisma } from '../src/db/client';
import { Role } from '@prisma/client';

async function main() {
  const result = await prisma.user.updateMany({
    data: {
      roles: [Role.buyer, Role.seller],
    },
  });
  console.log(`Updated ${result.count} users with dual roles [buyer, seller]`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import * as argon2 from 'argon2';

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const clientPassword = await argon2.hash('ClientPassword123');
  const managerPassword = await argon2.hash('ManagerPassword123');

  await prisma.user.create({
    data: {
      email: 'client@example.com',
      firstName: 'Client',
      lastName: 'User',
      password: clientPassword,
      roles: {
        set: [UserRole.CLIENT],
      },
      isActive: true,
    },
  });

  await prisma.user.create({
    data: {
      email: 'manager@example.com',
      firstName: 'Manager',
      lastName: 'User',
      password: managerPassword,
      roles: {
        set: [UserRole.MANAGER],
      },
      isActive: true,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => {
    prisma.$disconnect();
  });

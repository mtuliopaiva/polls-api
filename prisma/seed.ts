import { PrismaClient, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  const permissionsList = [
    'users.read',
    'users.update',
    'users.delete',
    'users.restore',
    'logs.read',
    'audits.read',
  ];

  const permissions = await Promise.all(
    permissionsList.map((name) =>
      prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const permissionsMap = Object.fromEntries(
    permissions.map((p) => [p.name, p]),
  );

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      rolePermissions: {
        create: [
          {
            permission: {
              connect: { uuid: permissionsMap['users.read'].uuid },
            },
          },
          {
            permission: {
              connect: { uuid: permissionsMap['users.update'].uuid },
            },
          },
        ],
      },
    },
    include: { rolePermissions: true },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      rolePermissions: {
        create: permissions.map((p) => ({
          permission: {
            connect: { uuid: p.uuid },
          },
        })),
      },
    },
  });

  const password = await bcrypt.hash('12345678', 10);

  // USER
  const user = await prisma.user.upsert({
    where: { email: 'user@email.com' },
    update: {},
    create: {
      email: 'user@email.com',
      password,
      type: UserType.USER,
      userRoles: {
        create: {
          role: {
            connect: { uuid: userRole.uuid },
          },
        },
      },
    },
  });

  // ADMIN
  const admin = await prisma.user.upsert({
    where: { email: 'admin@email.com' },
    update: {},
    create: {
      email: 'admin@email.com',
      password,
      type: UserType.ADMIN,
      userRoles: {
        create: {
          role: {
            connect: { uuid: adminRole.uuid },
          },
        },
      },
    },
  });

  console.log('✅ Seed concluída');
  console.log('👤 User:', user.email);
  console.log('👑 Admin:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

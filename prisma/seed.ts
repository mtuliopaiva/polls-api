import { PollStatus, PrismaClient, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const USER_ROLE_PERMISSIONS = [
  'users.read',
  'users.update',
  'polls.create',
  'polls.read',
  'polls.update',
  'polls.delete',
  'polls.restore',
];

const ADMIN_ROLE_PERMISSIONS = [
  'users.read',
  'users.update',
  'users.delete',
  'users.restore',
  'polls.create',
  'polls.read',
  'polls.update',
  'polls.delete',
  'polls.restore',
  'logs.read',
  'audits.read',
];

async function main() {
  console.log('🌱 Seeding...');

  const permissionsList = [
    ...new Set([...USER_ROLE_PERMISSIONS, ...ADMIN_ROLE_PERMISSIONS]),
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
    permissions.map((permission) => [permission.name, permission]),
  );

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Usuário padrão',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrador do sistema',
    },
  });

  await Promise.all(
    USER_ROLE_PERMISSIONS.map((permissionName) =>
      prisma.rolePermission.upsert({
        where: {
          roleUuid_permissionUuid: {
            roleUuid: userRole.uuid,
            permissionUuid: permissionsMap[permissionName].uuid,
          },
        },
        update: {},
        create: {
          roleUuid: userRole.uuid,
          permissionUuid: permissionsMap[permissionName].uuid,
        },
      }),
    ),
  );

  await Promise.all(
    ADMIN_ROLE_PERMISSIONS.map((permissionName) =>
      prisma.rolePermission.upsert({
        where: {
          roleUuid_permissionUuid: {
            roleUuid: adminRole.uuid,
            permissionUuid: permissionsMap[permissionName].uuid,
          },
        },
        update: {},
        create: {
          roleUuid: adminRole.uuid,
          permissionUuid: permissionsMap[permissionName].uuid,
        },
      }),
    ),
  );

  const password = await bcrypt.hash('12345678', 10);

  const user = await prisma.user.upsert({
    where: {
      email: 'user@email.com',
    },
    update: {},
    create: {
      email: 'user@email.com',
      password,
      type: UserType.USER,
    },
  });

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@email.com',
    },
    update: {},
    create: {
      email: 'admin@email.com',
      password,
      type: UserType.ADMIN,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userUuid_roleUuid: {
        userUuid: user.uuid,
        roleUuid: userRole.uuid,
      },
    },
    update: {},
    create: {
      userUuid: user.uuid,
      roleUuid: userRole.uuid,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userUuid_roleUuid: {
        userUuid: admin.uuid,
        roleUuid: adminRole.uuid,
      },
    },
    update: {},
    create: {
      userUuid: admin.uuid,
      roleUuid: adminRole.uuid,
    },
  });

  const draftPoll = await prisma.poll.upsert({
    where: {
      uuid: '0d97785c-c33f-4a7d-b084-cba5cd74948b',
    },
    update: {
      title: 'Qual framework backend você prefere?',
      description: 'Enquete ainda em fase de preparação.',
      status: PollStatus.DRAFT,
      startsAt: null,
      endsAt: null,
      deletedAt: null,
      createdByUuid: user.uuid,
    },
    create: {
      uuid: '0d97785c-c33f-4a7d-b084-cba5cd74948b',
      title: 'Qual framework backend você prefere?',
      description: 'Enquete ainda em fase de preparação.',
      status: PollStatus.DRAFT,
      createdByUuid: user.uuid,
    },
  });

  const activePoll = await prisma.poll.upsert({
    where: {
      uuid: '35e2a23e-4178-4eb0-af59-d4d568e10875',
    },
    update: {
      title: 'Qual linguagem você mais utiliza?',
      description: 'Escolha a linguagem que você mais utiliza no dia a dia.',
      status: PollStatus.ACTIVE,
      startsAt: new Date('2026-07-01T00:00:00.000Z'),
      endsAt: new Date('2026-12-31T23:59:59.000Z'),
      deletedAt: null,
      createdByUuid: user.uuid,
    },
    create: {
      uuid: '35e2a23e-4178-4eb0-af59-d4d568e10875',
      title: 'Qual linguagem você mais utiliza?',
      description: 'Escolha a linguagem que você mais utiliza no dia a dia.',
      status: PollStatus.ACTIVE,
      startsAt: new Date('2026-07-01T00:00:00.000Z'),
      endsAt: new Date('2026-12-31T23:59:59.000Z'),
      createdByUuid: user.uuid,
    },
  });

  const closedPoll = await prisma.poll.upsert({
    where: {
      uuid: '97161461-e9a2-4634-b4ae-9a589a32cdb8',
    },
    update: {
      title: 'Qual banco de dados você prefere?',
      description: 'Enquete encerrada para testes.',
      status: PollStatus.CLOSED,
      startsAt: new Date('2026-01-01T00:00:00.000Z'),
      endsAt: new Date('2026-06-30T23:59:59.000Z'),
      deletedAt: null,
      createdByUuid: admin.uuid,
    },
    create: {
      uuid: '97161461-e9a2-4634-b4ae-9a589a32cdb8',
      title: 'Qual banco de dados você prefere?',
      description: 'Enquete encerrada para testes.',
      status: PollStatus.CLOSED,
      startsAt: new Date('2026-01-01T00:00:00.000Z'),
      endsAt: new Date('2026-06-30T23:59:59.000Z'),
      createdByUuid: admin.uuid,
    },
  });

  console.log('✅ Seed concluída');
  console.log('👤 User:', user.email);
  console.log('👑 Admin:', admin.email);
  console.log('📝 Draft poll:', draftPoll.title);
  console.log('🟢 Active poll:', activePoll.title);
  console.log('🔴 Closed poll:', closedPoll.title);
}

main()
  .catch((error) => {
    console.error('❌ Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

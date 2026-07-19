import { PollStatus, PrismaClient, User, UserType } from '@prisma/client';
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

const MARVEL_USERS = [
  {
    name: 'Peter Parker',
    email: 'peter.parker@marvel.local',
    type: UserType.USER,
    role: 'user',
  },
  {
    name: 'Tony Stark',
    email: 'tony.stark@marvel.local',
    type: UserType.ADMIN,
    role: 'super-admin',
  },
  {
    name: 'Steve Rogers',
    email: 'steve.rogers@marvel.local',
    type: UserType.USER,
    role: 'user',
  },
  {
    name: 'Natasha Romanoff',
    email: 'natasha.romanoff@marvel.local',
    type: UserType.USER,
    role: 'user',
  },
  {
    name: 'Bruce Banner',
    email: 'bruce.banner@marvel.local',
    type: UserType.USER,
    role: 'user',
  },
  {
    name: 'Thor Odinson',
    email: 'thor.odinson@marvel.local',
    type: UserType.USER,
    role: 'user',
  },
  {
    name: 'Wanda Maximoff',
    email: 'wanda.maximoff@marvel.local',
    type: UserType.USER,
    role: 'user',
  },
  {
    name: 'Scott Lang',
    email: 'scott.lang@marvel.local',
    type: UserType.USER,
    role: 'user',
  },
  {
    name: 'Carol Danvers',
    email: 'carol.danvers@marvel.local',
    type: UserType.USER,
    role: 'user',
  },
  {
    name: 'Stephen Strange',
    email: 'stephen.strange@marvel.local',
    type: UserType.USER,
    role: 'user',
  },
] as const;

const MARVEL_POLLS = [
  {
    title: 'Which Avengers leader is the best?',
    description: 'Marvel themed poll about leadership in the Avengers.',
    status: PollStatus.ACTIVE,
    options: ['Captain America', 'Iron Man', 'Black Panther', 'Captain Marvel'],
  },
  {
    title: 'Best Spider-Man villain',
    description: 'Choose the most iconic Spider-Man enemy.',
    status: PollStatus.ACTIVE,
    options: ['Green Goblin', 'Doc Ock', 'Venom', 'Mysterio'],
  },
  {
    title: 'Favorite Infinity Stone',
    description: 'Vote for the most interesting Infinity Stone.',
    status: PollStatus.ACTIVE,
    options: ['Space Stone', 'Mind Stone', 'Time Stone', 'Power Stone'],
  },
  {
    title: 'Best X-Men mutant',
    description: 'Choose your favorite mutant from the X-Men universe.',
    status: PollStatus.ACTIVE,
    options: ['Wolverine', 'Cyclops', 'Storm', 'Jean Grey'],
  },
  {
    title: 'Best Marvel sorcerer',
    description: 'Marvel magic and mystic arts poll.',
    status: PollStatus.ACTIVE,
    options: ['Doctor Strange', 'Scarlet Witch', 'Wong', 'Agatha Harkness'],
  },
  {
    title: 'Best Guardians of the Galaxy member',
    description: 'Vote for the most beloved Guardian.',
    status: PollStatus.ACTIVE,
    options: ['Star-Lord', 'Groot', 'Rocket Raccoon', 'Gamora'],
  },
  {
    title: 'Best Wakanda character',
    description: 'Who stands out most in Wakanda?',
    status: PollStatus.ACTIVE,
    options: ['Black Panther', 'Shuri', 'Okoye', 'M Baku'],
  },
  {
    title: 'Best Spider-Verse character',
    description: 'Pick your favorite Spider-Verse hero.',
    status: PollStatus.ACTIVE,
    options: ['Miles Morales', 'Spider-Gwen', 'Spider-Man 2099', 'Spider-Ham'],
  },
  {
    title: 'Best Marvel antihero',
    description: 'Which antihero do you like the most?',
    status: PollStatus.ACTIVE,
    options: ['Deadpool', 'Punisher', 'Venom', 'Moon Knight'],
  },
  {
    title: 'Best Marvel team-up',
    description: 'Pick the strongest Marvel group.',
    status: PollStatus.ACTIVE,
    options: ['Avengers', 'X-Men', 'Guardians of the Galaxy', 'Fantastic Four'],
  },
];

async function main() {
  console.log('Seeding...');

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
    update: {
      description: 'Usuário padrão',
    },
    create: {
      name: 'user',
      description: 'Usuário padrão',
    },
  });

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'super-admin' },
    update: {
      description: 'Super administrador do sistema',
    },
    create: {
      name: 'super-admin',
      description: 'Super administrador do sistema',
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
            roleUuid: superAdminRole.uuid,
            permissionUuid: permissionsMap[permissionName].uuid,
          },
        },
        update: {},
        create: {
          roleUuid: superAdminRole.uuid,
          permissionUuid: permissionsMap[permissionName].uuid,
        },
      }),
    ),
  );

  await prisma.vote.deleteMany({});
  await prisma.pollOption.deleteMany({});
  await prisma.poll.deleteMany({});
  await prisma.userRole.deleteMany({
    where: {
      user: {
        email: {
          in: MARVEL_USERS.map((user) => user.email),
        },
      },
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: {
        in: MARVEL_USERS.map((user) => user.email),
      },
    },
  });

  const password = await bcrypt.hash('12345678', 10);

  const seededUsers: User[] = [];

  for (const userData of MARVEL_USERS) {
    const user = await prisma.user.upsert({
      where: {
        email: userData.email,
      },
      update: {
        type: userData.type,
        password,
      },
      create: {
        email: userData.email,
        password,
        type: userData.type,
      },
    });

    const role = userData.role === 'super-admin' ? superAdminRole : userRole;

    await prisma.userRole.upsert({
      where: {
        userUuid_roleUuid: {
          userUuid: user.uuid,
          roleUuid: role.uuid,
        },
      },
      update: {},
      create: {
        userUuid: user.uuid,
        roleUuid: role.uuid,
      },
    });

    seededUsers.push(user);
  }

  const adminUser = seededUsers.find(
    (user) => user.email === 'tony.stark@marvel.local',
  );

  if (!adminUser) {
    throw new Error('Failed to seed super admin user');
  }

  for (const pollData of MARVEL_POLLS) {
    const createdPoll = await prisma.poll.create({
      data: {
        title: pollData.title,
        description: pollData.description,
        status: pollData.status,
        createdByUuid: adminUser.uuid,
      },
    });

    await Promise.all(
      pollData.options.map((label) =>
        prisma.pollOption.create({
          data: {
            label,
            pollUuid: createdPoll.uuid,
          },
        }),
      ),
    );
  }

  console.log('Seed concluída');
  console.log('Users created:', MARVEL_USERS.length);
  console.log('Polls created:', MARVEL_POLLS.length);
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

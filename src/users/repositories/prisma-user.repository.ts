import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { UserRepository } from './user.repository';
import { UserEntity } from '../domain/entities/user.entity';
import { CreateUserData } from '../domain/types/create-user-data.type';
import { UpdateUserData } from '../domain/types/update-user-data.type';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(search?: string): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
        ...(search
          ? {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async count(search?: string): Promise<number> {
    return this.prisma.user.count({
      where: {
        deletedAt: null,
        ...(search
          ? {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
    });
  }

  async findByUuid(uuid: string): Promise<UserEntity | null> {
    return this.prisma.user.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    });
  }

  async findAuthUserByEmail(email: string): Promise<{
    uuid: string;
    email: string;
    password: string;
    type: string;
    roles: string[];
    permissions: string[];
  } | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const roles = user.userRoles.map((userRole) => userRole.role.name);

    const permissions = [
      ...new Set(
        user.userRoles.flatMap((userRole) =>
          userRole.role.rolePermissions.map(
            (rolePermission) => rolePermission.permission.name,
          ),
        ),
      ),
    ];

    return {
      uuid: user.uuid,
      email: user.email,
      password: user.password,
      type: user.type,
      roles,
      permissions,
    };
  }

  async assignRoleToUser(userUuid: string, roleName: string): Promise<void> {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new Error(`Role "${roleName}" not found`);
    }

    await this.prisma.userRole.upsert({
      where: {
        userUuid_roleUuid: {
          userUuid,
          roleUuid: role.uuid,
        },
      },
      update: {},
      create: {
        userUuid,
        roleUuid: role.uuid,
      },
    });
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(uuid: string, data: UpdateUserData): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { uuid },
      data,
    });
  }

  async findDeletedByUuid(uuid: string): Promise<UserEntity | null> {
    return this.prisma.user.findFirst({
      where: {
        uuid,
        NOT: {
          deletedAt: null,
        },
      },
    });
  }
}

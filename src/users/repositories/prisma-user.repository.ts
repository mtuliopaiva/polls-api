import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { UserRepository } from './user.repository';
import { User, UserType } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(where: any): Promise<User[]> {
    return this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  count(where: any): Promise<number> {
    return this.prisma.user.count({ where });
  }

  findByUuid(uuid: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { uuid, deletedAt: null },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        deletedAt: null,
      },
    });
  }

  create(data: {
    email: string;
    passwordHash: string;
    type: UserType;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  update(uuid: string, data: any): Promise<User> {
    return this.prisma.user.update({
      where: { uuid },
      data,
    });
  }
}

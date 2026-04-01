import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { UpdateUserDto } from '../domain/dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params?: { search?: string; includeDeleted?: boolean }) {
    const where = {
      deletedAt: null,
      ...(params?.search
        ? { email: { contains: params.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  async findByUuid(uuid: string) {
    const user = await this.prisma.user.findUnique({
      where: { uuid, deletedAt: null },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(uuid: string, dto: UpdateUserDto) {
    await this.findByUuid(uuid);

    const passwordHash = dto.passwordHash
      ? await bcrypt.hash(dto.passwordHash, 10)
      : undefined;

    return this.prisma.user.update({
      where: { uuid },
      data: {
        ...(passwordHash ? { passwordHash } : {}),
      },
    });
  }

  async softDelete(uuid: string) {
    await this.findByUuid(uuid);

    return this.prisma.user.update({
      where: { uuid },
      data: { deletedAt: new Date() },
    });
  }

  async restore(uuid: string) {
    const user = await this.prisma.user.findUnique({
      where: { uuid },
    });

    if (!user?.deletedAt) throw new BadRequestException('User is not deleted');

    return this.prisma.user.update({
      where: { uuid },
      data: { deletedAt: null },
    });
  }
}

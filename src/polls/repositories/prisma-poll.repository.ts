import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';
import { PollRepository } from './poll.repository';
import { PollEntity } from '../domain/entities/poll.entity';
import { CreatePollData } from '../domain/types/create-poll-data.type';
import { UpdatePollData } from '../domain/types/update-poll-data.type';
import { ListPollFilters } from '../domain/types/list-poll-filters.type';

@Injectable()
export class PrismaPollRepository implements PollRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filters?: ListPollFilters): Promise<PollEntity[]> {
    return this.prisma.poll.findMany({
      where: {
        deletedAt: null,

        ...(filters?.status
          ? {
              status: filters.status,
            }
          : {}),

        ...(filters?.search
          ? {
              OR: [
                {
                  title: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async count(filters?: ListPollFilters): Promise<number> {
    return this.prisma.poll.count({
      where: {
        deletedAt: null,

        ...(filters?.status
          ? {
              status: filters.status,
            }
          : {}),

        ...(filters?.search
          ? {
              OR: [
                {
                  title: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
    });
  }

  async findByUuid(uuid: string): Promise<PollEntity | null> {
    return this.prisma.poll.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },
    });
  }

  async findDeletedByUuid(uuid: string): Promise<PollEntity | null> {
    return this.prisma.poll.findFirst({
      where: {
        uuid,
        deletedAt: {
          not: null,
        },
      },
    });
  }

  async create(data: CreatePollData): Promise<PollEntity> {
    return this.prisma.poll.create({
      data,
    });
  }

  async update(uuid: string, data: UpdatePollData): Promise<PollEntity> {
    return this.prisma.poll.update({
      where: {
        uuid,
      },
      data,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { EventLogsRepository } from './eventLogs.repository';
import { EventLogsEntity } from '../domain/entities/log.entity';
import { CreateEventLogsData } from '../domain/types/create-eventLogs-data.type';
import { ListEventLogsFilters } from '../domain/types/list-eventLogs-filters.type';

@Injectable()
export class PrismaEventLogsRepository implements EventLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEventLogsData): Promise<EventLogsEntity> {
    return this.prisma.eventLog.create({
      data: {
        level: data.level,
        message: data.message,
        context: data.context,
        stack: data.stack,
        metadata: data.metadata ?? undefined,
      },
    });
  }

  async findMany(filters?: ListEventLogsFilters): Promise<EventLogsEntity[]> {
    return this.prisma.eventLog.findMany({
      where: {
        ...(filters?.level ? { level: filters.level } : {}),
        ...(filters?.context ? { context: filters.context } : {}),
        ...(filters?.search
          ? {
              OR: [
                {
                  message: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
                {
                  context: {
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

  async count(filters?: ListEventLogsFilters): Promise<number> {
    return this.prisma.eventLog.count({
      where: {
        ...(filters?.level ? { level: filters.level } : {}),
        ...(filters?.context ? { context: filters.context } : {}),
        ...(filters?.search
          ? {
              OR: [
                {
                  message: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
                {
                  context: {
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

  async findByUuid(uuid: string): Promise<EventLogsEntity | null> {
    return this.prisma.eventLog.findUnique({
      where: { uuid },
    });
  }
}

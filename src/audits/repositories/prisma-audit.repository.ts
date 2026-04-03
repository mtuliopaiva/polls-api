import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { AuditRepository } from './audit.repository';
import { AuditEntity } from '../domain/entities/audit.entity';
import { CreateAuditData } from '../domain/types/create-audit-data.type';
import { ListAuditFilters } from '../domain/types/list-audit-filters.type';
import { LogEntity } from '../../logs/domain/entities/log.entity';

@Injectable()
export class PrismaAuditRepository implements AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAuditData): Promise<AuditEntity> {
    return this.prisma.audit.create({
      data: {
        actorUuid: data.actorUuid,
        actorEmail: data.actorEmail,
        action: data.action,
        entity: data.entity,
        entityUuid: data.entityUuid,
        oldData: data.oldData ?? undefined,
        newData: data.newData ?? undefined,
        metadata: data.metadata ?? undefined,
      },
    });
  }

  async findByUuid(uuid: string): Promise<AuditEntity | null> {
    return this.prisma.audit.findUnique({
      where: { uuid },
    });
  }

  async findMany(filters?: ListAuditFilters): Promise<AuditEntity[]> {
    return this.prisma.audit.findMany({
      where: {
        ...(filters?.actorEmail ? { actorEmail: filters.actorEmail } : {}),
        ...(filters?.action ? { action: filters.action } : {}),
        ...(filters?.entity ? { entity: filters.entity } : {}),
        ...(filters?.search
          ? {
              OR: [
                {
                  actorEmail: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
                {
                  action: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
                {
                  entity: {
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

  async count(filters?: ListAuditFilters): Promise<number> {
    return this.prisma.audit.count({
      where: {
        ...(filters?.actorEmail ? { actorEmail: filters.actorEmail } : {}),
        ...(filters?.action ? { action: filters.action } : {}),
        ...(filters?.entity ? { entity: filters.entity } : {}),
        ...(filters?.search
          ? {
              OR: [
                {
                  actorEmail: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
                {
                  action: {
                    contains: filters.search,
                    mode: 'insensitive',
                  },
                },
                {
                  entity: {
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
}

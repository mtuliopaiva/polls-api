import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditRepository } from '../repositories/audit.repository';
import { CreateAuditData } from '../domain/types/create-audit-data.type';
import { ListAuditFilters } from '../domain/types/list-audit-filters.type';

@Injectable()
export class AuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  create(data: CreateAuditData) {
    return this.auditRepository.create(data);
  }

  async findByUuid(uuid: string) {
    const log = await this.auditRepository.findByUuid(uuid);

    if (!log) {
      throw new NotFoundException('Audit not found');
    }

    return log;
  }

  async list(filters?: ListAuditFilters) {
    const [data, total] = await Promise.all([
      this.auditRepository.findMany(filters),
      this.auditRepository.count(filters),
    ]);

    return { data, total };
  }
}

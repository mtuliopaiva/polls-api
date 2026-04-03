import { AuditEntity } from '../domain/entities/audit.entity';
import { CreateAuditData } from '../domain/types/create-audit-data.type';
import { ListAuditFilters } from '../domain/types/list-audit-filters.type';

export abstract class AuditRepository {
  abstract create(data: CreateAuditData): Promise<AuditEntity>;
  abstract findByUuid(uuid: string): Promise<AuditEntity | null>;
  abstract findMany(filters?: ListAuditFilters): Promise<AuditEntity[]>;
  abstract count(filters?: ListAuditFilters): Promise<number>;
}

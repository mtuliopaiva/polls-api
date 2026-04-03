import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuditsByUuidQuery } from './audit-by-uuid.query';
import { AuditService } from '../../service/audit.service';
import { ReadAuditDto } from '../dtos/read-audit.dto';

@QueryHandler(AuditsByUuidQuery)
export class AuditsByUuidHandler implements IQueryHandler<AuditsByUuidQuery> {
  constructor(private readonly service: AuditService) {}

  async execute(query: AuditsByUuidQuery): Promise<ReadAuditDto> {
    const audit = await this.service.findByUuid(query.data.uuid);

    return {
      uuid: audit.uuid,
      actorUuid: audit.actorUuid,
      actorEmail: audit.actorEmail,
      action: audit.action,
      entity: audit.entity,
      entityUuid: audit.entityUuid,
      oldData: audit.oldData,
      newData: audit.newData,
      metadata: audit.metadata,
      createdAt: audit.createdAt,
    };
  }
}

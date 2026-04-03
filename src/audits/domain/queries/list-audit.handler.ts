import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListAuditsQuery } from './list-audit.query';
import { LogService } from '../../../logs/service/log.service';
import { ReadAuditDto } from '../dtos/read-audit.dto';
import { audit } from 'rxjs';
import { AuditService } from '../../service/audit.service';

@QueryHandler(ListAuditsQuery)
export class ListAuditsHandler implements IQueryHandler<ListAuditsQuery> {
  constructor(private readonly service: AuditService) {}

  async execute(query: ListAuditsQuery): Promise<{
    data: ReadAuditDto[];
    meta: { total: number };
  }> {
    const { data, total } = await this.service.list(query.data);

    return {
      data: data.map(
        (audit): ReadAuditDto => ({
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
        }),
      ),
      meta: {
        total,
      },
    };
  }
}

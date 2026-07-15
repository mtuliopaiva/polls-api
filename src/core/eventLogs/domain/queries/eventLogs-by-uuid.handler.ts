import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EventLogsService } from '../../service/eventLogs.service';
import { ReadEventLogsDto } from '../dtos/read-eventLogs.dto';
import { EventLogsByUuidQuery } from './eventLogs-by-uuid.query';

@QueryHandler(EventLogsByUuidQuery)
export class EventLogsByUuidHandler implements IQueryHandler<EventLogsByUuidQuery> {
  constructor(private readonly service: EventLogsService) {}

  async execute(query: EventLogsByUuidQuery): Promise<ReadEventLogsDto> {
    const user = await this.service.findByUuid(query.data.uuid);

    return {
      uuid: user.uuid,
      level: user.level,
      message: user.message,
      context: user.context,
      stack: user.stack,
      metadata: user.metadata,
      createdAt: user.createdAt,
    };
  }
}

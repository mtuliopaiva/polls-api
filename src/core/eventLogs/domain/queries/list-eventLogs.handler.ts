import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReadEventLogsDto } from '../dtos/read-eventLogs.dto';
import { ListEventLogsQuery } from './list-eventLogs.query';
import { EventLogsService } from '../../service/eventLogs.service';

@QueryHandler(ListEventLogsQuery)
export class ListEventLogsHandler implements IQueryHandler<ListEventLogsQuery> {
  constructor(private readonly service: EventLogsService) {}

  async execute(query: ListEventLogsQuery): Promise<{
    data: ReadEventLogsDto[];
    meta: { total: number };
  }> {
    const { data, total } = await this.service.list(query.data);

    return {
      data: data.map(
        (log): ReadEventLogsDto => ({
          uuid: log.uuid,
          level: log.level,
          message: log.message,
          context: log.context,
          stack: log.stack,
          metadata: log.metadata,
          createdAt: log.createdAt,
        }),
      ),
      meta: {
        total,
      },
    };
  }
}

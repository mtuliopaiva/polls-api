import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPollQuery } from './list-poll.query';
import { ReadPollDto } from '../dtos/read-poll.dto';
import { PollService } from '../../service/poll.service';

@QueryHandler(ListPollQuery)
export class ListPollHandler implements IQueryHandler<ListPollQuery> {
  constructor(private readonly service: PollService) {}

  async execute(query: ListPollQuery): Promise<{
    data: ReadPollDto[];
    meta: { total: number };
  }> {
    const { data, total } = await this.service.list(query.data);

    return {
      data: data.map(
        (poll): ReadPollDto => ({
          uuid: poll.uuid,
          title: poll.title,
          description: poll.description,
          status: poll.status,
          startsAt: poll.startsAt,
          endsAt: poll.endsAt,
          createdByUuid: poll.createdByUuid,
          createdAt: poll.createdAt,
          updatedAt: poll.updatedAt,
        }),
      ),
      meta: {
        total,
      },
    };
  }
}

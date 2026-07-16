import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PollService } from '../../service/poll.service';
import { PollByUuidQuery } from './poll-by-uuid.query';
import { ReadPollDto } from '../dtos/read-poll.dto';

@QueryHandler(PollByUuidQuery)
export class PollByUuidHandler implements IQueryHandler<PollByUuidQuery> {
  constructor(private readonly service: PollService) {}

  async execute(query: PollByUuidQuery): Promise<ReadPollDto> {
    const poll = await this.service.findByUuid(query.data.uuid);

    return {
      uuid: poll.uuid,
      title: poll.title,
      description: poll.description,
      status: poll.status,
      startsAt: poll.startsAt,
      endsAt: poll.endsAt,
      createdByUuid: poll.createdByUuid,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt,
    };
  }
}

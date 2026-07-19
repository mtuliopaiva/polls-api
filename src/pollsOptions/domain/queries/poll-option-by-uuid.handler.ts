import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PollOptionService } from '../../service/poll-option.service';
import { PollOptionByUuidQuery } from './poll-option-by-uuid.query';
import { ReadPollOptionDto } from '../dtos/read-poll-option.dto';

@QueryHandler(PollOptionByUuidQuery)
export class PollOptionByUuidHandler
  implements IQueryHandler<PollOptionByUuidQuery>
{
  constructor(private readonly service: PollOptionService) {}

  async execute(query: PollOptionByUuidQuery): Promise<ReadPollOptionDto> {
    const option = await this.service.findByUuid(
      query.data.pollUuid,
      query.data.uuid,
    );

    return {
      uuid: option.uuid,
      label: option.label,
      pollUuid: option.pollUuid,
      createdAt: option.createdAt,
      updatedAt: option.updatedAt,
    };
  }
}

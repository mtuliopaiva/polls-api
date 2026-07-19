import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PollOptionService } from '../../service/poll-option.service';
import { ListPollOptionQuery } from './list-poll-option.query';
import { ReadPollOptionDto } from '../dtos/read-poll-option.dto';
import { ListPollOptionDto } from '../dtos/list-poll-option.dto';

@QueryHandler(ListPollOptionQuery)
export class ListPollOptionHandler implements IQueryHandler<ListPollOptionQuery> {
  constructor(private readonly service: PollOptionService) {}

  async execute(query: ListPollOptionQuery): Promise<ListPollOptionDto> {
    const { data, total } = await this.service.list(query.data.pollUuid);

    return {
      data: data.map(
        (option): ReadPollOptionDto => ({
          uuid: option.uuid,
          label: option.label,
          pollUuid: option.pollUuid,
          createdAt: option.createdAt,
          updatedAt: option.updatedAt,
        }),
      ),
      meta: {
        total,
      },
    };
  }
}

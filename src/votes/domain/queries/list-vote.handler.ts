import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { VoteService } from '../../service/vote.service';
import { ListVoteQuery } from './list-vote.query';
import { ReadVoteSummaryDto } from '../dtos/read-vote-summary.dto';

@QueryHandler(ListVoteQuery)
export class ListVoteHandler implements IQueryHandler<ListVoteQuery> {
  constructor(private readonly service: VoteService) {}

  async execute(query: ListVoteQuery): Promise<ReadVoteSummaryDto> {
    return this.service.list(query.data.pollUuid, query.data.currentUserUuid);
  }
}

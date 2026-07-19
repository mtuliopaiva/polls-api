import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { VoteController } from '../controller/vote.controller';
import { VoteService } from '../service/vote.service';
import { VoteRepository } from '../repositories/vote.repository';
import { PrismaVoteRepository } from '../repositories/prisma-vote.repository';
import { CreateVoteHandler } from '../domain/commands/create-vote.handler';
import { ListVoteHandler } from '../domain/queries/list-vote.handler';
import { PollModule } from '../../polls/module/poll.module';
import { PollOptionModule } from '../../pollsOptions/module/poll-option.module';
import { VoteGateway } from '../gateway/vote.gateway';

const CommandHandlers = [CreateVoteHandler];
const QueryHandlers = [ListVoteHandler];

@Module({
  imports: [CqrsModule, PollModule, PollOptionModule],
  controllers: [VoteController],
  providers: [
    VoteService,
    VoteGateway,
    {
      provide: VoteRepository,
      useClass: PrismaVoteRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [VoteRepository],
})
export class VoteModule {}

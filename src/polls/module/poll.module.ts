import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PollController } from '../controller/poll.controller';
import { PollService } from '../service/poll.service';

import { PollRepository } from '../repositories/poll.repository';

import { UpdatePollHandler } from '../domain/commands/update-poll.handler';
import { DeletePollHandler } from '../domain/commands/delete-poll.handler';
import { RestorePollHandler } from '../domain/commands/restore-poll.handler';

import { ListPollHandler } from '../domain/queries/list-poll.handler';
import { PollByUuidHandler } from '../domain/queries/poll-by-uuid.handler';
import { AuditModule } from '../../audits/module/audit.module';
import { PrismaPollRepository } from '../repositories/prisma-poll.repository';

const CommandHandlers = [
  UpdatePollHandler,
  DeletePollHandler,
  RestorePollHandler,
];

const QueryHandlers = [ListPollHandler, PollByUuidHandler];

@Module({
  imports: [CqrsModule, AuditModule],
  controllers: [PollController],
  providers: [
    PollService,
    {
      provide: PollRepository,
      useClass: PrismaPollRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [PollRepository],
})
export class PollModule {}

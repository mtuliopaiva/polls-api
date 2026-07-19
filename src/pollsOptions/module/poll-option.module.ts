import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuditModule } from '../../audits/module/audit.module';
import { PollOptionController } from '../controller/poll-option.controller';
import { PollOptionService } from '../service/poll-option.service';
import { PollOptionRepository } from '../repositories/poll-option.repository';
import { PrismaPollOptionRepository } from '../repositories/prisma-poll-option.repository';
import { CreatePollOptionHandler } from '../domain/commands/create-poll-option.handler';
import { UpdatePollOptionHandler } from '../domain/commands/update-poll-option.handler';
import { DeletePollOptionHandler } from '../domain/commands/delete-poll-option.handler';
import { ListPollOptionHandler } from '../domain/queries/list-poll-option.handler';
import { PollOptionByUuidHandler } from '../domain/queries/poll-option-by-uuid.handler';

const CommandHandlers = [
  CreatePollOptionHandler,
  UpdatePollOptionHandler,
  DeletePollOptionHandler,
];

const QueryHandlers = [ListPollOptionHandler, PollOptionByUuidHandler];

@Module({
  imports: [CqrsModule, AuditModule],
  controllers: [PollOptionController],
  providers: [
    PollOptionService,
    {
      provide: PollOptionRepository,
      useClass: PrismaPollOptionRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [PollOptionRepository],
})
export class PollOptionModule {}

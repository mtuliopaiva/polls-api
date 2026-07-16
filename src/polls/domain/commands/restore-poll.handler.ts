import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RestorePollCommand } from './restore-poll.command';
import { ReadPollDto } from '../dtos/read-poll.dto';
import { PollService } from '../../service/poll.service';

@CommandHandler(RestorePollCommand)
export class RestorePollHandler implements ICommandHandler<RestorePollCommand> {
  constructor(private readonly service: PollService) {}

  async execute(command: RestorePollCommand): Promise<ReadPollDto> {
    const restoredPoll = await this.service.restore(command.data.uuid, {
      uuid: command.data.currentUserUuid,
      email: command.data.currentUserEmail,
    });

    return {
      uuid: restoredPoll.uuid,
      title: restoredPoll.title,
      description: restoredPoll.description,
      status: restoredPoll.status,
      startsAt: restoredPoll.startsAt,
      endsAt: restoredPoll.endsAt,
      createdByUuid: restoredPoll.createdByUuid,
      createdAt: restoredPoll.createdAt,
      updatedAt: restoredPoll.updatedAt,
    };
  }
}

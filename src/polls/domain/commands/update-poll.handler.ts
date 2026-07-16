import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePollCommand } from './update-poll.command';
import { ReadPollDto } from '../dtos/read-poll.dto';
import { PollService } from '../../service/poll.service';

@CommandHandler(UpdatePollCommand)
export class UpdatePollHandler implements ICommandHandler<UpdatePollCommand> {
  constructor(private readonly service: PollService) {}

  async execute(command: UpdatePollCommand): Promise<ReadPollDto> {
    const updatedPoll = await this.service.update(
      command.data.uuid,
      command.data.dto,
      {
        uuid: command.data.currentUserUuid,
        email: command.data.currentUserEmail,
      },
    );

    return {
      uuid: updatedPoll.uuid,
      title: updatedPoll.title,
      description: updatedPoll.description,
      status: updatedPoll.status,
      startsAt: updatedPoll.startsAt,
      endsAt: updatedPoll.endsAt,
      createdByUuid: updatedPoll.createdByUuid,
      createdAt: updatedPoll.createdAt,
      updatedAt: updatedPoll.updatedAt,
    };
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePollCommand } from './create-poll.command';
import { ReadPollDto } from '../dtos/read-poll.dto';
import { PollService } from '../../service/poll.service';

@CommandHandler(CreatePollCommand)
export class CreatePollHandler implements ICommandHandler<CreatePollCommand> {
  constructor(private readonly service: PollService) {}

  async execute(command: CreatePollCommand): Promise<ReadPollDto> {
    const createdPoll = await this.service.create(command.data.dto, {
      uuid: command.data.currentUserUuid,
      email: command.data.currentUserEmail,
    });

    return {
      uuid: createdPoll.uuid,
      title: createdPoll.title,
      description: createdPoll.description,
      status: createdPoll.status,
      startsAt: createdPoll.startsAt,
      endsAt: createdPoll.endsAt,
      createdByUuid: createdPoll.createdByUuid,
      createdAt: createdPoll.createdAt,
      updatedAt: createdPoll.updatedAt,
    };
  }
}

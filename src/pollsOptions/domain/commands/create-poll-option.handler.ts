import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PollOptionService } from '../../service/poll-option.service';
import { CreatePollOptionCommand } from './create-poll-option.command';
import { ReadPollOptionDto } from '../dtos/read-poll-option.dto';

@CommandHandler(CreatePollOptionCommand)
export class CreatePollOptionHandler implements ICommandHandler<CreatePollOptionCommand> {
  constructor(private readonly service: PollOptionService) {}

  async execute(command: CreatePollOptionCommand): Promise<ReadPollOptionDto[]> {
    const options = await this.service.create(
      command.data.pollUuid,
      command.data.dto,
      {
        uuid: command.data.currentUserUuid,
        email: command.data.currentUserEmail,
      },
    );

    return options.map((option) => ({
      uuid: option.uuid,
      label: option.label,
      pollUuid: option.pollUuid,
      createdAt: option.createdAt,
      updatedAt: option.updatedAt,
    }));
  }
}

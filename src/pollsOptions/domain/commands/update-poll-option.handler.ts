import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PollOptionService } from '../../service/poll-option.service';
import { UpdatePollOptionCommand } from './update-poll-option.command';
import { ReadPollOptionDto } from '../dtos/read-poll-option.dto';

@CommandHandler(UpdatePollOptionCommand)
export class UpdatePollOptionHandler
  implements ICommandHandler<UpdatePollOptionCommand>
{
  constructor(private readonly service: PollOptionService) {}

  async execute(command: UpdatePollOptionCommand): Promise<ReadPollOptionDto> {
    const option = await this.service.update(
      command.data.pollUuid,
      command.data.uuid,
      command.data.dto,
      {
        uuid: command.data.currentUserUuid,
        email: command.data.currentUserEmail,
      },
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

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PollOptionService } from '../../service/poll-option.service';
import { DeletePollOptionCommand } from './delete-poll-option.command';

@CommandHandler(DeletePollOptionCommand)
export class DeletePollOptionHandler
  implements ICommandHandler<DeletePollOptionCommand>
{
  constructor(private readonly service: PollOptionService) {}

  async execute(command: DeletePollOptionCommand): Promise<void> {
    await this.service.delete(
      command.data.pollUuid,
      command.data.uuid,
      {
        uuid: command.data.currentUserUuid,
        email: command.data.currentUserEmail,
      },
    );
  }
}

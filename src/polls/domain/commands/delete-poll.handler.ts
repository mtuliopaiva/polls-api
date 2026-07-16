import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePollCommand } from './delete-poll.command';
import { PollService } from '../../service/poll.service';

@CommandHandler(DeletePollCommand)
export class DeletePollHandler implements ICommandHandler<DeletePollCommand> {
  constructor(private readonly service: PollService) {}

  async execute(command: DeletePollCommand): Promise<void> {
    await this.service.softDelete(command.data.uuid, {
      uuid: command.data.currentUserUuid,
      email: command.data.currentUserEmail,
    });
  }
}

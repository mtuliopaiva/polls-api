import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../service/user.service';
import { RestoreUserCommand } from './restore-user.command';

@CommandHandler(RestoreUserCommand)
export class RestoreUserHandler implements ICommandHandler<RestoreUserCommand> {
  constructor(private readonly service: UserService) {}

  async execute(command: RestoreUserCommand) {
    await this.service.restore(command.uuid);
    return true;
  }
}

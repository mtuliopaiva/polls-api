import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../service/user.service';
import { RestoreUserCommand } from './restore-user.command';
import { ActionUserDto } from '../dtos/action-user.dto';

@CommandHandler(RestoreUserCommand)
export class RestoreUserHandler implements ICommandHandler<RestoreUserCommand> {
  constructor(private readonly service: UserService) {}

  async execute(command: RestoreUserCommand): Promise<ActionUserDto> {
    await this.service.restore(command.data.uuid, {
      uuid: command.data.currentUserUuid,
      email: command.data.currentUserEmail,
    });
    return { success: true };
  }
}

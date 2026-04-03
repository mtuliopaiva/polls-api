import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../service/user.service';
import { DeleteUserCommand } from './delete-user.command';
import { ActionUserDto } from '../dtos/action-user.dto';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly service: UserService) {}

  async execute(command: DeleteUserCommand): Promise<ActionUserDto> {
    await this.service.softDelete(command.data.uuid, {
      uuid: command.data.currentUserUuid,
      email: command.data.currentUserEmail,
    });

    return { success: true };
  }
}

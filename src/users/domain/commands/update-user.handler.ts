import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../service/user.service';
import { UpdateUserCommand } from './update-user.command';
import { UpdateUserDto } from '../dtos/update-user.dto';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly service: UserService) {}

  async execute(command: UpdateUserCommand): Promise<UpdateUserDto> {
    const updatedUser = await this.service.update(
      command.data.uuid,
      command.data.dto,
      {
        uuid: command.data.currentUserUuid,
        email: command.data.currentUserEmail,
      },
    );

    return {
      email: updatedUser.email,
      type: updatedUser.type,
    };
  }
}

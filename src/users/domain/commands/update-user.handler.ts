import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../service/user.service';
import { UpdateUserCommand } from './update-user.command';
import { UpdateUserDto } from '../dtos/update-user.dto';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly service: UserService) {}

  async execute(command: UpdateUserCommand): Promise<UpdateUserDto> {
    const updatedUser = await this.service.update(command.uuid, command.dto);

    return {
      uuid: updatedUser.uuid,
      email: updatedUser.email,
      type: updatedUser.type,
    };
  }
}

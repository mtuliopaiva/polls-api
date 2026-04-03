import { UpdateUserDto } from '../dtos/update-user.dto';

export class UpdateUserCommand {
  constructor(
    public readonly data: {
      uuid: string;
      dto: UpdateUserDto;
      currentUserUuid: string;
      currentUserEmail: string;
    },
  ) {}
}

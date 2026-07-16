import { UpdatePollDto } from '../dtos/update-poll.dto';

export class UpdatePollCommand {
  constructor(
    public readonly data: {
      uuid: string;
      dto: UpdatePollDto;
      currentUserUuid: string;
      currentUserEmail: string;
    },
  ) {}
}

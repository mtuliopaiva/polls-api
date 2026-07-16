import { CreatePollDto } from '../dtos/create-poll.dto';

export class CreatePollCommand {
  constructor(
    public readonly data: {
      dto: CreatePollDto;
      currentUserUuid: string;
      currentUserEmail: string;
    },
  ) {}
}

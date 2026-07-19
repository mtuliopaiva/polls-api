import { CreatePollOptionDto } from '../dtos/create-poll-option.dto';

export class CreatePollOptionCommand {
  constructor(
    public readonly data: {
      pollUuid: string;
      dto: CreatePollOptionDto;
      currentUserUuid: string;
      currentUserEmail: string;
    },
  ) {}
}

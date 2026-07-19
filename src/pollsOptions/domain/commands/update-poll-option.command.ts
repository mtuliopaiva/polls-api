import { UpdatePollOptionDto } from '../dtos/update-poll-option.dto';

export class UpdatePollOptionCommand {
  constructor(
    public readonly data: {
      pollUuid: string;
      uuid: string;
      dto: UpdatePollOptionDto;
      currentUserUuid: string;
      currentUserEmail: string;
    },
  ) {}
}

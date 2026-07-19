import { CreateVoteDto } from '../dtos/create-vote.dto';

export class CreateVoteCommand {
  constructor(
    public readonly data: {
      pollUuid: string;
      dto: CreateVoteDto;
      currentUserUuid: string;
    },
  ) {}
}

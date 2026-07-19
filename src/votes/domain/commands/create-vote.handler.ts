import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { VoteService } from '../../service/vote.service';
import { CreateVoteCommand } from './create-vote.command';
import { ReadVoteDto } from '../dtos/read-vote.dto';

@CommandHandler(CreateVoteCommand)
export class CreateVoteHandler implements ICommandHandler<CreateVoteCommand> {
  constructor(private readonly service: VoteService) {}

  async execute(command: CreateVoteCommand): Promise<ReadVoteDto> {
    const vote = await this.service.create(
      command.data.pollUuid,
      command.data.dto.optionUuid,
      command.data.currentUserUuid,
    );

    return {
      uuid: vote.uuid,
      pollUuid: vote.pollUuid,
      optionUuid: vote.optionUuid,
      userUuid: vote.userUuid,
      createdAt: vote.createdAt,
      updatedAt: vote.updatedAt,
    };
  }
}

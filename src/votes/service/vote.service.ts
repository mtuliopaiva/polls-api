import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PollStatus } from '@prisma/client';

import { PollRepository } from '../../polls/repositories/poll.repository';
import { PollOptionRepository } from '../../pollsOptions/repositories/poll-option.repository';
import { VoteRepository } from '../repositories/vote.repository';
import { VoteGateway } from '../gateway/vote.gateway';

@Injectable()
export class VoteService {
  constructor(
    private readonly pollRepository: PollRepository,
    private readonly pollOptionRepository: PollOptionRepository,
    private readonly voteRepository: VoteRepository,
    private readonly voteGateway: VoteGateway,
  ) {}

  async list(pollUuid: string, userUuid: string) {
    const poll = await this.pollRepository.findByUuid(pollUuid);

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    const [counts, userVote] = await Promise.all([
      this.voteRepository.countByPollUuid(pollUuid),
      this.voteRepository.findUserVoteByPollUuid(pollUuid, userUuid),
    ]);

    return {
      pollUuid,
      votes: counts,
      totalVotes: counts.reduce((sum, item) => sum + item.total, 0),
      userVote: userVote
        ? {
            uuid: userVote.uuid,
            optionUuid: userVote.optionUuid,
            createdAt: userVote.createdAt,
            updatedAt: userVote.updatedAt,
          }
        : null,
    };
  }

  async create(
    pollUuid: string,
    optionUuid: string,
    userUuid: string,
  ) {
    const poll = await this.pollRepository.findByUuid(pollUuid);

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (poll.status !== PollStatus.ACTIVE) {
      throw new BadRequestException('Poll is not active');
    }

    const option = await this.pollOptionRepository.findByUuidAndPollUuid(
      optionUuid,
      pollUuid,
    );

    if (!option) {
      throw new NotFoundException('Poll option not found');
    }

    const existingVote = await this.voteRepository.findUserVoteByPollUuid(
      pollUuid,
      userUuid,
    );

    if (existingVote) {
      throw new ConflictException('User already voted on this poll');
    }

    const vote = await this.voteRepository.create({
      pollUuid,
      optionUuid,
      userUuid,
    });

    const counts = await this.voteRepository.countByPollUuid(pollUuid);

    this.voteGateway.emitPollVotesUpdated(pollUuid, {
      pollUuid,
      votes: counts,
      totalVotes: counts.reduce((sum, item) => sum + item.total, 0),
    });

    return vote;
  }
}

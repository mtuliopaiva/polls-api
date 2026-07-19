import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { VoteRepository } from './vote.repository';

@Injectable()
export class PrismaVoteRepository implements VoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countByPollUuid(pollUuid: string) {
    const grouped = await this.prisma.vote.groupBy({
      by: ['optionUuid'],
      where: {
        pollUuid,
      },
      _count: {
        optionUuid: true,
      },
    });

    return grouped.map((item) => ({
      optionUuid: item.optionUuid,
      total: item._count.optionUuid,
    }));
  }

  async findUserVoteByPollUuid(pollUuid: string, userUuid: string) {
    return this.prisma.vote.findFirst({
      where: {
        pollUuid,
        userUuid,
      },
    });
  }

  async create(data: {
    pollUuid: string;
    optionUuid: string;
    userUuid: string;
  }) {
    return this.prisma.vote.create({
      data,
    });
  }
}

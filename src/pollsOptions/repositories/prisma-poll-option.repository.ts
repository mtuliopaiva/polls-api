import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';
import { PollOptionRepository } from './poll-option.repository';
import { PollOptionEntity } from '../domain/entities/poll-option.entity';
import { CreatePollOptionData } from '../domain/types/create-poll-option-data.type';
import { UpdatePollOptionData } from '../domain/types/update-poll-option-data.type';

@Injectable()
export class PrismaPollOptionRepository implements PollOptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByPollUuid(pollUuid: string): Promise<PollOptionEntity[]> {
    return this.prisma.pollOption.findMany({
      where: {
        pollUuid,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async countByPollUuid(pollUuid: string): Promise<number> {
    return this.prisma.pollOption.count({
      where: {
        pollUuid,
      },
    });
  }

  async findByUuid(uuid: string): Promise<PollOptionEntity | null> {
    return this.prisma.pollOption.findUnique({
      where: {
        uuid,
      },
    });
  }

  async findByUuidAndPollUuid(
    uuid: string,
    pollUuid: string,
  ): Promise<PollOptionEntity | null> {
    return this.prisma.pollOption.findFirst({
      where: {
        uuid,
        pollUuid,
      },
    });
  }

  async create(data: CreatePollOptionData): Promise<PollOptionEntity> {
    return this.prisma.pollOption.create({
      data,
    });
  }

  async update(
    uuid: string,
    data: UpdatePollOptionData,
  ): Promise<PollOptionEntity> {
    return this.prisma.pollOption.update({
      where: {
        uuid,
      },
      data,
    });
  }

  async delete(uuid: string): Promise<void> {
    await this.prisma.pollOption.delete({
      where: {
        uuid,
      },
    });
  }
}

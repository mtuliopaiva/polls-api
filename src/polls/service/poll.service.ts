import { Injectable, NotFoundException } from '@nestjs/common';
import { PollStatus } from '@prisma/client';

import { CreatePollDto } from '../domain/dtos/create-poll.dto';
import { UpdatePollDto } from '../domain/dtos/update-poll.dto';
import { AuditService } from '../../audits/service/audit.service';
import { toAuditJson } from '../../audits/utils/convertToAuditJson';
import { PollRepository } from '../repositories/poll.repository';

@Injectable()
export class PollService {
  constructor(
    private readonly pollRepository: PollRepository,
    private readonly auditService: AuditService,
  ) {}

  async list(params?: { search?: string; status?: PollStatus }) {
    const [data, total] = await Promise.all([
      this.pollRepository.findMany(params),
      this.pollRepository.count(params),
    ]);

    return {
      data,
      total,
    };
  }

  async findByUuid(uuid: string) {
    const poll = await this.pollRepository.findByUuid(uuid);

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    return poll;
  }

  async create(
    dto: CreatePollDto,
    actor: {
      uuid: string;
      email: string;
    },
  ) {
    const createdPoll = await this.pollRepository.create({
      title: dto.title,
      description: dto.description,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      createdByUuid: actor.uuid,
    });

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'polls.create',
      entity: 'Poll',
      entityUuid: createdPoll.uuid,
      oldData: undefined,
      newData: toAuditJson(createdPoll),
    });

    return createdPoll;
  }

  async update(
    uuid: string,
    dto: UpdatePollDto,
    actor: {
      uuid: string;
      email: string;
    },
  ) {
    const oldPoll = await this.findByUuid(uuid);

    const data = {
      ...(dto.title ? { title: dto.title } : {}),
      ...(dto.description ? { description: dto.description } : {}),
      ...(dto.status ? { status: dto.status } : {}),
      ...(dto.startsAt
        ? {
            startsAt: new Date(dto.startsAt),
          }
        : {}),
      ...(dto.endsAt
        ? {
            endsAt: new Date(dto.endsAt),
          }
        : {}),
    };

    const updatedPoll = await this.pollRepository.update(uuid, data);

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'polls.update',
      entity: 'Poll',
      entityUuid: uuid,
      oldData: toAuditJson(oldPoll),
      newData: toAuditJson(updatedPoll),
    });

    return updatedPoll;
  }

  async softDelete(
    uuid: string,
    actor: {
      uuid: string;
      email: string;
    },
  ) {
    const oldPoll = await this.findByUuid(uuid);

    const deletedPoll = await this.pollRepository.update(uuid, {
      deletedAt: new Date(),
    });

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'polls.delete',
      entity: 'Poll',
      entityUuid: uuid,
      oldData: toAuditJson(oldPoll),
      newData: toAuditJson(deletedPoll),
    });

    return deletedPoll;
  }

  async restore(
    uuid: string,
    actor: {
      uuid: string;
      email: string;
    },
  ) {
    const deletedPoll = await this.pollRepository.findDeletedByUuid(uuid);

    if (!deletedPoll) {
      throw new NotFoundException('Deleted poll not found');
    }

    const restoredPoll = await this.pollRepository.update(uuid, {
      deletedAt: null,
    });

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'polls.restore',
      entity: 'Poll',
      entityUuid: uuid,
      oldData: toAuditJson(deletedPoll),
      newData: toAuditJson(restoredPoll),
    });

    return restoredPoll;
  }
}

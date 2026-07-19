import { Injectable, NotFoundException } from '@nestjs/common';

import { AuditService } from '../../audits/service/audit.service';
import { toAuditJson } from '../../audits/utils/convertToAuditJson';
import { CreatePollOptionDto } from '../domain/dtos/create-poll-option.dto';
import { UpdatePollOptionDto } from '../domain/dtos/update-poll-option.dto';
import { PollOptionRepository } from '../repositories/poll-option.repository';

@Injectable()
export class PollOptionService {
  constructor(
    private readonly pollOptionRepository: PollOptionRepository,
    private readonly auditService: AuditService,
  ) {}

  async list(pollUuid: string) {
    const [data, total] = await Promise.all([
      this.pollOptionRepository.findManyByPollUuid(pollUuid),
      this.pollOptionRepository.countByPollUuid(pollUuid),
    ]);

    return { data, total };
  }

  async findByUuid(pollUuid: string, uuid: string) {
    const option = await this.pollOptionRepository.findByUuidAndPollUuid(
      uuid,
      pollUuid,
    );

    if (!option) {
      throw new NotFoundException('Poll option not found');
    }

    return option;
  }

  async create(
    pollUuid: string,
    dto: CreatePollOptionDto,
    actor: {
      uuid: string;
      email: string;
    },
  ) {
    const labels = [...new Set(dto.labels.map((label) => label.trim()))].filter(
      Boolean,
    );

    const createdOptions = await Promise.all(
      labels.map((label) =>
        this.pollOptionRepository.create({
          pollUuid,
          label,
        }),
      ),
    );

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'pollsOptions.create',
      entity: 'PollOption',
      entityUuid: pollUuid,
      oldData: undefined,
      newData: toAuditJson(createdOptions),
    });

    return createdOptions;
  }

  async update(
    pollUuid: string,
    uuid: string,
    dto: UpdatePollOptionDto,
    actor: {
      uuid: string;
      email: string;
    },
  ) {
    const oldOption = await this.findByUuid(pollUuid, uuid);

    const data = {
      ...(dto.label ? { label: dto.label } : {}),
    };

    const updatedOption = await this.pollOptionRepository.update(uuid, data);

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'pollsOptions.update',
      entity: 'PollOption',
      entityUuid: uuid,
      oldData: toAuditJson(oldOption),
      newData: toAuditJson(updatedOption),
    });

    return updatedOption;
  }

  async delete(
    pollUuid: string,
    uuid: string,
    actor: {
      uuid: string;
      email: string;
    },
  ) {
    const oldOption = await this.findByUuid(pollUuid, uuid);

    await this.pollOptionRepository.delete(uuid);

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'pollsOptions.delete',
      entity: 'PollOption',
      entityUuid: uuid,
      oldData: toAuditJson(oldOption),
      newData: null,
    });
  }
}

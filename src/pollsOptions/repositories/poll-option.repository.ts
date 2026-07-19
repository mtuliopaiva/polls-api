import { PollOptionEntity } from '../domain/entities/poll-option.entity';
import { CreatePollOptionData } from '../domain/types/create-poll-option-data.type';
import { UpdatePollOptionData } from '../domain/types/update-poll-option-data.type';

export abstract class PollOptionRepository {
  abstract findManyByPollUuid(pollUuid: string): Promise<PollOptionEntity[]>;
  abstract countByPollUuid(pollUuid: string): Promise<number>;
  abstract findByUuid(uuid: string): Promise<PollOptionEntity | null>;
  abstract findByUuidAndPollUuid(
    uuid: string,
    pollUuid: string,
  ): Promise<PollOptionEntity | null>;

  abstract create(data: CreatePollOptionData): Promise<PollOptionEntity>;
  abstract update(
    uuid: string,
    data: UpdatePollOptionData,
  ): Promise<PollOptionEntity>;
  abstract delete(uuid: string): Promise<void>;
}

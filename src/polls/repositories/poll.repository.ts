import { PollEntity } from '../domain/entities/poll.entity';
import { CreatePollData } from '../domain/types/create-poll-data.type';
import { UpdatePollData } from '../domain/types/update-poll-data.type';
import { ListPollFilters } from '../domain/types/list-poll-filters.type';

export abstract class PollRepository {
  abstract findMany(filters?: ListPollFilters): Promise<PollEntity[]>;
  abstract count(filters?: ListPollFilters): Promise<number>;
  abstract findByUuid(uuid: string): Promise<PollEntity | null>;
  abstract findDeletedByUuid(uuid: string): Promise<PollEntity | null>;
  abstract create(data: CreatePollData): Promise<PollEntity>;
  abstract update(uuid: string, data: UpdatePollData): Promise<PollEntity>;
}

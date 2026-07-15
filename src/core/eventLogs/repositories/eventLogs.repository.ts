import { EventLogsEntity } from '../domain/entities/log.entity';
import { CreateEventLogsData } from '../domain/types/create-eventLogs-data.type';
import { ListEventLogsFilters } from '../domain/types/list-eventLogs-filters.type';

export abstract class EventLogsRepository {
  abstract create(data: CreateEventLogsData): Promise<EventLogsEntity>;
  abstract findMany(filters?: ListEventLogsFilters): Promise<EventLogsEntity[]>;
  abstract count(filters?: ListEventLogsFilters): Promise<number>;
  abstract findByUuid(uuid: string): Promise<EventLogsEntity | null>;
}

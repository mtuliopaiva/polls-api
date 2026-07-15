import { Injectable, NotFoundException } from '@nestjs/common';
import { EventLogsRepository } from '../repositories/eventLogs.repository';
import { CreateEventLogsData } from '../domain/types/create-eventLogs-data.type';
import { ListEventLogsFilters } from '../domain/types/list-eventLogs-filters.type';

@Injectable()
export class EventLogsService {
  constructor(private readonly eventlogRepository: EventLogsRepository) {}

  create(data: CreateEventLogsData) {
    return this.eventlogRepository.create(data);
  }

  error(data: Omit<CreateEventLogsData, 'level'>) {
    return this.eventlogRepository.create({
      ...data,
      level: 'error',
    });
  }

  warn(data: Omit<CreateEventLogsData, 'level'>) {
    return this.eventlogRepository.create({
      ...data,
      level: 'warn',
    });
  }

  info(data: Omit<CreateEventLogsData, 'level'>) {
    return this.eventlogRepository.create({
      ...data,
      level: 'info',
    });
  }

  async list(filters?: ListEventLogsFilters) {
    const [data, total] = await Promise.all([
      this.eventlogRepository.findMany(filters),
      this.eventlogRepository.count(filters),
    ]);

    return { data, total };
  }

  async findByUuid(uuid: string) {
    const log = await this.eventlogRepository.findByUuid(uuid);

    if (!log) {
      throw new NotFoundException('Log not found');
    }

    return log;
  }
}

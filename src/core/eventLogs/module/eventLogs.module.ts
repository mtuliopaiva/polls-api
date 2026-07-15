import { Module } from '@nestjs/common';
import { EventLogsService } from '../service/eventLogs.service';
import { EventLogsRepository } from '../repositories/eventLogs.repository';
import { PrismaEventLogsRepository } from '../repositories/prisma-eventLogs.repository';
import { EventLogsController } from '../controller/eventLogs.controller';
import { ListEventLogsHandler } from '../domain/queries/list-eventLogs.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { EventLogsByUuidHandler } from '../domain/queries/eventLogs-by-uuid.handler';

@Module({
  imports: [CqrsModule],
  controllers: [EventLogsController],
  providers: [
    EventLogsService,
    ListEventLogsHandler,
    EventLogsByUuidHandler,
    {
      provide: EventLogsRepository,
      useClass: PrismaEventLogsRepository,
    },
  ],
  exports: [EventLogsService],
})
export class EventLogsModule {}

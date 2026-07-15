import { Body, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Permissions } from '../../../auth/decorators/permissions-user.decorator';
import { PermissionsGuard } from '../../../auth/guards/permissions.guard';
import { Permission } from '../../../auth/enums/permission.type';
import { ListEventLogsQuery } from '../domain/queries/list-eventLogs.query';
import { EventLogsByUuidQuery } from '../domain/queries/eventLogs-by-uuid.query';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
@ApiTags('EventLogs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('eventLogs')
export class EventLogsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @Permissions(Permission.LOGS_READ)
  list(@Query('search') search?: string) {
    return this.queryBus.execute(
      new ListEventLogsQuery({
        search,
      }),
    );
  }

  @Get(':uuid')
  @Permissions(Permission.LOGS_READ)
  findByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(
      new EventLogsByUuidQuery({
        uuid,
      }),
    );
  }
}

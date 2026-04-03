import { Body, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Permissions } from '../../auth/decorators/permissions-user.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/enums/permission.type';
import { AuditsByUuidQuery } from '../domain/queries/audit-by-uuid.query';
import { ListAuditsQuery } from '../domain/queries/list-audit.query';
@ApiTags('Audits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('audits')
export class AuditController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @Permissions(Permission.AUDITS_READ)
  list(@Query('search') search?: string) {
    return this.queryBus.execute(
      new ListAuditsQuery({
        search,
      }),
    );
  }

  @Get(':uuid')
  @Permissions(Permission.AUDITS_READ)
  findByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(
      new AuditsByUuidQuery({
        uuid,
      }),
    );
  }
}

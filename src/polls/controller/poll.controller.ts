import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions-user.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Permission } from '../../auth/enums/permission.type';
import type { AuthUser } from '../../auth/types/auth-user.type';

import { CreatePollDto } from '../domain/dtos/create-poll.dto';

import { ListPollDto } from '../domain/dtos/list-poll.dto';
import { UpdatePollDto } from '../domain/dtos/update-poll.dto';
import { CreatePollCommand } from '../domain/commands/create-poll.command';
import { UpdatePollCommand } from '../domain/commands/update-poll.command';
import { DeletePollCommand } from '../domain/commands/delete-poll.command';
import { RestorePollCommand } from '../domain/commands/restore-poll.command';
import { PollByUuidQuery } from '../domain/queries/poll-by-uuid.query';
import { ListPollQuery } from '../domain/queries/list-poll.query';
import { ListPollFiltersDto } from '../domain/dtos/list-poll-filters.dto';

@ApiTags('Polls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('polls')
export class PollController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Permissions(Permission.POLLS_CREATE)
  @ApiOperation({
    summary: 'Criar uma enquete',
  })
  create(@Body() dto: CreatePollDto, @CurrentUser() currentUser: AuthUser) {
    return this.commandBus.execute(
      new CreatePollCommand({
        dto,
        currentUserUuid: currentUser.uuid,
        currentUserEmail: currentUser.email,
      }),
    );
  }

  @Get()
  @Permissions(Permission.POLLS_READ)
  @ApiOperation({
    summary: 'Listar enquetes',
  })
  list(@Query() filters: ListPollFiltersDto) {
    return this.queryBus.execute(new ListPollQuery(filters));
  }

  @Get(':uuid')
  @Permissions(Permission.POLLS_READ)
  @ApiOperation({
    summary: 'Buscar uma enquete pelo UUID',
  })
  findByUuid(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.queryBus.execute(
      new PollByUuidQuery({
        uuid,
      }),
    );
  }

  @Patch(':uuid')
  @Permissions(Permission.POLLS_UPDATE)
  @ApiOperation({
    summary: 'Atualizar uma enquete',
  })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdatePollDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.commandBus.execute(
      new UpdatePollCommand({
        uuid,
        dto,
        currentUserUuid: currentUser.uuid,
        currentUserEmail: currentUser.email,
      }),
    );
  }

  @Delete(':uuid')
  @Permissions(Permission.POLLS_DELETE)
  @ApiOperation({
    summary: 'Excluir uma enquete',
  })
  delete(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.commandBus.execute(
      new DeletePollCommand({
        uuid,
        currentUserUuid: currentUser.uuid,
        currentUserEmail: currentUser.email,
      }),
    );
  }

  @Post(':uuid/restore')
  @Permissions(Permission.POLLS_RESTORE)
  @ApiOperation({
    summary: 'Restaurar uma enquete excluída',
  })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.commandBus.execute(
      new RestorePollCommand({
        uuid,
        currentUserUuid: currentUser.uuid,
        currentUserEmail: currentUser.email,
      }),
    );
  }
}

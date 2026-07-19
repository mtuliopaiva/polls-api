import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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

import { CreatePollOptionDto } from '../domain/dtos/create-poll-option.dto';
import { UpdatePollOptionDto } from '../domain/dtos/update-poll-option.dto';

import { CreatePollOptionCommand } from '../domain/commands/create-poll-option.command';
import { UpdatePollOptionCommand } from '../domain/commands/update-poll-option.command';
import { DeletePollOptionCommand } from '../domain/commands/delete-poll-option.command';

import { ListPollOptionQuery } from '../domain/queries/list-poll-option.query';
import { PollOptionByUuidQuery } from '../domain/queries/poll-option-by-uuid.query';

@ApiTags('Poll Options')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('polls/:pollUuid/options')
export class PollOptionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Permissions(Permission.POLLS_UPDATE)
  @ApiOperation({
    summary: 'Criar uma opção para uma enquete',
  })
  create(
    @Param('pollUuid', ParseUUIDPipe) pollUuid: string,
    @Body() dto: CreatePollOptionDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.commandBus.execute(
      new CreatePollOptionCommand({
        pollUuid,
        dto,
        currentUserUuid: currentUser.uuid,
        currentUserEmail: currentUser.email,
      }),
    );
  }

  @Get()
  @Permissions(Permission.POLLS_READ)
  @ApiOperation({
    summary: 'Listar opções de uma enquete',
  })
  list(@Param('pollUuid', ParseUUIDPipe) pollUuid: string) {
    return this.queryBus.execute(
      new ListPollOptionQuery({
        pollUuid,
      }),
    );
  }

  @Get(':uuid')
  @Permissions(Permission.POLLS_READ)
  @ApiOperation({
    summary: 'Buscar uma opção pelo UUID',
  })
  findByUuid(
    @Param('pollUuid', ParseUUIDPipe) pollUuid: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.queryBus.execute(
      new PollOptionByUuidQuery({
        pollUuid,
        uuid,
      }),
    );
  }

  @Patch(':uuid')
  @Permissions(Permission.POLLS_UPDATE)
  @ApiOperation({
    summary: 'Atualizar uma opção da enquete',
  })
  update(
    @Param('pollUuid', ParseUUIDPipe) pollUuid: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdatePollOptionDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.commandBus.execute(
      new UpdatePollOptionCommand({
        pollUuid,
        uuid,
        dto,
        currentUserUuid: currentUser.uuid,
        currentUserEmail: currentUser.email,
      }),
    );
  }

  @Delete(':uuid')
  @Permissions(Permission.POLLS_UPDATE)
  @ApiOperation({
    summary: 'Excluir uma opção da enquete',
  })
  delete(
    @Param('pollUuid', ParseUUIDPipe) pollUuid: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.commandBus.execute(
      new DeletePollOptionCommand({
        pollUuid,
        uuid,
        currentUserUuid: currentUser.uuid,
        currentUserEmail: currentUser.email,
      }),
    );
  }
}

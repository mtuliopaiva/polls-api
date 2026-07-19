import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthUser } from '../../auth/types/auth-user.type';

import { CreateVoteDto } from '../domain/dtos/create-vote.dto';
import { CreateVoteCommand } from '../domain/commands/create-vote.command';
import { ListVoteQuery } from '../domain/queries/list-vote.query';

@ApiTags('Votes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('polls/:pollUuid/votes')
export class VoteController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar voto em uma enquete',
  })
  create(
    @Param('pollUuid', ParseUUIDPipe) pollUuid: string,
    @Body() dto: CreateVoteDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.commandBus.execute(
      new CreateVoteCommand({
        pollUuid,
        dto,
        currentUserUuid: currentUser.uuid,
      }),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar votos agregados da enquete',
  })
  list(
    @Param('pollUuid', ParseUUIDPipe) pollUuid: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.queryBus.execute(
      new ListVoteQuery({
        pollUuid,
        currentUserUuid: currentUser.uuid,
      }),
    );
  }
}

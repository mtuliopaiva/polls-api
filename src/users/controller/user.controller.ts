import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateUserDto } from '../domain/dtos/update-user.dto';
import { UpdateUserCommand } from '../domain/commands/update-user.command';
import { DeleteUserCommand } from '../domain/commands/delete-user.command';
import { RestoreUserCommand } from '../domain/commands/restore-user.command';
import { ListUserQuery } from '../domain/queries/list-user.query';
import { UserByUuidQuery } from '../domain/queries/user-by-uuid.query';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Users')
//@ApiBearerAuth()
//@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  list(@Query('search') search?: string) {
    return this.queryBus.execute(
      new ListUserQuery({
        search,
      }),
    );
  }

  @Get(':uuid')
  findByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new UserByUuidQuery(uuid));
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(uuid, dto));
  }

  @Delete(':uuid')
  delete(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteUserCommand(uuid));
  }

  @Post(':uuid/restore')
  restore(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new RestoreUserCommand(uuid));
  }
}

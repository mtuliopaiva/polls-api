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
import { Permissions } from '../../auth/decorators/permissions-user.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/enums/permission.type';
import { SelfOrAdminGuard } from '../../auth/guards/self-or-admin.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthUser } from '../../auth/types/auth-user.type';
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @Permissions(Permission.USERS_READ)
  list(@Query('search') search?: string) {
    return this.queryBus.execute(
      new ListUserQuery({
        search,
      }),
    );
  }

  @Get(':uuid')
  @UseGuards(SelfOrAdminGuard)
  @Permissions(Permission.USERS_READ)
  findByUuid(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.queryBus.execute(
      new UserByUuidQuery({
        uuid,
        currentUserUuid: currentUser.uuid,
      }),
    );
  }

  @Patch(':uuid')
  @UseGuards(SelfOrAdminGuard)
  @Permissions(Permission.USERS_UPDATE)
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.commandBus.execute(
      new UpdateUserCommand({
        uuid,
        dto,
        currentUserUuid: currentUser.uuid,
        currentUserEmail: currentUser.email,
      }),
    );
  }

  @Delete(':uuid')
  @UseGuards(SelfOrAdminGuard)
  @Permissions(Permission.USERS_DELETE)
  delete(@Param('uuid') uuid: string, @CurrentUser() currentUser: AuthUser) {
    return this.commandBus.execute(
      new DeleteUserCommand({
        uuid,
        currentUserUuid: currentUser.uuid,
        currentUserEmail: currentUser.email,
      }),
    );
  }

  @Post(':uuid/restore')
  @UseGuards(SelfOrAdminGuard)
  @Permissions(Permission.USERS_RESTORE)
  restore(@Param('uuid') uuid: string, @CurrentUser() currentUser: AuthUser) {
    return this.commandBus.execute(
      new RestoreUserCommand({
        uuid,
        currentUserUuid: currentUser.uuid,
        currentUserEmail: currentUser.email,
      }),
    );
  }
}

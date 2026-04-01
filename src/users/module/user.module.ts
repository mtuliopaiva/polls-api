import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';

import { UpdateUserHandler } from '../domain/commands/update-user.handler';
import { DeleteUserHandler } from '../domain/commands/delete-user.handler';
import { RestoreUserHandler } from '../domain/commands/restore-user.handler';

import { ListUserHandler } from '../domain/queries/list-user.handler';
import { UserByUuidHandler } from '../domain/queries/user-by-uuid.handler';

import { UserRepository } from '../repositories/user.repository';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';

const CommandHandlers = [
  UpdateUserHandler,
  DeleteUserHandler,
  RestoreUserHandler,
];

const QueryHandlers = [ListUserHandler, UserByUuidHandler];

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },

    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [UserRepository],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { AuthLoginHandler } from '../domain/commands/login.handler';
import { RegisterHandler } from '../domain/commands/register.handler';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { UserModule } from '../../users/module/user.module';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [CqrsModule, PassportModule, JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthLoginHandler,
    RegisterHandler,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}

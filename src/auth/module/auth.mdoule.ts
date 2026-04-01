import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { AuthLoginHandler } from '../domain/commands/login.handler';

import { PrismaModule } from '../../core/database/prisma.module';
import { RegisterHandler } from '../domain/commands/register.handler';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtAuthStrategy } from '../guards/jwt-auth.strategy';

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthLoginHandler,
    RegisterHandler,
    JwtAuthGuard,
    JwtAuthStrategy,
  ],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}

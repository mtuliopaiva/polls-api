import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module/auth.module';
import { UserModule } from './users/module/user.module';
import { LogModule } from './logs/module/log.module';
import { AuditModule } from './audits/module/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    LogModule,
    AuditModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

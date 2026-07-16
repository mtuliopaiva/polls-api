import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module/auth.module';
import { UserModule } from './users/module/user.module';
import { EventLogsModule } from './core/eventLogs/module/eventLogs.module';
import { AuditModule } from './audits/module/audit.module';
import { PollModule } from './polls/module/poll.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    EventLogsModule,
    AuditModule,
    PollModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

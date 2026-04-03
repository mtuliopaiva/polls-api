import { Module } from '@nestjs/common';
import { AuditService } from '../service/audit.service';
import { AuditRepository } from '../repositories/audit.repository';
import { PrismaAuditRepository } from '../repositories/prisma-audit.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { AuditController } from '../controller/audit.controller';
import { AuditsByUuidHandler } from '../domain/queries/audit-by-uuid.handler';
import { ListAuditsHandler } from '../domain/queries/list-audit.handler';

@Module({
  imports: [CqrsModule],
  controllers: [AuditController],
  providers: [
    AuditService,
    ListAuditsHandler,
    AuditsByUuidHandler,
    {
      provide: AuditRepository,
      useClass: PrismaAuditRepository,
    },
  ],
  exports: [AuditService],
})
export class AuditModule {}

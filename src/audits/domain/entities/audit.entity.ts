import { JsonValue } from '@prisma/client/runtime/library';

export class AuditEntity {
  uuid: string;
  actorUuid: string | null;
  actorEmail: string | null;
  action: string;
  entity: string;
  entityUuid: string | null;
  oldData: JsonValue | null;
  newData: JsonValue | null;
  metadata: JsonValue | null;
  createdAt: Date;
}

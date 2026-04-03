import { JsonValue } from '@prisma/client/runtime/library';

export type CreateAuditData = {
  actorUuid?: string;
  actorEmail?: string;
  action: string;
  entity: string;
  entityUuid?: string;
  oldData?: JsonValue;
  newData?: JsonValue;
  metadata?: JsonValue;
};

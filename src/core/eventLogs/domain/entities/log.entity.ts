import { JsonValue } from '@prisma/client/runtime/library';

export class EventLogsEntity {
  uuid: string;
  level: string;
  message: string;
  context: string | null;
  stack: string | null;
  metadata: JsonValue | null;
  createdAt: Date;
}

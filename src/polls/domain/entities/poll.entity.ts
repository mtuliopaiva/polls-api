import { PollStatus } from '@prisma/client';

export class PollEntity {
  uuid: string;
  title: string;
  description: string | null;
  status: PollStatus;
  startsAt: Date | null;
  endsAt: Date | null;
  createdByUuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

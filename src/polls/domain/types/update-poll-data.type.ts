import { PollStatus } from '@prisma/client';

export type UpdatePollData = {
  title?: string;
  description?: string | null;
  status?: PollStatus;
  startsAt?: Date | null;
  endsAt?: Date | null;
  deletedAt?: Date | null;
};

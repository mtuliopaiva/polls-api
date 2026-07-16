import { PollStatus } from '@prisma/client';

export type ListPollFilters = {
  search?: string;
  status?: PollStatus;
};

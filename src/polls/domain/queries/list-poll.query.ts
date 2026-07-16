import { PollStatus } from '@prisma/client';

export class ListPollQuery {
  constructor(
    public readonly data: {
      search?: string;
      status?: PollStatus;
    },
  ) {}
}

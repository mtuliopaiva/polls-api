export type CreatePollData = {
  title: string;
  description?: string;
  startsAt?: Date;
  endsAt?: Date;
  createdByUuid: string;
};

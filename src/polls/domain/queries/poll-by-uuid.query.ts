export class PollByUuidQuery {
  constructor(
    public readonly data: {
      uuid: string;
    },
  ) {}
}

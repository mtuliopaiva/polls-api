export class EventLogsByUuidQuery {
  constructor(
    public readonly data: {
      uuid: string;
    },
  ) {}
}

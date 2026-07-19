export class PollOptionByUuidQuery {
  constructor(
    public readonly data: {
      pollUuid: string;
      uuid: string;
    },
  ) {}
}

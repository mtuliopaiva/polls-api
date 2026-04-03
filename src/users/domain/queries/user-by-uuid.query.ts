export class UserByUuidQuery {
  constructor(
    public readonly data: {
      uuid: string;
      currentUserUuid: string;
    },
  ) {}
}

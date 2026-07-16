export class RestorePollCommand {
  constructor(
    public readonly data: {
      uuid: string;
      currentUserUuid: string;
      currentUserEmail: string;
    },
  ) {}
}

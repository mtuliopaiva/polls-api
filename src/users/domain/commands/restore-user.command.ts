export class RestoreUserCommand {
  constructor(
    public readonly data: {
      uuid: string;
      currentUserUuid: string;
      currentUserEmail: string;
    },
  ) {}
}

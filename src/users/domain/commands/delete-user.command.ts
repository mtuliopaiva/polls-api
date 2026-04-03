export class DeleteUserCommand {
  constructor(
    public readonly data: {
      uuid: string;
      currentUserUuid: string;
      currentUserEmail: string;
    },
  ) {}
}

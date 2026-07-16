export class DeletePollCommand {
  constructor(
    public readonly data: {
      uuid: string;
      currentUserUuid: string;
      currentUserEmail: string;
    },
  ) {}
}

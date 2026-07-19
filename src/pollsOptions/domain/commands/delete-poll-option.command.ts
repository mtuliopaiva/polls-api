export class DeletePollOptionCommand {
  constructor(
    public readonly data: {
      pollUuid: string;
      uuid: string;
      currentUserUuid: string;
      currentUserEmail: string;
    },
  ) {}
}

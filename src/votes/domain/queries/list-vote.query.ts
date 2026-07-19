export class ListVoteQuery {
  constructor(
    public readonly data: {
      pollUuid: string;
      currentUserUuid: string;
    },
  ) {}
}

export class ListUserQuery {
  constructor(
    public readonly data: {
      search?: string;
    },
  ) {}
}

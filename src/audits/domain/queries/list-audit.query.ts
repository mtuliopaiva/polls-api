export class ListAuditsQuery {
  constructor(
    public readonly data: {
      search?: string;
    },
  ) {}
}

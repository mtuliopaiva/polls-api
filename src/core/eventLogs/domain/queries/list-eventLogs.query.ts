export class ListEventLogsQuery {
  constructor(
    public readonly data: {
      search?: string;
    },
  ) {}
}

export class AuditsByUuidQuery {
  constructor(
    public readonly data: {
      uuid: string;
    },
  ) {}
}

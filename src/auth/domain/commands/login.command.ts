export class AuthLoginCommand {
  constructor(
    public readonly data: {
      email: string;
      password: string;
    },
  ) {}
}

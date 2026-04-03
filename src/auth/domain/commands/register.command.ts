export class RegisterCommand {
  constructor(
    public readonly data: {
      email: string;
      password: string;
    },
  ) {}
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../service/auth.service';
import { ForgotPasswordCommand } from './forgot-password.command';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(private readonly authService: AuthService) {}

  execute(command: ForgotPasswordCommand) {
    return this.authService.forgotPassword(command.email);
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../service/auth.service';
import { ResetPasswordCommand } from './reset-password.command';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(private readonly authService: AuthService) {}

  execute(command: ResetPasswordCommand) {
    return this.authService.resetPassword(command.token, command.newPassword);
  }
}

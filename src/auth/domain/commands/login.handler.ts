import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../service/auth.service';
import { AuthLoginCommand } from './login.command';
import { RegisterResponseDto } from '../dtos/register-response.dto';

@CommandHandler(AuthLoginCommand)
export class AuthLoginHandler implements ICommandHandler<AuthLoginCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: AuthLoginCommand): Promise<RegisterResponseDto> {
    const { email, password } = command.data;

    return this.authService.login(email, password);
  }
}

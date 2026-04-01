import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { AuthService } from '../../service/auth.service';
import { RegisterResponseDto } from '../dtos/register-response.dto';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: RegisterCommand): Promise<RegisterResponseDto> {
    return this.authService.register(command.dto);
  }
}

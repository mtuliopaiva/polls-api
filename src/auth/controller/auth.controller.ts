import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from '../domain/commands/register.command';
import { AuthRegisterDto } from '../domain/dtos/register-auth.dto';
import { AuthLoginDto } from '../domain/dtos/login-auth.dto';
import { AuthLoginCommand } from '../domain/commands/login.command';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  register(@Body() dto: AuthRegisterDto) {
    return this.commandBus.execute(
      new RegisterCommand({
        email: dto.email,
        password: dto.password,
      }),
    );
  }

  @Post('login')
  login(@Body() dto: AuthLoginDto) {
    return this.commandBus.execute(
      new AuthLoginCommand({
        email: dto.email,
        password: dto.password,
      }),
    );
  }
}

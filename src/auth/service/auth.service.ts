import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../users/repositories/user.repository';
import { AuthRegisterDto } from '../domain/dtos/register-auth.dto';

@Injectable()
export class AuthService {
  private readonly audience = 'users';
  private readonly issuer = 'login';

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getExpiresInSeconds(): number {
    const raw =
      this.configService.get<string>('JWT_EXPIRES_IN_SECONDS') ?? '604800';
    const value = Number(raw);

    return Number.isFinite(value) && value > 0 ? value : 604800;
  }

  private createToken(user: Pick<User, 'uuid' | 'email' | 'type'>): string {
    return this.jwtService.sign(
      {
        sub: user.uuid,
        email: user.email,
        type: user.type,
      },
      {
        expiresIn: this.getExpiresInSeconds(),
        issuer: this.issuer,
        audience: this.audience,
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      },
    );
  }

  async register(dto: AuthRegisterDto) {
    const existing = await this.userRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const saltRounds = Number(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS') ?? '10',
    );

    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      type: UserType.USER,
    });

    return {
      accessToken: this.createToken(user),
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.createToken(user),
    };
  }
}

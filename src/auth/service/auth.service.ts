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

  private createToken(user: {
    uuid: string;
    email: string;
    type: string;
    roles: string[];
    permissions: string[];
  }): string {
    return this.jwtService.sign(
      {
        sub: user.uuid,
        email: user.email,
        type: user.type,
        roles: user.roles,
        permissions: user.permissions,
      },
      {
        expiresIn: this.getExpiresInSeconds(),
        issuer: this.issuer,
        audience: this.audience,
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      },
    );
  }

  async register(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const saltRounds = Number(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS') ?? '10',
    );

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      type: 'USER',
    });

    await this.userRepository.assignRoleToUser(user.uuid, 'user');

    const authUser = await this.userRepository.findAuthUserByEmail(email);

    if (!authUser) {
      throw new UnauthorizedException('Unable to load registered user');
    }

    return {
      accessToken: this.createToken(authUser),
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findAuthUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const pass = await bcrypt.compare(password, user.password);

    if (!pass) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.createToken(user),
    };
  }
}

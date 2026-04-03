import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      issuer: 'login',
      audience: 'users',
    });
  }

  validate(payload: JwtPayload) {
    return {
      uuid: payload.sub,
      email: payload.email,
      type: payload.type,
      roles: payload.roles,
      permissions: payload.permissions,
    };
  }
}

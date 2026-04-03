import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthUser } from '../types/auth-user.type';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user: AuthUser;
      params: { uuid?: string };
    }>();

    const currentUser = request.user;
    const targetUuid = request.params.uuid;

    if (!currentUser) {
      throw new ForbiddenException('User not authenticated');
    }

    if (currentUser.type === 'ADMIN') return true;
    if (currentUser.uuid === targetUuid) return true;

    throw new ForbiddenException('You cannot perform this action');
  }
}

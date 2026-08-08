import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (user && user.role === UserRole.ORGANIZER && !user.isVerified) {
      throw new ForbiddenException(
        'Akses ditolak: Akun organizer Anda belum diverifikasi oleh admin (isVerified: false). Anda tidak dapat melakukan operasi ini.',
      );
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    if (!user) {
      throw new ForbiddenException('Akses ditolak: User belum terautentikasi');
    }
    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException(
        'Akses ditolak: Anda tidak memiliki izin untuk tindakan ini',
      );
    }
    return true;
  }
}

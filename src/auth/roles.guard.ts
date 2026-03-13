import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { role_scope_type } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<role_scope_type[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    
    // Check if the user has a role with matching scope_type
    // Platform admins usually have 'platform' scope_type
    if (!user || !user.user_roles) return false;

    return user.user_roles.some((userRole: any) => requiredRoles.includes(userRole.scope_type));
  }
}

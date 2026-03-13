import { SetMetadata } from '@nestjs/common';
import { role_scope_type } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: role_scope_type[]) => SetMetadata(ROLES_KEY, roles);

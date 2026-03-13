import { role_scope_type } from '@prisma/client';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: role_scope_type[]) => import("@nestjs/common").CustomDecorator<string>;

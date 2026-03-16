import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<({
        user_roles: ({
            roles: {
                id: string;
                code: string;
                name: string;
                description: string | null;
                created_at: Date;
            };
        } & {
            id: string;
            user_id: string;
            role_id: string;
            scope_type: import(".prisma/client").$Enums.role_scope_type;
            scope_id: string | null;
            created_at: Date;
        })[];
        merchant_profiles: {
            id: string;
            business_name: string;
        }[];
    } & {
        id: string;
        phone_e164: string | null;
        email: string | null;
        password_hash: string | null;
        auth_provider: import(".prisma/client").$Enums.auth_provider_type;
        google_sub: string | null;
        first_name: string;
        last_name: string | null;
        photo_url: string | null;
        status: import(".prisma/client").$Enums.user_status_type;
        is_phone_verified: boolean;
        is_email_verified: boolean;
        last_login_at: Date | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        phone_e164: string | null;
        email: string | null;
        password_hash: string | null;
        auth_provider: import(".prisma/client").$Enums.auth_provider_type;
        google_sub: string | null;
        first_name: string;
        last_name: string | null;
        photo_url: string | null;
        status: import(".prisma/client").$Enums.user_status_type;
        is_phone_verified: boolean;
        is_email_verified: boolean;
        last_login_at: Date | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    updateStatus(id: string, status: 'pending' | 'active' | 'suspended' | 'deleted'): Promise<{
        id: string;
        phone_e164: string | null;
        email: string | null;
        password_hash: string | null;
        auth_provider: import(".prisma/client").$Enums.auth_provider_type;
        google_sub: string | null;
        first_name: string;
        last_name: string | null;
        photo_url: string | null;
        status: import(".prisma/client").$Enums.user_status_type;
        is_phone_verified: boolean;
        is_email_verified: boolean;
        last_login_at: Date | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
}

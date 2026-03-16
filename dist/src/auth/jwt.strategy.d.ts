import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: any): Promise<{
        merchant_id: any;
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
export {};

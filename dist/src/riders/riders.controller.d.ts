import { RidersService } from './riders.service';
export declare class RidersController {
    private readonly ridersService;
    constructor(ridersService: RidersService);
    findAll(): Promise<({
        users: {
            id: string;
            phone_e164: string | null;
            email: string | null;
            first_name: string;
            last_name: string | null;
        };
    } & {
        id: string;
        user_id: string;
        document_type: string;
        document_number: string;
        vehicle_type: import(".prisma/client").$Enums.vehicle_type_enum;
        vehicle_plate: string | null;
        status: import(".prisma/client").$Enums.rider_status_type;
        is_online: boolean;
        is_available: boolean;
        rating_avg: import("@prisma/client/runtime/library").Decimal | null;
        total_deliveries: number;
        created_at: Date;
        updated_at: Date;
    })[]>;
    findOne(id: string): Promise<{
        users: {
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
        };
    } & {
        id: string;
        user_id: string;
        document_type: string;
        document_number: string;
        vehicle_type: import(".prisma/client").$Enums.vehicle_type_enum;
        vehicle_plate: string | null;
        status: import(".prisma/client").$Enums.rider_status_type;
        is_online: boolean;
        is_available: boolean;
        rating_avg: import("@prisma/client/runtime/library").Decimal | null;
        total_deliveries: number;
        created_at: Date;
        updated_at: Date;
    }>;
    create(data: any): Promise<{
        users: {
            phone_e164: string | null;
            email: string | null;
            first_name: string;
            last_name: string | null;
        };
    } & {
        id: string;
        user_id: string;
        document_type: string;
        document_number: string;
        vehicle_type: import(".prisma/client").$Enums.vehicle_type_enum;
        vehicle_plate: string | null;
        status: import(".prisma/client").$Enums.rider_status_type;
        is_online: boolean;
        is_available: boolean;
        rating_avg: import("@prisma/client/runtime/library").Decimal | null;
        total_deliveries: number;
        created_at: Date;
        updated_at: Date;
    }>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        user_id: string;
        document_type: string;
        document_number: string;
        vehicle_type: import(".prisma/client").$Enums.vehicle_type_enum;
        vehicle_plate: string | null;
        status: import(".prisma/client").$Enums.rider_status_type;
        is_online: boolean;
        is_available: boolean;
        rating_avg: import("@prisma/client/runtime/library").Decimal | null;
        total_deliveries: number;
        created_at: Date;
        updated_at: Date;
    }>;
}

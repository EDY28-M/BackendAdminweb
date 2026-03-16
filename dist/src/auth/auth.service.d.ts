import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    loginAdmin(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string | null;
            first_name: string;
            last_name: string | null;
        };
    }>;
    loginMerchant(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string | null;
            first_name: string;
            last_name: string | null;
            merchant_id: string;
            stores: {
                id: string;
                merchant_id: string;
                business_category_id: string;
                name: string;
                slug: string;
                description: string | null;
                logo_url: string | null;
                cover_image_url: string | null;
                service_mode: import(".prisma/client").$Enums.service_mode_type;
                catalog_mode: import(".prisma/client").$Enums.catalog_mode_type;
                status: import(".prisma/client").$Enums.store_status_type;
                avg_rating: import("@prisma/client/runtime/library").Decimal | null;
                total_reviews: number;
                min_order_amount: import("@prisma/client/runtime/library").Decimal | null;
                created_at: Date;
                updated_at: Date;
            }[];
        };
    }>;
}

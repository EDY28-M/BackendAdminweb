import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class StoresService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        merchant_profiles: {
            id: string;
            owner_user_id: string;
            business_name: string;
            legal_name: string | null;
            tax_id: string | null;
            billing_email: string | null;
            phone_e164: string | null;
            logo_url: string | null;
            status: import(".prisma/client").$Enums.merchant_status_type;
            created_at: Date;
            updated_at: Date;
        };
        business_categories: {
            id: string;
            code: string;
            name: string;
            is_active: boolean;
            created_at: Date;
        };
    } & {
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
        avg_rating: Prisma.Decimal | null;
        total_reviews: number;
        min_order_amount: Prisma.Decimal | null;
        created_at: Date;
        updated_at: Date;
    })[]>;
    getMerchants(): Promise<({
        users: {
            email: string | null;
            first_name: string;
            last_name: string | null;
        };
    } & {
        id: string;
        owner_user_id: string;
        business_name: string;
        legal_name: string | null;
        tax_id: string | null;
        billing_email: string | null;
        phone_e164: string | null;
        logo_url: string | null;
        status: import(".prisma/client").$Enums.merchant_status_type;
        created_at: Date;
        updated_at: Date;
    })[]>;
    getCategories(): Promise<{
        id: string;
        code: string;
        name: string;
        is_active: boolean;
        created_at: Date;
    }[]>;
    findOne(id: string): Promise<{
        merchant_profiles: {
            id: string;
            owner_user_id: string;
            business_name: string;
            legal_name: string | null;
            tax_id: string | null;
            billing_email: string | null;
            phone_e164: string | null;
            logo_url: string | null;
            status: import(".prisma/client").$Enums.merchant_status_type;
            created_at: Date;
            updated_at: Date;
        };
        business_categories: {
            id: string;
            code: string;
            name: string;
            is_active: boolean;
            created_at: Date;
        };
    } & {
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
        avg_rating: Prisma.Decimal | null;
        total_reviews: number;
        min_order_amount: Prisma.Decimal | null;
        created_at: Date;
        updated_at: Date;
    }>;
    update(id: string, updateData: Prisma.storesUpdateInput): Promise<{
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
        avg_rating: Prisma.Decimal | null;
        total_reviews: number;
        min_order_amount: Prisma.Decimal | null;
        created_at: Date;
        updated_at: Date;
    }>;
    create(createData: Prisma.storesUncheckedCreateInput): Promise<{
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
        avg_rating: Prisma.Decimal | null;
        total_reviews: number;
        min_order_amount: Prisma.Decimal | null;
        created_at: Date;
        updated_at: Date;
    }>;
    createCategory(data: any): Promise<{
        id: string;
        code: string;
        name: string;
        is_active: boolean;
        created_at: Date;
    }>;
    createMerchant(data: any): Promise<{
        id: string;
        owner_user_id: string;
        business_name: string;
        legal_name: string | null;
        tax_id: string | null;
        billing_email: string | null;
        phone_e164: string | null;
        logo_url: string | null;
        status: import(".prisma/client").$Enums.merchant_status_type;
        created_at: Date;
        updated_at: Date;
    }>;
}

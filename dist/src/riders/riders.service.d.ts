import { PrismaService } from '../prisma/prisma.service';
export declare class RidersService {
    private prisma;
    constructor(prisma: PrismaService);
    private getActiveRiderByUserId;
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
    create(data: {
        first_name: string;
        last_name: string;
        email: string;
        phone?: string;
        password: string;
        document_type: string;
        document_number: string;
        vehicle_type: 'bici' | 'moto' | 'auto';
        vehicle_plate?: string;
    }): Promise<{
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
    updateStatus(id: string, status: string): Promise<{
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
    getAvailableOrders(userId: string): Promise<({
        addresses: {
            district: string;
            city: string;
            address_line1: string;
            reference: string | null;
        };
        store_branches: {
            name: string;
        };
        stores: {
            name: string;
        };
        deliveries: {
            status: import(".prisma/client").$Enums.delivery_status_type;
            distance_km: import("@prisma/client/runtime/library").Decimal | null;
            estimated_minutes: number | null;
        } | null;
    } & {
        id: string;
        order_code: string;
        customer_user_id: string;
        store_id: string;
        branch_id: string;
        rider_user_id: string | null;
        delivery_address_id: string;
        source_channel: import(".prisma/client").$Enums.source_channel_type;
        order_type: import(".prisma/client").$Enums.order_type_enum;
        business_category_snapshot: string;
        status: import(".prisma/client").$Enums.order_status_type;
        payment_status: import(".prisma/client").$Enums.payment_status_type;
        fulfillment_status: import(".prisma/client").$Enums.fulfillment_status_type;
        subtotal_amount: import("@prisma/client/runtime/library").Decimal;
        modifier_total_amount: import("@prisma/client/runtime/library").Decimal;
        discount_amount: import("@prisma/client/runtime/library").Decimal;
        delivery_fee_amount: import("@prisma/client/runtime/library").Decimal;
        service_fee_amount: import("@prisma/client/runtime/library").Decimal;
        tip_amount: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        customer_name_snapshot: string;
        customer_phone_snapshot: string;
        scheduled_for: Date | null;
        accepted_at: Date | null;
        preparing_at: Date | null;
        ready_for_pickup_at: Date | null;
        rider_assigned_at: Date | null;
        picked_up_at: Date | null;
        delivered_at: Date | null;
        cancelled_at: Date | null;
        cancellation_reason: string | null;
        created_at: Date;
        updated_at: Date;
    })[]>;
    getMyActiveOrders(userId: string): Promise<({
        addresses: {
            district: string;
            city: string;
            address_line1: string;
            reference: string | null;
        };
        store_branches: {
            name: string;
        };
        stores: {
            name: string;
        };
        deliveries: {
            status: import(".prisma/client").$Enums.delivery_status_type;
            picked_up_at: Date | null;
            distance_km: import("@prisma/client/runtime/library").Decimal | null;
            estimated_minutes: number | null;
            assigned_at: Date | null;
        } | null;
    } & {
        id: string;
        order_code: string;
        customer_user_id: string;
        store_id: string;
        branch_id: string;
        rider_user_id: string | null;
        delivery_address_id: string;
        source_channel: import(".prisma/client").$Enums.source_channel_type;
        order_type: import(".prisma/client").$Enums.order_type_enum;
        business_category_snapshot: string;
        status: import(".prisma/client").$Enums.order_status_type;
        payment_status: import(".prisma/client").$Enums.payment_status_type;
        fulfillment_status: import(".prisma/client").$Enums.fulfillment_status_type;
        subtotal_amount: import("@prisma/client/runtime/library").Decimal;
        modifier_total_amount: import("@prisma/client/runtime/library").Decimal;
        discount_amount: import("@prisma/client/runtime/library").Decimal;
        delivery_fee_amount: import("@prisma/client/runtime/library").Decimal;
        service_fee_amount: import("@prisma/client/runtime/library").Decimal;
        tip_amount: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        customer_name_snapshot: string;
        customer_phone_snapshot: string;
        scheduled_for: Date | null;
        accepted_at: Date | null;
        preparing_at: Date | null;
        ready_for_pickup_at: Date | null;
        rider_assigned_at: Date | null;
        picked_up_at: Date | null;
        delivered_at: Date | null;
        cancelled_at: Date | null;
        cancellation_reason: string | null;
        created_at: Date;
        updated_at: Date;
    })[]>;
    acceptOrder(userId: string, orderId: string): Promise<({
        store_branches: {
            name: string;
        };
        stores: {
            name: string;
        };
        deliveries: {
            id: string;
            order_id: string;
            rider_profile_id: string | null;
            pickup_branch_id: string;
            dropoff_address_id: string;
            status: import(".prisma/client").$Enums.delivery_status_type;
            distance_km: import("@prisma/client/runtime/library").Decimal | null;
            estimated_minutes: number | null;
            assigned_at: Date | null;
            picked_up_at: Date | null;
            delivered_at: Date | null;
            failed_at: Date | null;
            failure_reason: string | null;
            created_at: Date;
            updated_at: Date;
        } | null;
    } & {
        id: string;
        order_code: string;
        customer_user_id: string;
        store_id: string;
        branch_id: string;
        rider_user_id: string | null;
        delivery_address_id: string;
        source_channel: import(".prisma/client").$Enums.source_channel_type;
        order_type: import(".prisma/client").$Enums.order_type_enum;
        business_category_snapshot: string;
        status: import(".prisma/client").$Enums.order_status_type;
        payment_status: import(".prisma/client").$Enums.payment_status_type;
        fulfillment_status: import(".prisma/client").$Enums.fulfillment_status_type;
        subtotal_amount: import("@prisma/client/runtime/library").Decimal;
        modifier_total_amount: import("@prisma/client/runtime/library").Decimal;
        discount_amount: import("@prisma/client/runtime/library").Decimal;
        delivery_fee_amount: import("@prisma/client/runtime/library").Decimal;
        service_fee_amount: import("@prisma/client/runtime/library").Decimal;
        tip_amount: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        customer_name_snapshot: string;
        customer_phone_snapshot: string;
        scheduled_for: Date | null;
        accepted_at: Date | null;
        preparing_at: Date | null;
        ready_for_pickup_at: Date | null;
        rider_assigned_at: Date | null;
        picked_up_at: Date | null;
        delivered_at: Date | null;
        cancelled_at: Date | null;
        cancellation_reason: string | null;
        created_at: Date;
        updated_at: Date;
    }) | null>;
    rejectOrder(userId: string, orderId: string, reason?: string): Promise<{
        success: boolean;
        order_id: string;
        message: string;
    }>;
    updateMyOrderStatus(userId: string, orderId: string, status: 'picked_up' | 'on_the_way' | 'delivered'): Promise<({
        store_branches: {
            name: string;
        };
        stores: {
            name: string;
        };
        deliveries: {
            id: string;
            order_id: string;
            rider_profile_id: string | null;
            pickup_branch_id: string;
            dropoff_address_id: string;
            status: import(".prisma/client").$Enums.delivery_status_type;
            distance_km: import("@prisma/client/runtime/library").Decimal | null;
            estimated_minutes: number | null;
            assigned_at: Date | null;
            picked_up_at: Date | null;
            delivered_at: Date | null;
            failed_at: Date | null;
            failure_reason: string | null;
            created_at: Date;
            updated_at: Date;
        } | null;
    } & {
        id: string;
        order_code: string;
        customer_user_id: string;
        store_id: string;
        branch_id: string;
        rider_user_id: string | null;
        delivery_address_id: string;
        source_channel: import(".prisma/client").$Enums.source_channel_type;
        order_type: import(".prisma/client").$Enums.order_type_enum;
        business_category_snapshot: string;
        status: import(".prisma/client").$Enums.order_status_type;
        payment_status: import(".prisma/client").$Enums.payment_status_type;
        fulfillment_status: import(".prisma/client").$Enums.fulfillment_status_type;
        subtotal_amount: import("@prisma/client/runtime/library").Decimal;
        modifier_total_amount: import("@prisma/client/runtime/library").Decimal;
        discount_amount: import("@prisma/client/runtime/library").Decimal;
        delivery_fee_amount: import("@prisma/client/runtime/library").Decimal;
        service_fee_amount: import("@prisma/client/runtime/library").Decimal;
        tip_amount: import("@prisma/client/runtime/library").Decimal;
        total_amount: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        customer_name_snapshot: string;
        customer_phone_snapshot: string;
        scheduled_for: Date | null;
        accepted_at: Date | null;
        preparing_at: Date | null;
        ready_for_pickup_at: Date | null;
        rider_assigned_at: Date | null;
        picked_up_at: Date | null;
        delivered_at: Date | null;
        cancelled_at: Date | null;
        cancellation_reason: string | null;
        created_at: Date;
        updated_at: Date;
    }) | null>;
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let RidersService = class RidersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getActiveRiderByUserId(userId) {
        const rider = await this.prisma.rider_profiles.findUnique({
            where: { user_id: userId },
            include: {
                users: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                        phone_e164: true,
                    },
                },
            },
        });
        if (!rider) {
            throw new common_1.ForbiddenException('No tienes perfil de repartidor');
        }
        if (rider.status !== 'active') {
            throw new common_1.ForbiddenException('Tu cuenta de repartidor no está activa');
        }
        return rider;
    }
    async findAll() {
        return this.prisma.rider_profiles.findMany({
            include: {
                users: {
                    select: { id: true, first_name: true, last_name: true, email: true, phone_e164: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findOne(id) {
        const rider = await this.prisma.rider_profiles.findUnique({
            where: { id },
            include: {
                users: true,
            },
        });
        if (!rider)
            throw new common_1.NotFoundException('Repartidor no encontrado');
        return rider;
    }
    async create(data) {
        const { email, password, first_name, last_name, phone, document_type, document_number, vehicle_type, vehicle_plate } = data;
        try {
            return await this.prisma.$transaction(async (tx) => {
                const password_hash = await bcrypt.hash(password, 10);
                const user = await tx.users.create({
                    data: {
                        email,
                        first_name,
                        last_name: last_name || '',
                        password_hash,
                        auth_provider: 'email',
                        status: 'active',
                        phone_e164: phone || null,
                    },
                });
                let role = await tx.roles.findUnique({ where: { code: 'rider' } });
                if (!role) {
                    role = await tx.roles.create({
                        data: { code: 'rider', name: 'Repartidor' },
                    });
                }
                await tx.user_roles.create({
                    data: {
                        user_id: user.id,
                        role_id: role.id,
                        scope_type: 'platform',
                    },
                });
                const riderProfile = await tx.rider_profiles.create({
                    data: {
                        user_id: user.id,
                        document_type,
                        document_number,
                        vehicle_type,
                        vehicle_plate: vehicle_plate || null,
                        status: 'active',
                    },
                    include: {
                        users: { select: { first_name: true, last_name: true, email: true, phone_e164: true } },
                    },
                });
                return riderProfile;
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0] || 'campo';
                const names = { email: 'correo', phone_e164: 'teléfono' };
                throw new common_1.ConflictException(`El ${names[field] || field} ya está registrado.`);
            }
            throw error;
        }
    }
    async updateStatus(id, status) {
        return this.prisma.rider_profiles.update({
            where: { id },
            data: { status: status },
        });
    }
    async getAvailableOrders(userId) {
        await this.getActiveRiderByUserId(userId);
        return this.prisma.orders.findMany({
            where: {
                status: {
                    in: ['created', 'pending_store_acceptance', 'accepted_by_store', 'preparing', 'ready_for_pickup'],
                },
                deliveries: {
                    is: {
                        status: 'pending_assignment',
                        rider_profile_id: null,
                    },
                },
            },
            include: {
                stores: { select: { name: true } },
                store_branches: { select: { name: true } },
                addresses: {
                    select: {
                        address_line1: true,
                        reference: true,
                        district: true,
                        city: true,
                    },
                },
                deliveries: {
                    select: {
                        status: true,
                        estimated_minutes: true,
                        distance_km: true,
                    },
                },
            },
            orderBy: { created_at: 'asc' },
            take: 50,
        });
    }
    async getMyActiveOrders(userId) {
        const rider = await this.getActiveRiderByUserId(userId);
        return this.prisma.orders.findMany({
            where: {
                deliveries: {
                    is: { rider_profile_id: rider.id },
                },
                status: {
                    in: ['rider_assigned', 'preparing', 'ready_for_pickup', 'picked_up', 'on_the_way'],
                },
            },
            include: {
                stores: { select: { name: true } },
                store_branches: { select: { name: true } },
                addresses: {
                    select: {
                        address_line1: true,
                        reference: true,
                        district: true,
                        city: true,
                    },
                },
                deliveries: {
                    select: {
                        status: true,
                        estimated_minutes: true,
                        distance_km: true,
                        assigned_at: true,
                        picked_up_at: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
            take: 50,
        });
    }
    async acceptOrder(userId, orderId) {
        const rider = await this.getActiveRiderByUserId(userId);
        const order = await this.prisma.orders.findUnique({
            where: { id: orderId },
            include: { deliveries: true },
        });
        if (!order || !order.deliveries) {
            throw new common_1.NotFoundException('Pedido no encontrado');
        }
        if (order.deliveries.rider_profile_id &&
            order.deliveries.rider_profile_id !== rider.id) {
            throw new common_1.ConflictException('Este pedido ya fue tomado por otro repartidor');
        }
        const now = new Date();
        await this.prisma.$transaction([
            this.prisma.deliveries.update({
                where: { order_id: order.id },
                data: {
                    rider_profile_id: rider.id,
                    status: 'assigned',
                    assigned_at: now,
                },
            }),
            this.prisma.orders.update({
                where: { id: order.id },
                data: {
                    rider_user_id: rider.user_id,
                    ...(order.status === 'created' && {
                        status: 'rider_assigned',
                        fulfillment_status: 'rider_assigned',
                    }),
                    rider_assigned_at: now,
                },
            }),
            this.prisma.order_status_history.create({
                data: {
                    order_id: order.id,
                    old_status: order.status,
                    new_status: order.status === 'created' ? 'rider_assigned' : order.status,
                    changed_by_user_id: userId,
                    source: 'rider',
                    notes: 'Pedido aceptado por repartidor',
                },
            }),
            this.prisma.rider_profiles.update({
                where: { id: rider.id },
                data: { is_available: false, is_online: true },
            }),
        ]);
        return this.prisma.orders.findUnique({
            where: { id: order.id },
            include: {
                stores: { select: { name: true } },
                store_branches: { select: { name: true } },
                deliveries: true,
            },
        });
    }
    async rejectOrder(userId, orderId, reason) {
        await this.getActiveRiderByUserId(userId);
        const order = await this.prisma.orders.findUnique({
            where: { id: orderId },
            include: { deliveries: true },
        });
        if (!order || !order.deliveries) {
            throw new common_1.NotFoundException('Pedido no encontrado');
        }
        if (order.status !== 'ready_for_pickup') {
            throw new common_1.BadRequestException('El pedido ya no está disponible para rechazo');
        }
        if (order.deliveries.rider_profile_id) {
            throw new common_1.ConflictException('Este pedido ya fue tomado por otro repartidor');
        }
        await this.prisma.order_status_history.create({
            data: {
                order_id: order.id,
                old_status: order.status,
                new_status: order.status,
                changed_by_user_id: userId,
                source: 'rider',
                notes: reason?.trim()
                    ? `Pedido rechazado por repartidor: ${reason.trim()}`
                    : 'Pedido rechazado por repartidor',
            },
        });
        return {
            success: true,
            order_id: order.id,
            message: 'Pedido rechazado correctamente',
        };
    }
    async updateMyOrderStatus(userId, orderId, status) {
        const rider = await this.getActiveRiderByUserId(userId);
        const order = await this.prisma.orders.findUnique({
            where: { id: orderId },
            include: { deliveries: true },
        });
        if (!order || !order.deliveries) {
            throw new common_1.NotFoundException('Pedido no encontrado');
        }
        if (order.deliveries.rider_profile_id !== rider.id) {
            throw new common_1.ForbiddenException('Este pedido no está asignado a tu cuenta');
        }
        const transitions = {
            created: ['picked_up', 'on_the_way'],
            rider_assigned: ['picked_up', 'on_the_way'],
            preparing: ['picked_up', 'on_the_way'],
            ready_for_pickup: ['picked_up', 'on_the_way'],
            picked_up: ['on_the_way', 'delivered'],
            on_the_way: ['delivered'],
        };
        const allowed = transitions[order.status] ?? [];
        if (!allowed.includes(status)) {
            throw new common_1.BadRequestException(`Transición inválida: no se puede pasar de ${order.status} a ${status}`);
        }
        const now = new Date();
        const orderUpdate = {
            status,
            fulfillment_status: status,
        };
        const deliveryUpdate = {};
        if (status === 'picked_up') {
            orderUpdate.picked_up_at = now;
            deliveryUpdate.status = 'picked_up';
            deliveryUpdate.picked_up_at = now;
        }
        else if (status === 'on_the_way') {
            deliveryUpdate.status = 'on_the_way';
        }
        else if (status === 'delivered') {
            orderUpdate.delivered_at = now;
            deliveryUpdate.status = 'delivered';
            deliveryUpdate.delivered_at = now;
        }
        await this.prisma.$transaction([
            this.prisma.orders.update({
                where: { id: order.id },
                data: orderUpdate,
            }),
            this.prisma.deliveries.update({
                where: { order_id: order.id },
                data: deliveryUpdate,
            }),
            this.prisma.order_status_history.create({
                data: {
                    order_id: order.id,
                    old_status: order.status,
                    new_status: status,
                    changed_by_user_id: userId,
                    source: 'rider',
                    notes: `Estado actualizado por repartidor a ${status}`,
                },
            }),
            ...(status === 'delivered'
                ? [
                    this.prisma.rider_profiles.update({
                        where: { id: rider.id },
                        data: {
                            is_available: true,
                            total_deliveries: { increment: 1 },
                        },
                    }),
                ]
                : []),
        ]);
        return this.prisma.orders.findUnique({
            where: { id: order.id },
            include: {
                stores: { select: { name: true } },
                store_branches: { select: { name: true } },
                deliveries: true,
            },
        });
    }
};
exports.RidersService = RidersService;
exports.RidersService = RidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RidersService);
//# sourceMappingURL=riders.service.js.map
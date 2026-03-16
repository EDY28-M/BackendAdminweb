"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.orders.findMany({
            include: {
                users_orders_customer_user_idTousers: { select: { first_name: true, last_name: true, email: true, phone_e164: true } },
                users_orders_rider_user_idTousers: { select: { first_name: true, last_name: true } },
                store_branches: true,
                stores: { select: { name: true } },
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async findOne(id) {
        const order = await this.prisma.orders.findUnique({
            where: { id },
            include: {
                users_orders_customer_user_idTousers: true,
                users_orders_rider_user_idTousers: true,
                store_branches: true,
                order_items: true,
                stores: true,
            }
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async update(id, updateData) {
        const data = { ...updateData };
        if (data.rider_user_id) {
            const rider = await this.prisma.rider_profiles.findUnique({
                where: { user_id: data.rider_user_id },
            });
            if (rider) {
                await this.prisma.deliveries.updateMany({
                    where: { order_id: id },
                    data: { rider_profile_id: rider.id, assigned_at: new Date() },
                });
                updateData.status = 'rider_assigned';
                updateData.rider_assigned_at = new Date();
            }
        }
        return this.prisma.orders.update({
            where: { id },
            data: updateData
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map
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
exports.MerchantService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MerchantService = class MerchantService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateOrderStatus(merchantId, orderId, newStatus) {
        const order = await this.prisma.orders.findFirst({
            where: { id: orderId, stores: { merchant_id: merchantId } },
        });
        if (!order)
            throw new common_1.NotFoundException('Pedido no encontrado');
        const oldStatus = order.status;
        await this.prisma.$transaction([
            this.prisma.orders.update({
                where: { id: orderId },
                data: {
                    status: newStatus,
                    ...(newStatus === 'preparing' && { preparing_at: new Date() }),
                    ...(newStatus === 'ready_for_pickup' && { ready_for_pickup_at: new Date() }),
                },
            }),
            this.prisma.order_status_history.create({
                data: {
                    order_id: orderId,
                    old_status: oldStatus,
                    new_status: newStatus,
                    source: 'store',
                },
            }),
        ]);
        return this.prisma.orders.findUnique({ where: { id: orderId } });
    }
    async getStoresByMerchant(merchantId) {
        return this.prisma.stores.findMany({
            where: { merchant_id: merchantId },
            include: { business_categories: true },
            orderBy: { created_at: 'desc' },
        });
    }
    async ensureStoreBelongsToMerchant(merchantId, storeId) {
        const store = await this.prisma.stores.findFirst({
            where: { id: storeId, merchant_id: merchantId },
        });
        if (!store)
            throw new common_1.ForbiddenException('No tienes acceso a esta tienda');
        return store;
    }
    async getCatalogByStore(merchantId, storeId) {
        await this.ensureStoreBelongsToMerchant(merchantId, storeId);
        return this.prisma.catalog_items.findMany({
            where: { store_id: storeId },
            include: { catalog_categories: true },
            orderBy: { created_at: 'desc' },
        });
    }
    async getCatalogCategories(merchantId, storeId) {
        await this.ensureStoreBelongsToMerchant(merchantId, storeId);
        return this.prisma.catalog_categories.findMany({
            where: { store_id: storeId, is_active: true },
            orderBy: { name: 'asc' },
        });
    }
    async getCatalogCategoriesAll(merchantId, storeId) {
        await this.ensureStoreBelongsToMerchant(merchantId, storeId);
        return this.prisma.catalog_categories.findMany({
            where: { store_id: storeId },
            orderBy: { name: 'asc' },
        });
    }
    async updateCatalogCategory(merchantId, categoryId, data) {
        const cat = await this.prisma.catalog_categories.findFirst({
            where: { id: categoryId, stores: { merchant_id: merchantId } },
        });
        if (!cat)
            throw new common_1.NotFoundException('Categoría no encontrada');
        const slug = data.name
            ? data.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 140)
            : undefined;
        return this.prisma.catalog_categories.update({
            where: { id: categoryId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(slug !== undefined && { slug }),
                ...(data.is_active !== undefined && { is_active: data.is_active }),
            },
        });
    }
    async deleteCatalogCategory(merchantId, categoryId) {
        const cat = await this.prisma.catalog_categories.findFirst({
            where: { id: categoryId, stores: { merchant_id: merchantId } },
        });
        if (!cat)
            throw new common_1.NotFoundException('Categoría no encontrada');
        await this.prisma.catalog_categories.delete({ where: { id: categoryId } });
        return { success: true };
    }
    async createCatalogItem(merchantId, data) {
        await this.ensureStoreBelongsToMerchant(merchantId, data.store_id);
        const slug = (data.name || 'item')
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 200);
        return this.prisma.catalog_items.create({
            data: {
                store_id: data.store_id,
                category_id: data.category_id || null,
                item_type: data.item_type || 'food_item',
                name: data.name,
                slug: slug,
                description: data.description || null,
                base_price_amount: Number(data.base_price_amount) || 0,
                image_url: data.image_url || null,
                is_active: true,
                is_on_offer: Boolean(data.is_on_offer),
                offer_price_amount: data.offer_price_amount != null ? Number(data.offer_price_amount) : null,
            },
        });
    }
    async updateCatalogItem(merchantId, itemId, data) {
        const item = await this.prisma.catalog_items.findFirst({
            where: { id: itemId, stores: { merchant_id: merchantId } },
        });
        if (!item)
            throw new common_1.NotFoundException('Producto no encontrado');
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.slug !== undefined)
            updateData.slug = data.slug;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.category_id !== undefined)
            updateData.category_id = data.category_id || null;
        if (data.item_type !== undefined)
            updateData.item_type = data.item_type;
        if (data.base_price_amount !== undefined)
            updateData.base_price_amount = Number(data.base_price_amount);
        if (data.image_url !== undefined)
            updateData.image_url = data.image_url || null;
        if (data.is_active !== undefined)
            updateData.is_active = data.is_active;
        if (data.is_on_offer !== undefined)
            updateData.is_on_offer = data.is_on_offer;
        if (data.offer_price_amount !== undefined)
            updateData.offer_price_amount = data.offer_price_amount != null ? Number(data.offer_price_amount) : null;
        return this.prisma.catalog_items.update({
            where: { id: itemId },
            data: updateData,
        });
    }
    async deleteCatalogItem(merchantId, itemId) {
        const item = await this.prisma.catalog_items.findFirst({
            where: { id: itemId, stores: { merchant_id: merchantId } },
        });
        if (!item)
            throw new common_1.NotFoundException('Producto no encontrado');
        await this.prisma.catalog_items.delete({ where: { id: itemId } });
        return { success: true };
    }
    async createCatalogCategory(merchantId, data) {
        await this.ensureStoreBelongsToMerchant(merchantId, data.store_id);
        const slug = (data.name || 'cat')
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 140);
        return this.prisma.catalog_categories.create({
            data: {
                store_id: data.store_id,
                name: data.name,
                slug,
                is_active: true,
            },
        });
    }
    async getOrdersByMerchant(merchantId) {
        const stores = await this.prisma.stores.findMany({
            where: { merchant_id: merchantId },
            select: { id: true },
        });
        const storeIds = stores.map(s => s.id);
        return this.prisma.orders.findMany({
            where: { store_id: { in: storeIds } },
            include: {
                users_orders_customer_user_idTousers: { select: { first_name: true, last_name: true, email: true, phone_e164: true } },
                order_items: { include: { catalog_items: true } },
                store_branches: true,
                stores: { select: { name: true } },
                users_orders_rider_user_idTousers: { select: { first_name: true, last_name: true } },
            },
            orderBy: { created_at: 'desc' },
        });
    }
};
exports.MerchantService = MerchantService;
exports.MerchantService = MerchantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MerchantService);
//# sourceMappingURL=merchant.service.js.map
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
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CatalogService = class CatalogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async syncBranchCatalogItems(storeId, catalogItemId, priceAmount, isActive) {
        const branches = await this.prisma.store_branches.findMany({
            where: { store_id: storeId, status: 'active' },
            select: { id: true },
        });
        if (branches.length === 0)
            return;
        for (const branch of branches) {
            const existing = await this.prisma.branch_catalog_items.findFirst({
                where: {
                    branch_id: branch.id,
                    catalog_item_id: catalogItemId,
                    variant_id: null,
                },
            });
            if (existing) {
                await this.prisma.branch_catalog_items.update({
                    where: { id: existing.id },
                    data: {
                        price_amount: priceAmount,
                        is_available: isActive,
                    },
                });
            }
            else {
                await this.prisma.branch_catalog_items.create({
                    data: {
                        branch_id: branch.id,
                        catalog_item_id: catalogItemId,
                        variant_id: null,
                        price_amount: priceAmount,
                        is_available: isActive,
                        availability_mode: 'manual',
                        stock_qty: null,
                    },
                });
            }
        }
    }
    async findAll() {
        return this.prisma.catalog_items.findMany({
            include: {
                stores: true,
                catalog_categories: true,
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async getCategories(storeId) {
        if (!storeId)
            return [];
        return this.prisma.catalog_categories.findMany({
            where: { store_id: storeId, is_active: true },
            orderBy: { name: 'asc' }
        });
    }
    async findOne(id) {
        const item = await this.prisma.catalog_items.findUnique({
            where: { id },
            include: {
                stores: true,
                catalog_categories: true,
            }
        });
        if (!item)
            throw new common_1.NotFoundException('Product not found');
        return item;
    }
    async update(id, updateData) {
        const current = await this.prisma.catalog_items.findUnique({
            where: { id },
            select: { id: true, store_id: true, base_price_amount: true, is_active: true },
        });
        if (!current)
            throw new common_1.NotFoundException('Product not found');
        const updated = await this.prisma.catalog_items.update({
            where: { id },
            data: updateData
        });
        const nextPrice = updateData.base_price_amount !== undefined
            ? Number(updateData.base_price_amount)
            : Number(current.base_price_amount);
        const nextIsActive = updateData.is_active !== undefined
            ? Boolean(updateData.is_active)
            : current.is_active;
        await this.syncBranchCatalogItems(current.store_id, current.id, nextPrice, nextIsActive);
        return updated;
    }
    async create(createData) {
        const item = await this.prisma.catalog_items.create({
            data: createData
        });
        await this.syncBranchCatalogItems(item.store_id, item.id, Number(item.base_price_amount), item.is_active);
        return item;
    }
    async createCategory(data) {
        const slug = data.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return this.prisma.catalog_categories.create({
            data: {
                store_id: data.store_id,
                name: data.name,
                slug: slug,
                is_active: true
            }
        });
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map
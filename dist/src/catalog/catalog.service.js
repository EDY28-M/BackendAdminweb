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
        return this.prisma.catalog_items.update({
            where: { id },
            data: updateData
        });
    }
    async create(createData) {
        return this.prisma.catalog_items.create({
            data: createData
        });
    }
    async createCategory(data) {
        return this.prisma.catalog_categories.create({
            data
        });
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map
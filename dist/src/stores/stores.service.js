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
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let StoresService = class StoresService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.stores.findMany({
            include: {
                merchant_profiles: { include: { users: { select: { first_name: true, last_name: true, email: true, phone_e164: true } } } },
                business_categories: true,
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async getMerchants() {
        return this.prisma.merchant_profiles.findMany({
            include: {
                users: {
                    select: { first_name: true, last_name: true, email: true }
                }
            },
            orderBy: { business_name: 'asc' }
        });
    }
    async getCategories() {
        return this.prisma.business_categories.findMany({
            where: { is_active: true },
            orderBy: { name: 'asc' }
        });
    }
    async findOne(id) {
        const store = await this.prisma.stores.findUnique({
            where: { id },
            include: {
                merchant_profiles: { include: { users: { select: { first_name: true, last_name: true, email: true, phone_e164: true } } } },
                business_categories: true,
            }
        });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        return store;
    }
    async update(id, updateData) {
        return this.prisma.stores.update({
            where: { id },
            data: updateData
        });
    }
    async create(createData) {
        const storeData = { ...createData, status: 'active' };
        return this.prisma.$transaction(async (tx) => {
            const store = await tx.stores.create({ data: storeData });
            const address = await tx.addresses.create({
                data: {
                    label: 'Principal',
                    country_code: 'PE',
                    region: 'Huánuco',
                    province: 'Leoncio Prado',
                    district: 'Rupa-Rupa',
                    city: 'Tingo María',
                    address_line1: 'Dirección principal de la tienda',
                    latitude: -9.2956,
                    longitude: -75.9986,
                },
            });
            await tx.store_branches.create({
                data: {
                    store_id: store.id,
                    address_id: address.id,
                    name: `${store.name} - Principal`,
                    status: 'active',
                    accepts_orders: true,
                    avg_prep_time_minutes: 20,
                },
            });
            return store;
        });
    }
    async createCategory(data) {
        const code = data.name
            .toUpperCase()
            .replace(/[^A-Z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 50);
        return this.prisma.business_categories.create({
            data: {
                name: data.name,
                code: code,
                is_active: true
            }
        });
    }
    async createMerchant(data) {
        const { email, password, first_name, last_name, business_name, legal_name, tax_id, phone } = data;
        try {
            return await this.prisma.$transaction(async (tx) => {
                const salt = await bcrypt.genSalt(10);
                const password_hash = await bcrypt.hash(password, salt);
                const user = await tx.users.create({
                    data: {
                        email,
                        first_name,
                        last_name: last_name || '',
                        password_hash,
                        auth_provider: 'email',
                        status: 'active',
                        phone_e164: phone || null
                    }
                });
                let role = await tx.roles.findUnique({
                    where: { code: 'merchant' }
                });
                if (!role) {
                    role = await tx.roles.create({
                        data: {
                            code: 'merchant',
                            name: 'Merchant Owner'
                        }
                    });
                }
                await tx.user_roles.create({
                    data: {
                        user_id: user.id,
                        role_id: role.id,
                        scope_type: 'merchant'
                    }
                });
                const merchant = await tx.merchant_profiles.create({
                    data: {
                        owner_user_id: user.id,
                        business_name,
                        legal_name,
                        tax_id,
                        phone_e164: phone || null,
                        billing_email: email,
                        status: 'active'
                    }
                });
                return merchant;
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0] || 'campo';
                const fieldNames = {
                    'email': 'correo electrónico',
                    'phone_e164': 'número de teléfono',
                };
                const friendlyName = fieldNames[field] || field;
                throw new common_1.ConflictException(`El ${friendlyName} ya está registrado. Usa uno diferente.`);
            }
            throw error;
        }
    }
    async updateMerchant(id, data) {
        const merchant = await this.prisma.merchant_profiles.findUnique({
            where: { id },
            include: { users: true },
        });
        if (!merchant)
            throw new common_1.NotFoundException('Dueño no encontrado');
        const { first_name, last_name, email, phone, business_name, legal_name, tax_id, password } = data;
        const userId = merchant.owner_user_id;
        const userUpdate = {};
        if (first_name !== undefined)
            userUpdate.first_name = first_name;
        if (last_name !== undefined)
            userUpdate.last_name = last_name;
        if (email !== undefined)
            userUpdate.email = email;
        if (phone !== undefined)
            userUpdate.phone_e164 = phone || null;
        if (password && password.trim()) {
            userUpdate.password_hash = await bcrypt.hash(password, 10);
        }
        const merchantUpdate = {};
        if (business_name !== undefined)
            merchantUpdate.business_name = business_name;
        if (legal_name !== undefined)
            merchantUpdate.legal_name = legal_name;
        if (tax_id !== undefined)
            merchantUpdate.tax_id = tax_id;
        if (phone !== undefined)
            merchantUpdate.phone_e164 = phone || null;
        if (email !== undefined)
            merchantUpdate.billing_email = email;
        await this.prisma.$transaction(async (tx) => {
            if (Object.keys(userUpdate).length) {
                await tx.users.update({ where: { id: userId }, data: userUpdate });
            }
            if (Object.keys(merchantUpdate).length) {
                await tx.merchant_profiles.update({ where: { id }, data: merchantUpdate });
            }
        });
        return this.prisma.merchant_profiles.findUnique({
            where: { id },
            include: { users: { select: { first_name: true, last_name: true, email: true, phone_e164: true } } },
        });
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoresService);
//# sourceMappingURL=stores.service.js.map
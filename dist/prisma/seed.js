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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    let adminRole = await prisma.roles.findUnique({ where: { code: 'admin' } });
    if (!adminRole)
        adminRole = await prisma.roles.create({ data: { code: 'admin', name: 'Administrador', description: 'Admin del panel' } });
    let merchantRole = await prisma.roles.findUnique({ where: { code: 'merchant' } });
    if (!merchantRole)
        merchantRole = await prisma.roles.create({ data: { code: 'merchant', name: 'Comerciante', description: 'Dueño de tienda' } });
    let riderRole = await prisma.roles.findUnique({ where: { code: 'rider' } });
    if (!riderRole)
        riderRole = await prisma.roles.create({ data: { code: 'rider', name: 'Repartidor', description: 'Repartidor' } });
    let adminUser = await prisma.users.findUnique({ where: { email: 'admin@admin.com' } });
    if (!adminUser) {
        adminUser = await prisma.users.create({
            data: {
                email: 'admin@admin.com',
                password_hash: await bcrypt.hash('admin123', 10),
                auth_provider: 'email',
                first_name: 'Admin',
                last_name: 'Sistema',
                status: 'active',
                is_email_verified: true,
            },
        });
        await prisma.user_roles.create({
            data: { user_id: adminUser.id, role_id: adminRole.id, scope_type: 'platform' },
        });
    }
    let merchantUser = await prisma.users.findUnique({ where: { email: 'junior@fastgo.com' } });
    if (!merchantUser) {
        merchantUser = await prisma.users.create({
            data: {
                email: 'junior@fastgo.com',
                password_hash: await bcrypt.hash('merchant123', 10),
                auth_provider: 'email',
                first_name: 'JUNIOR',
                last_name: 'BARDALES',
                status: 'active',
                is_email_verified: true,
            },
        });
        await prisma.user_roles.create({
            data: { user_id: merchantUser.id, role_id: merchantRole.id, scope_type: 'platform' },
        });
    }
    let merchantProfile = await prisma.merchant_profiles.findFirst({ where: { owner_user_id: merchantUser.id } });
    if (!merchantProfile) {
        merchantProfile = await prisma.merchant_profiles.create({
            data: {
                owner_user_id: merchantUser.id,
                business_name: 'FastGo',
                legal_name: 'FastGo EIRL',
                status: 'active',
            },
        });
        await prisma.merchant_users.create({
            data: { merchant_id: merchantProfile.id, user_id: merchantUser.id, role_code: 'owner' },
        });
    }
    let bizCategory = await prisma.business_categories.findUnique({ where: { code: 'food' } });
    if (!bizCategory)
        bizCategory = await prisma.business_categories.create({ data: { code: 'food', name: 'Comida' } });
    let store = await prisma.stores.findUnique({ where: { slug: 'fastgo' } });
    if (!store) {
        store = await prisma.stores.create({
            data: {
                merchant_id: merchantProfile.id,
                business_category_id: bizCategory.id,
                name: 'FastGo',
                slug: 'fastgo',
                description: 'Tienda de comida rápida',
                service_mode: 'delivery',
                catalog_mode: 'food',
                status: 'active',
            },
        });
    }
    let branch = await prisma.store_branches.findFirst({ where: { store_id: store.id } });
    if (!branch) {
        let addr = await prisma.addresses.findFirst();
        if (!addr) {
            addr = await prisma.addresses.create({
                data: {
                    country_code: 'PE',
                    region: 'Lima',
                    province: 'Lima',
                    district: 'Miraflores',
                    city: 'Lima',
                    address_line1: 'Av. Larco 123',
                    latitude: -12.0464,
                    longitude: -77.0428,
                },
            });
        }
        branch = await prisma.store_branches.create({
            data: {
                store_id: store.id,
                address_id: addr.id,
                name: 'FastGo Principal',
                status: 'active',
                accepts_orders: true,
                avg_prep_time_minutes: 20,
            },
        });
    }
    let category = await prisma.catalog_categories.findFirst({ where: { store_id: store.id, slug: 'brosther' } });
    if (!category) {
        category = await prisma.catalog_categories.create({
            data: { store_id: store.id, name: 'Brosther', slug: 'brosther', is_active: true },
        });
    }
    const items = [
        { name: 'Alitas Acevichadas', slug: 'alitas-acevichadas', base_price: 12 },
        { name: 'Hamburguesa Clásica', slug: 'hamburguesa-clasica', base_price: 15 },
        { name: 'Papa Frita Grande', slug: 'papa-frita-grande', base_price: 8 },
        { name: 'Gaseosa 500ml', slug: 'gaseosa-500ml', base_price: 3 },
        { name: 'Combo Familiar', slug: 'combo-familiar', base_price: 35 },
    ];
    const catalogItems = [];
    for (const item of items) {
        let ci = await prisma.catalog_items.findFirst({ where: { store_id: store.id, slug: item.slug } });
        if (!ci) {
            ci = await prisma.catalog_items.create({
                data: {
                    store_id: store.id,
                    category_id: category.id,
                    item_type: 'food_item',
                    name: item.name,
                    slug: item.slug,
                    base_price_amount: item.base_price,
                    is_active: true,
                },
            });
        }
        catalogItems.push({ id: ci.id, base_price_amount: item.base_price });
    }
    const b = await prisma.store_branches.findFirst({ where: { store_id: store.id } });
    if (b) {
        for (const ci of catalogItems) {
            const exists = await prisma.branch_catalog_items.findFirst({
                where: { branch_id: b.id, catalog_item_id: ci.id },
            });
            if (!exists) {
                await prisma.branch_catalog_items.create({
                    data: {
                        branch_id: b.id,
                        catalog_item_id: ci.id,
                        price_amount: ci.base_price_amount,
                        availability_mode: 'manual',
                        is_available: true,
                    },
                });
            }
        }
    }
    console.log('Seed OK: admin@admin.com, junior@fastgo.com (merchant123), tienda FastGo, 5 productos, branch_catalog_items.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
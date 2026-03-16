import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Roles
  let adminRole = await prisma.roles.findUnique({ where: { code: 'admin' } });
  if (!adminRole) adminRole = await prisma.roles.create({ data: { code: 'admin', name: 'Administrador', description: 'Admin del panel' } });

  let merchantRole = await prisma.roles.findUnique({ where: { code: 'merchant' } });
  if (!merchantRole) merchantRole = await prisma.roles.create({ data: { code: 'merchant', name: 'Comerciante', description: 'Dueño de tienda' } });

  let riderRole = await prisma.roles.findUnique({ where: { code: 'rider' } });
  if (!riderRole) riderRole = await prisma.roles.create({ data: { code: 'rider', name: 'Repartidor', description: 'Repartidor' } });

  // Admin user
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

  // Merchant user (JUNIOR BARDALES)
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

  // Merchant profile
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

  // Business category
  let bizCategory = await prisma.business_categories.findUnique({ where: { code: 'food' } });
  if (!bizCategory) bizCategory = await prisma.business_categories.create({ data: { code: 'food', name: 'Comida' } });

  // Store FastGo
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

  // Address + Branch (necesario para la estructura)
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

  // Categoría de catálogo
  let category = await prisma.catalog_categories.findFirst({ where: { store_id: store.id, slug: 'brosther' } });
  if (!category) {
    category = await prisma.catalog_categories.create({
      data: { store_id: store.id, name: 'Brosther', slug: 'brosther', is_active: true },
    });
  }

  // Productos del catálogo
  const items = [
    { name: 'Alitas Acevichadas', slug: 'alitas-acevichadas', base_price: 12 },
    { name: 'Hamburguesa Clásica', slug: 'hamburguesa-clasica', base_price: 15 },
    { name: 'Papa Frita Grande', slug: 'papa-frita-grande', base_price: 8 },
    { name: 'Gaseosa 500ml', slug: 'gaseosa-500ml', base_price: 3 },
    { name: 'Combo Familiar', slug: 'combo-familiar', base_price: 35 },
  ];

  const catalogItems: { id: string; base_price_amount: number }[] = [];
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

  // Vincular productos a la sucursal (branch_catalog_items) para que aparezcan en la app
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

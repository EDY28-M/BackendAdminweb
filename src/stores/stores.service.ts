import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  private normalizeBgColor(value?: string | null): string | null {
    const raw = (value ?? '').trim();
    if (!raw) return null;
    return /^#[0-9A-Fa-f]{6}$/.test(raw) ? raw.toUpperCase() : null;
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
    return this.prisma.$queryRaw<Array<{
      id: string;
      code: string;
      name: string;
      is_active: boolean;
      logo_url: string | null;
      bg_color: string | null;
      created_at: Date;
    }>>`
      SELECT id, code, name, is_active, logo_url, bg_color, created_at
      FROM business_categories
      WHERE is_active = true
      ORDER BY name ASC
    `;
  }

  async findOne(id: string) {
    const store = await this.prisma.stores.findUnique({
      where: { id },
      include: {
        merchant_profiles: { include: { users: { select: { first_name: true, last_name: true, email: true, phone_e164: true } } } },
        business_categories: true,
      }
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async update(id: string, updateData: Prisma.storesUpdateInput) {
    return this.prisma.stores.update({
      where: { id },
      data: updateData
    });
  }

  async create(createData: Prisma.storesUncheckedCreateInput) {
    // Forzar status 'active' — toda tienda creada desde admin debe aparecer en la app
    const storeData = { ...createData, status: 'active' as any };

    return this.prisma.$transaction(async (tx) => {
      const store = await tx.stores.create({ data: storeData });

      // Crear una dirección genérica para el branch si no se provee
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

      // Crear un branch activo para que la tienda aparezca en la app
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

  async createCategory(data: any) {
    const code = data.name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);

    const bgColor = this.normalizeBgColor(data.bg_color);

    try {
      const rows = await this.prisma.$queryRaw<Array<{
        id: string;
        code: string;
        name: string;
        is_active: boolean;
        logo_url: string | null;
        bg_color: string | null;
        created_at: Date;
      }>>`
        INSERT INTO business_categories (name, code, is_active, logo_url, bg_color)
        VALUES (${data.name}, ${code}, true, ${data.logo_url ?? null}, ${bgColor})
        RETURNING id, code, name, is_active, logo_url, bg_color, created_at
      `;

      return rows[0];
    } catch (error: any) {
      if (error?.code === '23505' || error?.code === 'P2002') {
        throw new ConflictException('Ya existe una categoría con ese nombre.');
      }
      throw error;
    }
  }

  async updateCategory(id: string, data: { name: string; logo_url?: string | null; bg_color?: string | null }) {
    const category = await this.prisma.business_categories.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const code = data.name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);

    const bgColor = this.normalizeBgColor(data.bg_color);

    try {
      const rows = await this.prisma.$queryRaw<Array<{
        id: string;
        code: string;
        name: string;
        is_active: boolean;
        logo_url: string | null;
        bg_color: string | null;
        created_at: Date;
      }>>`
        UPDATE business_categories
        SET
          name = ${data.name},
          code = ${code},
          logo_url = ${data.logo_url ?? null},
          bg_color = ${bgColor}
        WHERE id = ${id}::uuid
        RETURNING id, code, name, is_active, logo_url, bg_color, created_at
      `;

      return rows[0];
    } catch (error: any) {
      if (error?.code === '23505' || error?.code === 'P2002') {
        throw new ConflictException('Ya existe una categoría con ese nombre.');
      }
      throw error;
    }
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.business_categories.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    if (!category.is_active) {
      throw new BadRequestException('La categoría ya está eliminada');
    }

    const storesUsingCategory = await this.prisma.stores.count({
      where: {
        business_category_id: id,
      },
    });

    if (storesUsingCategory > 0) {
      throw new ConflictException(
        'No se puede eliminar la categoría porque está asignada a una o más tiendas.',
      );
    }

    await this.prisma.business_categories.update({
      where: { id },
      data: { is_active: false },
    });

    return { message: 'Categoría eliminada correctamente' };
  }

  async createMerchant(data: any) {
    const { email, password, first_name, last_name, business_name, legal_name, tax_id, phone } = data;

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Create User
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

        // 2. Create Role
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

        // 3. Create Merchant Profile
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
    } catch (error: any) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'campo';
        const fieldNames: Record<string, string> = {
          'email': 'correo electrónico',
          'phone_e164': 'número de teléfono',
        };
        const friendlyName = fieldNames[field] || field;
        throw new ConflictException(`El ${friendlyName} ya está registrado. Usa uno diferente.`);
      }
      throw error;
    }
  }

  async updateMerchant(id: string, data: any) {
    const merchant = await this.prisma.merchant_profiles.findUnique({
      where: { id },
      include: { users: true },
    });
    if (!merchant) throw new NotFoundException('Dueño no encontrado');

    const { first_name, last_name, email, phone, business_name, legal_name, tax_id, password } = data;
    const userId = merchant.owner_user_id;

    const userUpdate: any = {};
    if (first_name !== undefined) userUpdate.first_name = first_name;
    if (last_name !== undefined) userUpdate.last_name = last_name;
    if (email !== undefined) userUpdate.email = email;
    if (phone !== undefined) userUpdate.phone_e164 = phone || null;
    if (password && password.trim()) {
      userUpdate.password_hash = await bcrypt.hash(password, 10);
    }

    const merchantUpdate: any = {};
    if (business_name !== undefined) merchantUpdate.business_name = business_name;
    if (legal_name !== undefined) merchantUpdate.legal_name = legal_name;
    if (tax_id !== undefined) merchantUpdate.tax_id = tax_id;
    if (phone !== undefined) merchantUpdate.phone_e164 = phone || null;
    if (email !== undefined) merchantUpdate.billing_email = email;

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
}

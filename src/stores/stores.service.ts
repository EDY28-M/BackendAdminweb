import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.stores.findMany({
      include: {
        merchant_profiles: true,
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

  async findOne(id: string) {
    const store = await this.prisma.stores.findUnique({
      where: { id },
      include: {
        merchant_profiles: true,
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
    return this.prisma.stores.create({
      data: createData
    });
  }

  async createCategory(data: any) {
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
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  private async syncBranchCatalogItems(
    storeId: string,
    catalogItemId: string,
    priceAmount: number,
    isActive: boolean,
  ) {
    const branches = await this.prisma.store_branches.findMany({
      where: { store_id: storeId, status: 'active' },
      select: { id: true },
    });
    if (branches.length === 0) return;

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
      } else {
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

  async getCategories(storeId: string) {
    if (!storeId) return [];
    return this.prisma.catalog_categories.findMany({
      where: { store_id: storeId, is_active: true },
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.catalog_items.findUnique({
      where: { id },
      include: {
        stores: true,
        catalog_categories: true,
      }
    });
    if (!item) throw new NotFoundException('Product not found');
    return item;
  }

  async update(id: string, updateData: Prisma.catalog_itemsUpdateInput) {
    const current = await this.prisma.catalog_items.findUnique({
      where: { id },
      select: { id: true, store_id: true, base_price_amount: true, is_active: true },
    });
    if (!current) throw new NotFoundException('Product not found');

    const updated = await this.prisma.catalog_items.update({
      where: { id },
      data: updateData
    });

    const nextPrice =
      updateData.base_price_amount !== undefined
        ? Number(updateData.base_price_amount as unknown)
        : Number(current.base_price_amount);
    const nextIsActive =
      updateData.is_active !== undefined
        ? Boolean(updateData.is_active)
        : current.is_active;

    await this.syncBranchCatalogItems(
      current.store_id,
      current.id,
      nextPrice,
      nextIsActive,
    );

    return updated;
  }

  async create(createData: Prisma.catalog_itemsUncheckedCreateInput) {
    const item = await this.prisma.catalog_items.create({
      data: createData
    });
    await this.syncBranchCatalogItems(
      item.store_id,
      item.id,
      Number(item.base_price_amount),
      item.is_active,
    );
    return item;
  }

  async createCategory(data: any) {
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
}

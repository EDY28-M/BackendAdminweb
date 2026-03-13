import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.catalog_items.update({
      where: { id },
      data: updateData
    });
  }

  async create(createData: Prisma.catalog_itemsUncheckedCreateInput) {
    return this.prisma.catalog_items.create({
      data: createData
    });
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

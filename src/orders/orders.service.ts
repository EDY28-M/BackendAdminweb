import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.orders.findMany({
      include: {
        users_orders_customer_user_idTousers: true,
        store_branches: true,
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        users_orders_customer_user_idTousers: true,
        store_branches: true,
        order_items: true,
      }
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, updateData: Prisma.ordersUpdateInput) {
    return this.prisma.orders.update({
      where: { id },
      data: updateData
    });
  }
}

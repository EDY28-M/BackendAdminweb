import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.orders.findMany({
      include: {
        users_orders_customer_user_idTousers: { select: { first_name: true, last_name: true, email: true, phone_e164: true } },
        users_orders_rider_user_idTousers: { select: { first_name: true, last_name: true } },
        store_branches: true,
        stores: { select: { name: true } },
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        users_orders_customer_user_idTousers: true,
        users_orders_rider_user_idTousers: true,
        store_branches: true,
        order_items: true,
        stores: true,
      }
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, updateData: Prisma.ordersUpdateInput) {
    const data = { ...updateData } as any;
    if (data.rider_user_id) {
      const rider = await this.prisma.rider_profiles.findUnique({
        where: { user_id: data.rider_user_id },
      });
      if (rider) {
        await this.prisma.deliveries.updateMany({
          where: { order_id: id },
          data: { rider_profile_id: rider.id, assigned_at: new Date() },
        });
        (updateData as any).status = 'rider_assigned';
        (updateData as any).rider_assigned_at = new Date();
      }
    }
    return this.prisma.orders.update({
      where: { id },
      data: updateData
    });
  }
}

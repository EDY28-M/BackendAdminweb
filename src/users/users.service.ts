import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany({
      include: {
        user_roles: { include: { roles: true } },
        merchant_profiles: { select: { id: true, business_name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateStatus(id: string, status: 'pending' | 'active' | 'suspended' | 'deleted') {
    return this.prisma.users.update({
      where: { id },
      data: { status }
    });
  }
}

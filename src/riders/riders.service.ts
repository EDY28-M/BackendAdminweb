import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RidersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.rider_profiles.findMany({
      include: {
        users: {
          select: { id: true, first_name: true, last_name: true, email: true, phone_e164: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const rider = await this.prisma.rider_profiles.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
    if (!rider) throw new NotFoundException('Repartidor no encontrado');
    return rider;
  }

  async create(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    document_type: string;
    document_number: string;
    vehicle_type: 'bici' | 'moto' | 'auto';
    vehicle_plate?: string;
  }) {
    const { email, password, first_name, last_name, phone, document_type, document_number, vehicle_type, vehicle_plate } = data;

    try {
      return await this.prisma.$transaction(async (tx) => {
        const password_hash = await bcrypt.hash(password, 10);

        const user = await tx.users.create({
          data: {
            email,
            first_name,
            last_name: last_name || '',
            password_hash,
            auth_provider: 'email',
            status: 'active',
            phone_e164: phone || null,
          },
        });

        let role = await tx.roles.findUnique({ where: { code: 'rider' } });
        if (!role) {
          role = await tx.roles.create({
            data: { code: 'rider', name: 'Repartidor' },
          });
        }

        await tx.user_roles.create({
          data: {
            user_id: user.id,
            role_id: role.id,
            scope_type: 'platform',
          },
        });

        const riderProfile = await tx.rider_profiles.create({
          data: {
            user_id: user.id,
            document_type,
            document_number,
            vehicle_type,
            vehicle_plate: vehicle_plate || null,
            status: 'active',
          },
          include: {
            users: { select: { first_name: true, last_name: true, email: true, phone_e164: true } },
          },
        });

        return riderProfile;
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'campo';
        const names: Record<string, string> = { email: 'correo', phone_e164: 'teléfono' };
        throw new ConflictException(`El ${names[field] || field} ya está registrado.`);
      }
      throw error;
    }
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.rider_profiles.update({
      where: { id },
      data: { status: status as any },
    });
  }
}

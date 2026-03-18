import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async loginAdmin(loginDto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: loginDto.email },
      include: {
        user_roles: {
          include: { roles: true },
        },
      },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Invalid credentials or inactive user');
    }

    // Verify it's an admin (platform scope)
    const isPlatformAdmin = user.user_roles.some((ur: any) => ur.scope_type === 'platform');
    if (!isPlatformAdmin) {
      throw new UnauthorizedException('User does not have admin privileges');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash || '');
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, roles: user.user_roles.map((ur: any) => ur.scope_type) };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      }
    };
  }

  async loginMerchant(loginDto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: loginDto.email },
      include: {
        user_roles: { include: { roles: true } },
        merchant_profiles: { include: { stores: true } },
      },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Credenciales inválidas o usuario inactivo');
    }

    const isMerchant = user.user_roles.some((ur: any) => ur.roles?.code === 'merchant');
    if (!isMerchant || !user.merchant_profiles?.[0]) {
      throw new UnauthorizedException('No tienes acceso al portal de comerciantes');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash || '');
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const merchant = user.merchant_profiles[0];
    const payload = { sub: user.id, email: user.email, merchant_id: merchant.id, scope: 'merchant' };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        merchant_id: merchant.id,
        stores: merchant.stores,
      },
    };
  }

  async loginRider(loginDto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: loginDto.email },
      include: {
        user_roles: { include: { roles: true } },
        rider_profiles: true,
      },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Credenciales inválidas o usuario inactivo');
    }

    const hasRiderRole = user.user_roles.some((ur: any) => ur.roles?.code === 'rider');
    if (!hasRiderRole || !user.rider_profiles) {
      throw new UnauthorizedException('No tienes acceso al portal de repartidores');
    }

    if (user.rider_profiles.status !== 'active') {
      throw new UnauthorizedException('Tu cuenta de repartidor no está activa');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash || '');
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      rider_profile_id: user.rider_profiles.id,
      scope: 'rider',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        rider_profile_id: user.rider_profiles.id,
      },
    };
  }
}

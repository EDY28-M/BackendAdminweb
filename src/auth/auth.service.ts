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
}

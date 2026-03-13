import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    loginAdmin(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string | null;
            first_name: string;
            last_name: string | null;
        };
    }>;
}

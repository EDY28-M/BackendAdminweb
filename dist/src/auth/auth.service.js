"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async loginAdmin(loginDto) {
        const user = await this.prisma.users.findUnique({
            where: { email: loginDto.email },
            include: {
                user_roles: {
                    include: { roles: true },
                },
            },
        });
        if (!user || user.status !== 'active') {
            throw new common_1.UnauthorizedException('Invalid credentials or inactive user');
        }
        const isPlatformAdmin = user.user_roles.some((ur) => ur.scope_type === 'platform');
        if (!isPlatformAdmin) {
            throw new common_1.UnauthorizedException('User does not have admin privileges');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.password_hash || '');
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, roles: user.user_roles.map((ur) => ur.scope_type) };
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
    async loginMerchant(loginDto) {
        const user = await this.prisma.users.findUnique({
            where: { email: loginDto.email },
            include: {
                user_roles: { include: { roles: true } },
                merchant_profiles: { include: { stores: true } },
            },
        });
        if (!user || user.status !== 'active') {
            throw new common_1.UnauthorizedException('Credenciales inválidas o usuario inactivo');
        }
        const isMerchant = user.user_roles.some((ur) => ur.roles?.code === 'merchant');
        if (!isMerchant || !user.merchant_profiles?.[0]) {
            throw new common_1.UnauthorizedException('No tienes acceso al portal de comerciantes');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.password_hash || '');
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
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
    async loginRider(loginDto) {
        const user = await this.prisma.users.findUnique({
            where: { email: loginDto.email },
            include: {
                user_roles: { include: { roles: true } },
                rider_profiles: true,
            },
        });
        if (!user || user.status !== 'active') {
            throw new common_1.UnauthorizedException('Credenciales inválidas o usuario inactivo');
        }
        const hasRiderRole = user.user_roles.some((ur) => ur.roles?.code === 'rider');
        if (!hasRiderRole || !user.rider_profiles) {
            throw new common_1.UnauthorizedException('No tienes acceso al portal de repartidores');
        }
        if (user.rider_profiles.status !== 'active') {
            throw new common_1.UnauthorizedException('Tu cuenta de repartidor no está activa');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.password_hash || '');
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
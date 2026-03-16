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
exports.RidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let RidersService = class RidersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findOne(id) {
        const rider = await this.prisma.rider_profiles.findUnique({
            where: { id },
            include: {
                users: true,
            },
        });
        if (!rider)
            throw new common_1.NotFoundException('Repartidor no encontrado');
        return rider;
    }
    async create(data) {
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
        }
        catch (error) {
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0] || 'campo';
                const names = { email: 'correo', phone_e164: 'teléfono' };
                throw new common_1.ConflictException(`El ${names[field] || field} ya está registrado.`);
            }
            throw error;
        }
    }
    async updateStatus(id, status) {
        return this.prisma.rider_profiles.update({
            where: { id },
            data: { status: status },
        });
    }
};
exports.RidersService = RidersService;
exports.RidersService = RidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RidersService);
//# sourceMappingURL=riders.service.js.map
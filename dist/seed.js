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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding Database...');
    const role = await prisma.roles.upsert({
        where: { code: 'super_admin' },
        update: {},
        create: {
            code: 'super_admin',
            name: 'Super Administrator',
            description: 'Full platform access',
        },
    });
    const passwordHash = await bcrypt.hash('admin123', 10);
    let admin = await prisma.users.findUnique({ where: { email: 'admin@appmaestra.com' } });
    if (!admin) {
        admin = await prisma.users.create({
            data: {
                email: 'admin@appmaestra.com',
                first_name: 'Admin',
                last_name: 'AppMaestra',
                password_hash: passwordHash,
                auth_provider: 'email',
                status: 'active',
                is_email_verified: true,
            },
        });
        console.log(`Created admin user: ${admin.email}`);
    }
    else {
        admin = await prisma.users.update({
            where: { id: admin.id },
            data: { password_hash: passwordHash, status: 'active' },
        });
        console.log(`Admin user already exists. Updated password to admin123.`);
    }
    const existingUserRole = await prisma.user_roles.findFirst({
        where: { user_id: admin.id, role_id: role.id, scope_type: 'platform' },
    });
    if (!existingUserRole) {
        await prisma.user_roles.create({
            data: {
                user_id: admin.id,
                role_id: role.id,
                scope_type: 'platform',
            },
        });
        console.log('Assigned platform role to admin.');
    }
    console.log('Seeding Complete! You can login with admin@appmaestra.com / admin123');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
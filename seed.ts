import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Create admin role if it doesn't exist
  const role = await prisma.roles.upsert({
    where: { code: 'super_admin' },
    update: {},
    create: {
      code: 'super_admin',
      name: 'Super Administrator',
      description: 'Full platform access',
    },
  });

  // 2. Hash password
  const passwordHash = await bcrypt.hash('admin123', 10);

  // 3. Create Admin User
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
  } else {
    // Force update password and status
    admin = await prisma.users.update({
      where: { id: admin.id },
      data: { password_hash: passwordHash, status: 'active' },
    });
    console.log(`Admin user already exists. Updated password to admin123.`);
  }

  // 4. Assign 'platform' role_scope to this user (Global Admin)
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

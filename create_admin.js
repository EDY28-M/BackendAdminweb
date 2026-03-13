const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@appmaestra.com';
  const plainPassword = 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Upsert role if not exists
  let adminRole = await prisma.roles.findUnique({ where: { code: 'platform_admin' } });
  if (!adminRole) {
    adminRole = await prisma.roles.create({
      data: {
        code: 'platform_admin',
        name: 'Administrador de Plataforma',
        description: 'Acceso total al sistema',
      }
    });
  }

  // Create or update admin user
  const adminUser = await prisma.users.upsert({
    where: { email: adminEmail },
    update: {
      password_hash: hashedPassword,
      status: 'active'
    },
    create: {
      email: adminEmail,
      first_name: 'Super',
      last_name: 'Admin',
      password_hash: hashedPassword,
      auth_provider: 'email',
      status: 'active',
    }
  });

  // Assign role to user
  const existingUserRole = await prisma.user_roles.findFirst({
    where: { user_id: adminUser.id, role_id: adminRole.id }
  });

  if (!existingUserRole) {
    await prisma.user_roles.create({
      data: {
        user_id: adminUser.id,
        role_id: adminRole.id,
        scope_type: 'platform',
      }
    });
  }

  console.log(`\n¡Usuario administrador creado con éxito!`);
  console.log(`Email: ${adminEmail}`);
  console.log(`Contraseña: ${plainPassword}\n`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

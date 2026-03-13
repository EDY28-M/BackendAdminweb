const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.users.findMany({
    select: { email: true, first_name: true, status: true, auth_provider: true }
  });
  console.log("Users in DB:");
  console.dir(users, { depth: null });
  
  const roles = await prisma.user_roles.findMany({
    include: {
      users: { select: { email: true } },
      roles: { select: { name: true, code: true } }
    }
  });
  console.log("\nUser Roles:");
  console.dir(roles, { depth: null });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

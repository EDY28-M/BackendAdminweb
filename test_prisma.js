const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const config = require('./dist/prisma.config').default;

try {
  const prisma = new PrismaClient(config);
  fs.writeFileSync('prisma_err.txt', 'Success config\n');
} catch(e) {
  fs.writeFileSync('prisma_err.txt', e.message + '\n');
}

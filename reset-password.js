const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, name: true }
  });
  console.log('=== Daftar User ===');
  console.log(JSON.stringify(users, null, 2));

  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('admin123', 10);
  const result = await prisma.user.updateMany({
    where: { role: 'ADMIN' },
    data: { password: hash }
  });
  console.log('\nPassword admin direset ke: admin123');
  console.log('User terupdate:', result.count);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); });

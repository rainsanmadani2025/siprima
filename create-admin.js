const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function main() {
  const hash = bcrypt.hashSync("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      password: hash,
      name: "Administrator",
      role: "ADMIN"
    }
  });
  console.log("Akun admin berhasil dibuat!");
  console.log("Username: admin");
  console.log("Password: admin123");
  console.log("ID:", admin.id);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); });

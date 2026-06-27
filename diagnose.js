const Database = require("better-sqlite3");
const { PrismaClient } = require("@prisma/client");

const sqlite = new Database("db/custom.db");
const prisma = new PrismaClient();

async function diagnose() {
  // Cek satu user dari SQLite
  const users = sqlite.prepare("SELECT * FROM User LIMIT 1").all();
  console.log("=== Data User dari SQLite ===");
  console.log(JSON.stringify(users[0], null, 2));

  console.log("\n=== Mencoba insert satu user ===");
  try {
    const row = users[0];
    const data = { ...row };
    if (data.createdAt) data.createdAt = new Date(data.createdAt);
    if (data.updatedAt) data.updatedAt = new Date(data.updatedAt);
    console.log("Data yang akan diinsert:");
    console.log(JSON.stringify(data, null, 2));
    await prisma.user.create({ data });
    console.log("BERHASIL!");
  } catch (err) {
    console.log("ERROR LENGKAP:");
    console.log(err.message);
  }

  sqlite.close();
  await prisma.$disconnect();
}

diagnose();

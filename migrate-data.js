const Database = require("better-sqlite3");
const { PrismaClient } = require("@prisma/client");

const sqlite = new Database("db/custom.db");
const prisma = new PrismaClient();

// Daftar field boolean di semua tabel
const booleanFields = {
  "User": ["isActive"],
  "StudentAttendance": ["isHoliday"],
  "Notification": ["isRead"],
  "Message": ["isRead"],
  "RPPTemplate": ["isActive"]
};

// Urutan insert sesuai relasi
const insertOrder = [
  "School", "User", "Teacher", "Parent", "Class", "Student",
  "Schedule", "StudentAttendance", "TeacherAttendance", "DailyPlan",
  "CurriculumPlan", "StudentAssessment", "Portfolio", "Announcement",
  "Notification", "Message", "TeacherReport", "StudentReport",
  "SchoolActivity", "RPPTemplate", "RPP", "Prosem"
];

async function migrate() {
  // Hapus admin yang tadi dibuat manual
  try {
    await prisma.user.deleteMany({ where: { username: "admin" } });
    console.log("Admin lama dihapus\n");
  } catch(e) {}

  console.log("Memulai pemindahan data...\n");

  for (const model of insertOrder) {
    try {
      const rows = sqlite.prepare("SELECT * FROM " + model).all();
      if (rows.length === 0) {
        console.log(model + ": kosong, dilewati");
        continue;
      }

      let success = 0;
      let failed = 0;

      for (const row of rows) {
        try {
          const data = { ...row };

          // Konversi boolean (0/1 -> false/true)
          const bFields = booleanFields[model] || [];
          for (const bf of bFields) {
            if (data[bf] !== undefined && data[bf] !== null) {
              data[bf] = data[bf] === 1 || data[bf] === true;
            }
          }

          // Konversi tanggal
          for (const key of Object.keys(data)) {
            if (["createdAt","updatedAt","submittedAt","generatedAt"].includes(key) && data[key]) {
              data[key] = new Date(data[key]);
            }
          }

          await prisma[model].create({ data });
          success++;
        } catch (err) {
          failed++;
          if (failed <= 2) {
            console.log("  Gagal: " + err.message.split("\n").pop().trim());
          }
        }
      }
      console.log(model + ": " + success + " berhasil, " + failed + " gagal dari " + rows.length + " data");
    } catch (err) {
      console.log(model + ": tabel tidak ditemukan");
    }
  }

  console.log("\nSelesai!");
  sqlite.close();
  await prisma.$disconnect();
}

migrate();

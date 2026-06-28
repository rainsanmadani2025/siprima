var fs = require('fs');

// === 1. Buat endpoint debug untuk melihat semua data parent ===
var dir = 'src/app/api/guru/debug-parents';
fs.mkdirSync(dir, { recursive: true });

var debugContent = 'import { NextResponse } from \'next/server\'\nimport { db } from \'@/lib/db\'\n\nexport async function GET() {\n  var parents = await db.parent.findMany({ include: { user: true } })\n  var hasil = parents.map(function(p) {\n    return { id: p.id, userName: p.user.name, fatherName: p.fatherName, motherName: p.motherName, fatherPhone: p.fatherPhone, motherPhone: p.motherPhone }\n  })\n  return NextResponse.json({ total: hasil.length, parents: hasil })\n}';

fs.writeFileSync(dir + '/route.ts', debugContent, 'utf8');
console.log('1. Endpoint debug dibuat');

// === 2. Ubah toast di page agar menampilkan data yang dikirim ===
var p = 'src/app/dashboard/guru/siswa/page.tsx';
var c = fs.readFileSync(p, 'utf8');

c = c.replace(
  'toast({ title: "Berhasil", description: editingStudent ? "Data siswa diperbarui" : "Siswa baru berhasil ditambahkan" })',
  'toast({ title: "Berhasil", description: editingStudent ? "Data siswa diperbarui (parentName: " + (bodyData.parentName || "kosong") + ")" : "Siswa baru berhasil ditambahkan" })'
);

fs.writeFileSync(p, c, 'utf8');
console.log('2. Toast debug ditambahkan');
console.log('');
console.log('SELESAI!');
console.log('');
console.log('SETIAP PUSH, lakukan 2 hal:');
console.log('1. Buka di browser: https://siprima-nine.vercel.app/api/guru/debug-parents');
console.log('2. Edit siswa, lihat pesan toast yang muncul (tulis ke sini)');
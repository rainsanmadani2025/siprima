var fs = require('fs');

// === 1. Buat endpoint debug untuk lihat struktur data siswa ===
var dir = 'src/app/api/guru/debug-student';
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + '/route.ts', 'import { NextResponse } from \'next/server\'\nimport { db } from \'@/lib/db\'\nexport async function GET() {\n  var s = await db.student.findFirst({ include: { parent: { include: { user: true } }, class: true } })\n  return NextResponse.json({ parentId: s.parentId, parentObject: { id: s.parent.id, fatherName: s.parent.fatherName, motherName: s.parent.motherName, userName: s.parent.user.name } })\n}', 'utf8');
console.log('1. Debug endpoint dibuat');

// === 2. Perbaiki page: handleEditSiswa pakai parent.name (nama akun) ===
var p = 'src/app/dashboard/guru/siswa/page.tsx';
var c = fs.readFileSync(p, 'utf8');

// Perbaiki handleEditSiswa: pakai nama akun user
var oldEdit = 'parentId: student.parent && (student.parent.fatherName || student.parent.motherName) || ""';
var newEdit = 'parentId: student.parent && (student.parent.name || student.parent.fatherName || student.parent.motherName || "") || ""';
if (c.indexOf(oldEdit) !== -1) {
  c = c.replace(oldEdit, newEdit);
  console.log('2a. handleEditSiswa diperbaiki');
} else {
  // Coba cari variasi lain
  var idx = c.indexOf('var handleEditSiswa = function(student)');
  if (idx !== -1) {
    var end = c.indexOf('});', idx);
    var funcBody = c.substring(idx, end + 3);
    // Ganti semua yang pakai fatherName/motherName jadi name
    funcBody = funcBody.replace('student.parent && (student.parent.fatherName || student.parent.motherName) || ""', 'student.parent && (student.parent.name || student.parent.fatherName || student.parent.motherName || "") || ""');
    c = c.substring(0, idx) + funcBody + c.substring(end + 3);
    console.log('2a. handleEditSiswa diperbaiki (variasi)');
  }
}

// Perbaiki juga tabel: tampilkan nama akun user, bukan fatherName
var oldTable = '{student.parent.fatherName || student.parent.motherName || "-"}';
var newTable = '{student.parent.name || student.parent.fatherName || student.parent.motherName || "-"}';
if (c.indexOf(oldTable) !== -1) {
  c = c.replace(oldTable, newTable);
  console.log('2b. Tabel diperbaiki');
}

fs.writeFileSync(p, c, 'utf8');

// === 3. Perbaiki API: prioritaskan cari by nama akun user ===
var a = 'src/app/api/guru/students/route.ts';
var ac = fs.readFileSync(a, 'utf8');

// Di POST: cari parent by user name dulu
var oldPostSearch = 'var parentRecord = await db.parent.findFirst({ where: { OR: [{ fatherName: parentId }, { motherName: parentId }] } })\n    if (!parentRecord) {\n      var userMatch = await db.user.findFirst({ where: { name: { contains: parentId } } })\n      if (userMatch) { parentRecord = await db.parent.findFirst({ where: { userId: userMatch.id } }) }\n    }';
var newPostSearch = 'var parentRecord = await db.parent.findFirst({ where: { OR: [{ fatherName: parentId }, { motherName: parentId }] } })\n    if (!parentRecord) {\n      var userMatch = await db.user.findFirst({ where: { name: parentId } })\n      if (userMatch) { parentRecord = await db.parent.findFirst({ where: { userId: userMatch.id } }) }\n    }';
if (ac.indexOf(oldPostSearch) !== -1) {
  ac = ac.replace(oldPostSearch, newPostSearch);
  console.log('3a. POST API diperbaiki');
}

// Di PATCH: cari parent by user name dulu
var oldPatchSearch = 'var parentRecord = await db.parent.findFirst({ where: { OR: [{ fatherName: parentName }, { motherName: parentName }] } })\n      if (!parentRecord) {\n        var userMatch = await db.user.findFirst({ where: { name: { contains: parentName } } })\n        if (userMatch) { parentRecord = await db.parent.findFirst({ where: { userId: userMatch.id } }) }\n      }';
var newPatchSearch = 'var parentRecord = await db.parent.findFirst({ where: { OR: [{ fatherName: parentName }, { motherName: parentName }] } })\n      if (!parentRecord) {\n        var userMatch = await db.user.findFirst({ where: { name: parentName } })\n        if (userMatch) { parentRecord = await db.parent.findFirst({ where: { userId: userMatch.id } }) }\n      }';
if (ac.indexOf(oldPatchSearch) !== -1) {
  ac = ac.replace(oldPatchSearch, newPatchSearch);
  console.log('3b. PATCH API diperbaiki');
}

fs.writeFileSync(a, ac, 'utf8');
console.log('');
console.log('SELESAI!');
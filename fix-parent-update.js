var fs = require('fs');

// === 1. Page: kirim parentName saat edit ===
var p = 'src/app/dashboard/guru/siswa/page.tsx';
var c = fs.readFileSync(p, 'utf8');

c = c.replace(
  'var bodyData = editingStudent ? Object.assign({}, formData, { id: editingStudent.id, parentId: undefined }) : formData;',
  'var bodyData = editingStudent ? Object.assign({}, formData, { id: editingStudent.id, parentName: formData.parentId }) : formData;'
);

fs.writeFileSync(p, c, 'utf8');
console.log('1. Page diperbarui');

// === 2. API PATCH: cari parent baru berdasarkan nama ===
var a = 'src/app/api/guru/students/route.ts';
var ac = fs.readFileSync(a, 'utf8');

var oldPatch = 'if (name) updateData.name = name\n    if (birthDate) updateData.birthDate = birthDate\n    if (gender) updateData.gender = gender\n    if (address !== undefined) updateData.address = address || null\n    if (classId !== undefined) updateData.classId = classId || null\n    if (status) updateData.status = status';

var newPatch = 'if (name) updateData.name = name\n    if (birthDate) updateData.birthDate = birthDate\n    if (gender) updateData.gender = gender\n    if (address !== undefined) updateData.address = address || null\n    if (classId !== undefined) updateData.classId = classId || null\n    if (status) updateData.status = status\n    if (body.parentName) {\n      var parentRecord = await db.parent.findFirst({ where: { OR: [{ fatherName: body.parentName }, { motherName: body.parentName }] }, include: { user: true } })\n      if (!parentRecord) {\n        var userMatch = await db.user.findFirst({ where: { name: { contains: body.parentName } } })\n        if (userMatch) { parentRecord = await db.parent.findFirst({ where: { userId: userMatch.id } }, { include: { user: true } }) }\n      }\n      if (parentRecord) updateData.parentId = parentRecord.id\n    }';

ac = ac.replace(oldPatch, newPatch);

fs.writeFileSync(a, ac, 'utf8');
console.log('2. API diperbarui');
console.log('');
console.log('SELESAI!');
var fs = require('fs');
var a = 'src/app/api/guru/students/route.ts';
var c = fs.readFileSync(a, 'utf8');

// Cari awal dan akhir fungsi PATCH
var patchStart = c.indexOf('export async function PATCH');
if (patchStart === -1) {
  console.log('ERROR: Fungsi PATCH tidak ditemukan');
  process.exit(1);
}

var patchEnd = c.indexOf('export async function', patchStart + 10);
if (patchEnd === -1) patchEnd = c.length;

var newPatch = 'export async function PATCH(request: NextRequest) {\n  try {\n    const body = await request.json()\n    const { id, nis, name, birthDate, gender, address, classId, status, parentName } = body\n    if (!id) {\n      return NextResponse.json({ success: false, error: "ID siswa diperlukan" }, { status: 400 })\n    }\n    var updateData: any = {}\n    if (nis) {\n      var cekNis = await db.student.findFirst({ where: { nis: nis, id: { not: id } } })\n      if (cekNis) { return NextResponse.json({ success: false, error: "NIS sudah dipakai siswa lain" }, { status: 400 }) }\n      updateData.nis = nis\n    }\n    if (name) updateData.name = name\n    if (birthDate) updateData.birthDate = birthDate\n    if (gender) updateData.gender = gender\n    if (address !== undefined) updateData.address = address || null\n    if (classId !== undefined) updateData.classId = classId || null\n    if (status) updateData.status = status\n    if (parentName) {\n      var parentRecord = await db.parent.findFirst({ where: { OR: [{ fatherName: parentName }, { motherName: parentName }] } }, { include: { user: true } })\n      if (!parentRecord) {\n        var userMatch = await db.user.findFirst({ where: { name: { contains: parentName } } })\n        if (userMatch) { parentRecord = await db.parent.findFirst({ where: { userId: userMatch.id } }) }\n      }\n      if (parentRecord) { updateData.parentId = parentRecord.id }\n    }\n    var student = await db.student.update({ where: { id }, data: updateData, include: { parent: { include: { user: true } }, class: true } })\n    return NextResponse.json({ success: true, student: { id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate, gender: student.gender, address: student.address, parentId: student.parentId, parent: student.parent ? { id: student.parent.id, name: student.parent.user.name, fatherName: student.parent.fatherName, motherName: student.parent.motherName, fatherPhone: student.parent.fatherPhone, motherPhone: student.parent.motherPhone } : null, classId: student.classId, class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null, status: student.status, createdAt: student.createdAt } })\n  } catch (error) {\n    console.error("Error updating student:", error)\n    return NextResponse.json({ success: false, error: "Gagal mengupdate siswa" }, { status: 500 })\n  }\n}';

c = c.substring(0, patchStart) + newPatch + '\n' + c.substring(patchEnd);

fs.writeFileSync(a, c, 'utf8');
console.log('PATCH handler ditulis ulang!');
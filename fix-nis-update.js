var fs = require('fs');
var a = 'src/app/api/guru/students/route.ts';
var c = fs.readFileSync(a, 'utf8');

c = c.replace(
  'if (name) updateData.name = name',
  'if (nis) { var cekNis = await db.student.findFirst({ where: { nis: nis, id: { not: id } } }); if (cekNis) { return NextResponse.json({ success: false, error: "NIS sudah dipakai siswa lain" }, { status: 400 }) } updateData.nis = nis }\n    if (name) updateData.name = name'
);

fs.writeFileSync(a, c, 'utf8');
console.log('NIS sekarang bisa diupdate!');
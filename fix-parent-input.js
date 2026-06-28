var fs = require('fs');

// === 1. Perbaiki page.tsx: ubah Select orang tua jadi Input ===
var p = 'src/app/dashboard/guru/siswa/page.tsx';
var c = fs.readFileSync(p, 'utf8');

// Hapus fetchParentList dari useEffect
c = c.replace('fetchStudents(); fetchTeacherClasses(); fetchParentList();', 'fetchStudents(); fetchTeacherClasses();');

// Hapus fungsi fetchParentList
c = c.replace("var fetchParentList = async function() { try { var r = await fetch(\"/api/admin/parents\"); var d = await r.json(); if (d.success) setParentList(d.parents) } catch(e) { console.error(e) } };\n  useEffect", "useEffect");

// Ubah field Orang Tua dari Select jadi Input
var oldParent = '<div className="space-y-2"><Label htmlFor="parentId">Orang Tua *</Label><Select value={formData.parentId} onValueChange={function(v){setFormData({...formData, parentId: v})}}><SelectTrigger><SelectValue placeholder="Pilih orang tua" /></SelectTrigger><SelectContent>{parentList.map(function(p){return <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>})}</SelectContent></Select></div>';

var newParent = '<div className="space-y-2"><Label htmlFor="parentName">Nama Orang Tua *</Label><Input id="parentName" placeholder="Ketik nama ayah/ibu" value={formData.parentId} onChange={function(e){setFormData({...formData, parentId: e.target.value})}} required /></div>';

c = c.replace(oldParent, newParent);

fs.writeFileSync(p, c, 'utf8');
console.log('1. Page diperbarui');

// === 2. Perbaiki API: cari parent berdasarkan nama ===
var a = 'src/app/api/guru/students/route.ts';
var ac = fs.readFileSync(a, 'utf8');

ac = ac.replace(
  "const existingParent = await db.parent.findUnique({ where: { id: parentId } })",
  "var parentRecord = await db.parent.findFirst({ where: { OR: [{ fatherName: parentId }, { motherName: parentId }] }, include: { user: true } })\n    if (!parentRecord) {\n      var userMatch = await db.user.findFirst({ where: { name: { contains: parentId } } })\n      if (userMatch) {\n        parentRecord = await db.parent.findFirst({ where: { userId: userMatch.id } }, { include: { user: true } })\n      }\n    }\n    if (!parentRecord) {\n      return NextResponse.json({ success: false, error: 'Orang tua tidak ditemukan. Pastikan nama sudah terdaftar di sistem.' }, { status: 400 })\n    }\n    var realParentId = parentRecord.id"
);

ac = ac.replace("parentId,", "parentId: realParentId,");

fs.writeFileSync(a, ac, 'utf8');
console.log('2. API diperbarui');
console.log('');
console.log('SELESAI!');
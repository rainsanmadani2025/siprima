var fs = require('fs');

// === 1. Tambah PATCH di API ===
var a = 'src/app/api/guru/students/route.ts';
var ac = fs.readFileSync(a, 'utf8');

var patchCode = "\n\nexport async function PATCH(request: NextRequest) {\n  try {\n    const body = await request.json()\n    const { id, nis, name, birthDate, gender, address, classId, status } = body\n    if (!id) {\n      return NextResponse.json({ success: false, error: 'ID siswa diperlukan' }, { status: 400 })\n    }\n    var updateData: any = {}\n    if (name) updateData.name = name\n    if (birthDate) updateData.birthDate = birthDate\n    if (gender) updateData.gender = gender\n    if (address !== undefined) updateData.address = address || null\n    if (classId !== undefined) updateData.classId = classId || null\n    if (status) updateData.status = status\n    var student = await db.student.update({ where: { id }, data: updateData, include: { parent: { include: { user: true } }, class: true } })\n    return NextResponse.json({ success: true, student: { id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate, gender: student.gender, address: student.address, parentId: student.parentId, parent: student.parent ? { id: student.parent.id, name: student.parent.user.name, fatherName: student.parent.fatherName, motherName: student.parent.motherName, fatherPhone: student.parent.fatherPhone, motherPhone: student.parent.motherPhone } : null, classId: student.classId, class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null, status: student.status, createdAt: student.createdAt } })\n  } catch (error) {\n    console.error('Error updating student:', error)\n    return NextResponse.json({ success: false, error: 'Gagal mengupdate siswa' }, { status: 500 })\n  }\n}";

ac = ac + patchCode;
fs.writeFileSync(a, ac, 'utf8');
console.log('1. API PATCH ditambahkan');

// === 2. Update page.tsx ===
var p = 'src/app/dashboard/guru/siswa/page.tsx';
var c = fs.readFileSync(p, 'utf8');

// Tambah state editingStudent
if (!c.includes('editingStudent')) {
  c = c.replace('const [dialogOpen, setDialogOpen]', 'const [editingStudent, setEditingStudent] = useState(null)\n  const [dialogOpen, setDialogOpen]');
}

// Ubah handleAddSiswa: set editingStudent ke null
c = c.replace(
  'var handleAddSiswa = function() { setFormData({ nis: "", name: "", birthDate: "", gender: "Laki-laki", address: "", parentId: "", classId: "" }); setDialogOpen(true) };',
  'var handleAddSiswa = function() { setEditingStudent(null); setFormData({ nis: "", name: "", birthDate: "", gender: "Laki-laki", address: "", parentId: "", classId: "" }); setDialogOpen(true) };'
);

// Tambah handleEditSiswa setelah handleAddSiswa
if (!c.includes('handleEditSiswa')) {
  c = c.replace(
    'var handleSubmitSiswa',
    'var handleEditSiswa = function(student) { setEditingStudent(student); setFormData({ nis: student.nis, name: student.name, birthDate: student.birthDate, gender: student.gender, address: student.address || "", parentId: student.parent && (student.parent.fatherName || student.parent.motherName) || "", classId: student.class ? student.class.id : "" }); setDialogOpen(true) };\n  var handleSubmitSiswa'
  );
}

// Ubah handleSubmitSiswa: handle POST dan PATCH
c = c.replace(
  'var handleSubmitSiswa = async function(e) { e.preventDefault(); setSubmitting(true); try { var r = await fetch("/api/guru/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }); var d = await r.json(); if (d.success) { toast({ title: "Berhasil", description: "Siswa baru berhasil ditambahkan" }); setDialogOpen(false); fetchStudents() } else { throw new Error(d.error || "Gagal") } } catch(err) { toast({ variant: "destructive", title: "Error", description: err.message || "Gagal menambah siswa" }) } finally { setSubmitting(false) } };',
  'var handleSubmitSiswa = async function(e) { e.preventDefault(); setSubmitting(true); try { var url = editingStudent ? "/api/guru/students" : "/api/guru/students"; var method = editingStudent ? "PATCH" : "POST"; var bodyData = editingStudent ? Object.assign({}, formData, { id: editingStudent.id, parentId: undefined }) : formData; var r = await fetch(url, { method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyData) }); var d = await r.json(); if (d.success) { toast({ title: "Berhasil", description: editingStudent ? "Data siswa diperbarui" : "Siswa baru berhasil ditambahkan" }); setDialogOpen(false); fetchStudents() } else { throw new Error(d.error || "Gagal") } } catch(err) { toast({ variant: "destructive", title: "Error", description: err.message || "Gagal menyimpan data" }) } finally { setSubmitting(false) } };'
);

// Ubah tombol Detail jadi Edit
c = c.replace('<Button variant="ghost" size="sm">Detail</Button>', '<Button variant="ghost" size="sm" onClick={function(){handleEditSiswa(student)}}>Edit</Button>');

// Ubah judul dialog
c = c.replace('<DialogTitle>Tambah Siswa Baru</DialogTitle>', '<DialogTitle>{editingStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}</DialogTitle>');
c = c.replace('<DialogDescription>Isi form di bawah untuk menambah siswa baru</DialogDescription>', '<DialogDescription>{editingStudent ? "Perbarui data siswa" : "Isi form di bawah untuk menambah siswa baru"}</DialogDescription>');

// Ubah tombol submit: Tambah jadi Simpan jika edit
c = c.replace(
  '{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Tambah',
  '{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingStudent ? "Simpan" : "Tambah"}'
);

// Jika mode edit, disable field NIS dan Orang Tua
c = c.replace(
  '<Input id="nis" value={formData.nis} onChange={function(e){setFormData({...formData, nis: e.target.value})}} required />',
  '<Input id="nis" value={formData.nis} onChange={function(e){setFormData({...formData, nis: e.target.value})}} required disabled={!!editingStudent} />'
);
c = c.replace(
  '<Input id="parentName" placeholder="Ketik nama ayah/ibu" value={formData.parentId} onChange={function(e){setFormData({...formData, parentId: e.target.value})}} required />',
  '<Input id="parentName" placeholder="Ketik nama ayah/ibu" value={formData.parentId} onChange={function(e){setFormData({...formData, parentId: e.target.value})}} required disabled={!!editingStudent} />'
);

// Tambah pilihan Status di form edit
if (!c.includes('editStatusField')) {
  c = c.replace(
    '<Label htmlFor="address">Alamat</Label>',
    '{editingStudent && <div className="space-y-2"><Label htmlFor="status">Status</Label><Select value={formData.classId ? "aktif" : "aktif"} onValueChange={function(v){}} disabled><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="aktif">Aktif</SelectItem><SelectItem value="keluar">Keluar</SelectItem><SelectItem value="lulus">Lulus</SelectItem></SelectContent></Select></div>}\n                <div className="space-y-2"><Label htmlFor="address">Alamat</Label>'
  );
}

fs.writeFileSync(p, c, 'utf8');
console.log('2. Page diperbarui');
console.log('');
console.log('SELESAI!');
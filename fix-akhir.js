var fs = require('fs');
var p = 'src/app/dashboard/guru/siswa/page.tsx';
var c = fs.readFileSync(p, 'utf8');

function gantiFungsi(code, namaFungsi, fungsiBaru) {
  var start = code.indexOf(namaFungsi);
  if (start === -1) return { code: code, ok: false, msg: 'Fungsi ' + namaFungsi + ' tidak ditemukan' };
  var depth = 0;
  var end = -1;
  for (var i = start; i < code.length; i++) {
    if (code[i] === '{') depth++;
    if (code[i] === '}') {
      depth--;
      if (depth === 0 && code.substring(i, i + 2) === '};') {
        end = i + 2;
        break;
      }
    }
  }
  if (end === -1) return { code: code, ok: false, msg: 'Tidak menemukan akhir fungsi' };
  code = code.substring(0, start) + fungsiBaru + code.substring(end);
  return { code: code, ok: true, msg: 'Fungsi diganti' };
}

// Ganti handleEditSiswa
var editBaru = 'var handleEditSiswa = function(student) { setEditingStudent(student); setFormData({ nis: student.nis, name: student.name, birthDate: student.birthDate, gender: student.gender, address: student.address || "", parentId: (student.parent && (student.parent.fatherName || student.parent.motherName)) || "", classId: student.class ? student.class.id : "" }); setDialogOpen(true) };';

var r1 = gantiFungsi(c, 'var handleEditSiswa', editBaru);
c = r1.code;
console.log('1. handleEditSiswa: ' + r1.msg);

// Ganti handleSubmitSiswa
var submitBaru = 'var handleSubmitSiswa = async function(e) { e.preventDefault(); setSubmitting(true); try { var method = editingStudent ? "PATCH" : "POST"; var body = editingStudent ? { id: editingStudent.id, nis: formData.nis, name: formData.name, birthDate: formData.birthDate, gender: formData.gender, address: formData.address, classId: formData.classId || null, parentName: formData.parentId } : formData; var r = await fetch("/api/guru/students", { method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); var d = await r.json(); if (d.success) { toast({ title: "Berhasil", description: editingStudent ? "Data siswa diperbarui" : "Siswa baru berhasil ditambahkan" }); setDialogOpen(false); fetchStudents() } else { throw new Error(d.error || "Gagal") } } catch(err) { toast({ variant: "destructive", title: "Error", description: err.message || "Gagal menyimpan data" }) } finally { setSubmitting(false) } };';

var r2 = gantiFungsi(c, 'var handleSubmitSiswa', submitBaru);
c = r2.code;
console.log('2. handleSubmitSiswa: ' + r2.msg);

fs.writeFileSync(p, c, 'utf8');
console.log('');
console.log('SELESAI!');
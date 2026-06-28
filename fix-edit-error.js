var fs = require('fs');
var p = 'src/app/dashboard/guru/siswa/page.tsx';
var c = fs.readFileSync(p, 'utf8');

// Hapus baris status field yang bermasalah
var badStatus = '{editingStudent && <div className="space-y-2"><Label htmlFor="status">Status</Label><Select value={formData.classId ? "aktif" : "aktif"} onValueChange={function(v){}} disabled><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="aktif">Aktif</SelectItem><SelectItem value="keluar">Keluar</SelectItem><SelectItem value="lulus">Lulus</SelectItem></SelectContent></Select></div>}\n                ';
c = c.replace(badStatus, '');

// Perbaiki juga: pastikan closing tag form benar
// Cek apakah ada duplikasi atau masalah lain
if (c.indexOf('editingStudent ? "Simpan"') === -1) {
  // Jika gagal replace, coba versi lain
  c = c.replace(
    '{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Tambah',
    '{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingStudent ? "Simpan" : "Tambah"}'
  );
}

fs.writeFileSync(p, c, 'utf8');
console.log('Diperbaiki!');
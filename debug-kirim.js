var fs = require('fs');
var p = 'src/app/dashboard/guru/siswa/page.tsx';
var c = fs.readFileSync(p, 'utf8');

// Tambahkan alert sementara untuk melihat data yang dikirim
c = c.replace(
  'var r = await fetch(url, { method: method',
  'alert("DATA YANG DIKIRIM:\\n" + JSON.stringify(bodyData, null, 2)); var r = await fetch(url, { method: method'
);

fs.writeFileSync(p, c, 'utf8');
console.log('Debug alert ditambahkan');
console.log('');
console.log('SEKARANG:');
console.log('1. Push dulu: git add . ; git commit -m "Debug" ; git push origin main');
console.log('2. Setelah deploy, buka halaman guru/siswa, edit siswa, lalu klik Simpan');
console.log('3. Akan muncul popup (alert) berisi data yang dikirim ke server');
console.log('4. Screenshot/kirimkan isi popup tersebut ke saya');
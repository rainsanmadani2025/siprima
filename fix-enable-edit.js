var fs = require('fs');
var p = 'src/app/dashboard/guru/siswa/page.tsx';
var c = fs.readFileSync(p, 'utf8');

c = c.replace('required disabled={!!editingStudent} />', 'required />');

fs.writeFileSync(p, c, 'utf8');
console.log('NIS dan Orang Tua sudah bisa diedit!');
var fs = require('fs');
var p = 'src/app/dashboard/guru/siswa/page.tsx';
var c = fs.readFileSync(p, 'utf8');

// Hapus baris import Baby yang terpisah
c = c.replace('import { Baby } from "lucide-react"\n', '');

// Perbaiki baris import yang rusak: ganti } } jadi , Baby }
c = c.replace('Ear } } from "lucide-react"', 'Ear, Baby } from "lucide-react"');

fs.writeFileSync(p, c, 'utf8');
console.log('Diperbaiki!');
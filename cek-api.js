var fs = require('fs');

// Buat endpoint yang menunjukkan data yang diterima halaman guru
var dir = 'src/app/api/guru/cek-data';
fs.mkdirSync(dir, { recursive: true });

var content = 'import { NextResponse } from \'next/server\'\nimport { db } from \'@/lib/db\'\n\nexport async function GET() {\n  var students = await db.student.findMany({ include: { parent: { include: { user: true } }, class: true } })\n  var s = students[0]\n  return NextResponse.json({\n    tabelMenampilkan: s.parent ? (s.parent.fatherName || s.parent.motherName || "-") : "-",\n    parentNameField: s.parent ? s.parent.user.name : null,\n    fatherName: s.parent ? s.parent.fatherName : null,\n    motherName: s.parent ? s.parent.motherName : null,\n    semuaKeyParent: s.parent ? Object.keys(s.parent) : []\n  })\n}';

fs.writeFileSync(dir + '/route.ts', content, 'utf8');
console.log('Endpoint cek-data dibuat');
console.log('');
console.log('Buka: https://siprima-nine.vercel.app/api/guru/cek-data');
console.log('Kirim hasilnya ke saya');
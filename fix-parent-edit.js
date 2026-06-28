var fs = require('fs');
var p = 'src/app/dashboard/guru/siswa/page.tsx';
var c = fs.readFileSync(p, 'utf8');

c = c.replace('placeholder="Ketik nama ayah/ibu" value={formData.parentId} onChange={function(e){setFormData({...formData, parentId: e.target.value})}} required disabled={!!editingStudent} />', 'placeholder="Ketik nama ayah/ibu" value={formData.parentId} onChange={function(e){setFormData({...formData, parentId: e.target.value})}} required />');

fs.writeFileSync(p, c, 'utf8');
console.log('Nama orang tua sudah bisa diedit!');
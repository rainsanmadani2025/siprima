const fs = require('fs');
const path = require('path');

var apiDir = path.join(__dirname, 'src', 'app', 'api', 'guru', 'students');
fs.mkdirSync(apiDir, { recursive: true });

var apiLines = [
  "import { NextRequest, NextResponse } from 'next/server'",
  "import { db } from '@/lib/db'",
  "",
  "export async function POST(request: NextRequest) {",
  "  try {",
  "    const body = await request.json()",
  "    const { nis, name, birthDate, gender, address, parentId, classId, status } = body",
  "    if (!nis || !name || !birthDate || !gender || !parentId) {",
  "      return NextResponse.json({ success: false, error: 'Field wajib: NIS, nama, tanggal lahir, jenis kelamin, orang tua' }, { status: 400 })",
  "    }",
  "    const existingNis = await db.student.findUnique({ where: { nis } })",
  "    if (existingNis) {",
  "      return NextResponse.json({ success: false, error: 'NIS sudah terdaftar' }, { status: 400 })",
  "    }",
  "    const existingParent = await db.parent.findUnique({ where: { id: parentId } })",
  "    if (!existingParent) {",
  "      return NextResponse.json({ success: false, error: 'Data orang tua tidak ditemukan' }, { status: 400 })",
  "    }",
  "    const student = await db.student.create({",
  "      data: { nis, name, birthDate, gender, address: address || null, parentId, classId: classId || null, status: status || 'aktif' },",
  "      include: { parent: { include: { user: true } }, class: true }",
  "    })",
  "    return NextResponse.json({",
  "      success: true,",
  "      student: {",
  "        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate,",
  "        gender: student.gender, address: student.address, parentId: student.parentId,",
  "        parent: student.parent ? {",
  "          id: student.parent.id, name: student.parent.user.name,",
  "          fatherName: student.parent.fatherName, motherName: student.parent.motherName,",
  "          fatherPhone: student.parent.fatherPhone, motherPhone: student.parent.motherPhone",
  "        } : null,",
  "        classId: student.classId,",
  "        class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null,",
  "        status: student.status, createdAt: student.createdAt",
  "      }",
  "    })",
  "  } catch (error) {",
  "    console.error('Error creating student:', error)",
  "    return NextResponse.json({ success: false, error: 'Gagal menambah siswa' }, { status: 500 })",
  "  }",
  "}",
];
fs.writeFileSync(path.join(apiDir, 'route.ts'), apiLines.join('\n'), 'utf8');
console.log('1. API dibuat: src/app/api/guru/students/route.ts');

var pagePath = path.join(__dirname, 'src', 'app', 'dashboard', 'guru', 'siswa', 'page.tsx');
var page = fs.readFileSync(pagePath, 'utf8');

if (!page.includes('import { Label }')) {
  page = page.replace('import { Input } from "@/components/ui/input"', 'import { Input } from "@/components/ui/input"\nimport { Label } from "@/components/ui/label"');
}
if (!page.includes('import { Select,')) {
  page = page.replace('import { ScrollArea }', 'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"\nimport { ScrollArea }');
}
if (!page.includes('DialogDescription') && !page.includes('DialogFooter')) {
  page = page.replace('import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"', 'import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"');
}
if (!page.includes('useToast')) {
  page = page.replace('import { useState, useEffect } from "react"', 'import { useToast } from "@/hooks/use-toast"\nimport { useState, useEffect } from "react"');
}
if (page.indexOf(', Baby') === -1 && page.indexOf('"Baby"') === -1) {
  page = page.replace('from "lucide-react"', ', Baby } from "lucide-react"').replace('import { Plus', 'import { Plus').replace(', Baby } from "lucide-react"', '} from "lucide-react"\nimport { Baby } from "lucide-react"');
  page = page.replace(/import \{([^}]+)\}\s*from "lucide-react"\s*\n\s*import \{ Baby \} from "lucide-react"/, 'import {$1, Baby} from "lucide-react"');
}
if (!page.includes('interface Parent')) {
  page = page.replace('export default function GuruSiswaPage()', 'interface Parent { id: string; name: string }\ninterface Class { id: string; name: string; ageGroup: string }\n\nexport default function GuruSiswaPage()');
}
if (!page.includes('const [dialogOpen')) {
  page = page.replace('const [teacherClasses, setTeacherClasses] = useState<string[]>([])', 'const [teacherClasses, setTeacherClasses] = useState<string[]>([])\n  const [dialogOpen, setDialogOpen] = useState(false)\n  const [submitting, setSubmitting] = useState(false)\n  const [parentList, setParentList] = useState<Parent[]>([])\n  const [classList, setClassList] = useState<Class[]>([])\n  const [formData, setFormData] = useState({ nis: "", name: "", birthDate: "", gender: "Laki-laki", address: "", parentId: "", classId: "" })\n  const { toast } = useToast()');
}
if (!page.includes('fetchParentList')) {
  page = page.replace("setTeacherClasses(classNames)", "setTeacherClasses(classNames); setClassList(data.teacherClasses.map(function(c) { return { id: c.id, name: c.name, ageGroup: c.ageGroup } }))");
  page = page.replace('useEffect(() => {', 'var fetchParentList = async function() { try { var r = await fetch("/api/admin/parents"); var d = await r.json(); if (d.success) setParentList(d.parents) } catch(e) { console.error(e) } };\n  useEffect(() => {');
  page = page.replace('fetchStudents()\n    fetchTeacherClasses()\n  }', 'fetchStudents(); fetchTeacherClasses(); fetchParentList();\n  }');
}
if (!page.includes('handleAddSiswa')) {
  page = page.replace('const handleShowImmunization = () => {', 'var handleAddSiswa = function() { setFormData({ nis: "", name: "", birthDate: "", gender: "Laki-laki", address: "", parentId: "", classId: "" }); setDialogOpen(true) };\n  var handleSubmitSiswa = async function(e) { e.preventDefault(); setSubmitting(true); try { var r = await fetch("/api/guru/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }); var d = await r.json(); if (d.success) { toast({ title: "Berhasil", description: "Siswa baru berhasil ditambahkan" }); setDialogOpen(false); fetchStudents() } else { throw new Error(d.error || "Gagal") } } catch(err) { toast({ variant: "destructive", title: "Error", description: err.message || "Gagal menambah siswa" }) } finally { setSubmitting(false) } };\n  const handleShowImmunization = () => {');
}
if (!page.includes('handleAddSiswa}')) {
  page = page.replace('<Button onClick={fetchStudents}>', '<Button onClick={handleAddSiswa}><Plus className="mr-2 h-4 w-4" />Tambah Siswa</Button><Button onClick={fetchStudents}>');
}
if (!page.includes('Dialog Tambah Siswa')) {
  var dlg = '        {/* Dialog Tambah Siswa */}\n        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>\n          <DialogContent className="sm:max-w-[600px]">\n            <DialogHeader>\n              <DialogTitle>Tambah Siswa Baru</DialogTitle>\n              <DialogDescription>Isi form di bawah untuk menambah siswa baru</DialogDescription>\n            </DialogHeader>\n            <form onSubmit={handleSubmitSiswa}>\n              <div className="grid gap-4 py-4">\n                <div className="grid gap-2"><Label htmlFor="name">Nama Lengkap *</Label><div className="flex"><Baby className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" /><Input id="name" value={formData.name} onChange={function(e){setFormData({...formData, name: e.target.value})}} className="rounded-l-none" required /></div></div>\n                <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="nis">NIS *</Label><Input id="nis" value={formData.nis} onChange={function(e){setFormData({...formData, nis: e.target.value})}} required /></div><div className="space-y-2"><Label htmlFor="gender">Jenis Kelamin *</Label><Select value={formData.gender} onValueChange={function(v){setFormData({...formData, gender: v})}}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Laki-laki">Laki-laki</SelectItem><SelectItem value="Perempuan">Perempuan</SelectItem></SelectContent></Select></div></div>\n                <div className="space-y-2"><Label htmlFor="birthDate">Tanggal Lahir *</Label><div className="flex"><Calendar className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" /><Input id="birthDate" type="date" value={formData.birthDate} onChange={function(e){setFormData({...formData, birthDate: e.target.value})}} className="rounded-l-none" required /></div></div>\n                <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="parentId">Orang Tua *</Label><Select value={formData.parentId} onValueChange={function(v){setFormData({...formData, parentId: v})}}><SelectTrigger><SelectValue placeholder="Pilih orang tua" /></SelectTrigger><SelectContent>{parentList.map(function(p){return <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>})}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="classId">Kelas</Label><Select value={formData.classId || "none"} onValueChange={function(v){setFormData({...formData, classId: v === "none" ? "" : v})}}><SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger><SelectContent><SelectItem value="none">Belum ada kelas</SelectItem>{classList.map(function(c){return <SelectItem key={c.id} value={c.id}>{c.name} ({c.ageGroup})</SelectItem>})}</SelectContent></Select></div></div>\n                <div className="space-y-2"><Label htmlFor="address">Alamat</Label><div className="flex"><MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" /><Input id="address" value={formData.address} onChange={function(e){setFormData({...formData, address: e.target.value})}} className="rounded-l-none" /></div></div>\n              </div>\n              <DialogFooter>\n                <Button type="button" variant="outline" onClick={function(){setDialogOpen(false)}}>Batal</Button>\n                <Button type="submit" disabled={submitting}>{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Tambah</Button>\n              </DialogFooter>\n            </form>\n          </DialogContent>\n        </Dialog>\n\n';
  page = page.replace('{/* Modal Riwayat Kelas */}', dlg + '{/* Modal Riwayat Kelas */}');
}

fs.writeFileSync(pagePath, page, 'utf8');
console.log('2. Page diperbarui: src/app/dashboard/guru/siswa/page.tsx');
console.log('');
console.log('SELESAI!');
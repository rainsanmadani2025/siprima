const fs = require('fs');
const path = require('path');

const BASE = process.cwd();

// ==========================================
// 1. BUAT FILE BARU: src/app/api/guru/students/route.ts
// ==========================================
const guruApiPath = path.join(BASE, 'src/app/api/guru/students/route.ts');
const guruApiDir = path.dirname(guruApiPath);

if (!fs.existsSync(guruApiDir)) {
  fs.mkdirSync(guruApiDir, { recursive: true });
}

const guruApiContent = `import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function findOrCreateParent(name: string) {
  if (!name || name.trim() === '') return null
  const trimmedName = name.trim()

  let parent = await db.parent.findFirst({
    where: { fatherName: trimmedName },
    include: { user: true }
  })
  if (parent) return parent

  parent = await db.parent.findFirst({
    where: { motherName: trimmedName },
    include: { user: true }
  })
  if (parent) return parent

  const allParents = await db.parent.findMany({ include: { user: true } })
  parent = allParents.find(p => p.user.name.toLowerCase() === trimmedName.toLowerCase())
  if (parent) return parent

  const newUser = await db.user.create({
    data: {
      username: \`ortu_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}\`,
      password: 'ortu_default_2024',
      name: trimmedName,
      role: 'ORTU',
      isActive: true
    }
  })
  const newParent = await db.parent.create({
    data: { userId: newUser.id, fatherName: trimmedName },
    include: { user: true }
  })
  return newParent
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nis, name, birthDate, gender, address, parentName, classId, status } = body
    if (!nis || !name || !birthDate || !gender || !parentName) {
      return NextResponse.json({ success: false, error: 'NIS, nama, tanggal lahir, jenis kelamin, dan nama orang tua wajib diisi' }, { status: 400 })
    }
    const existingNis = await db.student.findUnique({ where: { nis } })
    if (existingNis) {
      return NextResponse.json({ success: false, error: 'NIS sudah terdaftar' }, { status: 400 })
    }
    const parent = await findOrCreateParent(parentName)
    if (!parent) {
      return NextResponse.json({ success: false, error: 'Gagal menemukan atau membuat data orang tua' }, { status: 400 })
    }
    const student = await db.student.create({
      data: { nis, name, birthDate, gender, address, parentId: parent.id, classId: classId || null, status: status || 'aktif' },
      include: { parent: true, class: true }
    })
    return NextResponse.json({
      success: true,
      student: {
        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate,
        gender: student.gender, address: student.address,
        parentName: student.parent?.fatherName || student.parent?.motherName || '',
        classId: student.classId, className: student.class?.name || '', classAgeGroup: student.class?.ageGroup || '',
        status: student.status
      }
    })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ success: false, error: 'Gagal menambah siswa' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nis, name, birthDate, gender, address, parentName, classId, status } = body
    if (!id) return NextResponse.json({ success: false, error: 'ID siswa diperlukan' }, { status: 400 })
    const existingStudent = await db.student.findUnique({ where: { id } })
    if (!existingStudent) return NextResponse.json({ success: false, error: 'Siswa tidak ditemukan' }, { status: 404 })
    if (nis && nis !== existingStudent.nis) {
      const dup = await db.student.findUnique({ where: { nis } })
      if (dup) return NextResponse.json({ success: false, error: 'NIS sudah terdaftar' }, { status: 400 })
    }
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (nis !== undefined) updateData.nis = nis
    if (birthDate !== undefined) updateData.birthDate = birthDate
    if (gender !== undefined) updateData.gender = gender
    if (address !== undefined) updateData.address = address
    if (classId !== undefined) updateData.classId = classId || null
    if (status !== undefined) updateData.status = status
    if (parentName !== undefined && parentName.trim() !== '') {
      const parent = await findOrCreateParent(parentName)
      if (parent) updateData.parentId = parent.id
    }
    const student = await db.student.update({
      where: { id }, data: updateData,
      include: { parent: true, class: true }
    })
    return NextResponse.json({
      success: true,
      student: {
        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate,
        gender: student.gender, address: student.address,
        parentName: student.parent?.fatherName || student.parent?.motherName || '',
        classId: student.classId, className: student.class?.name || '', classAgeGroup: student.class?.ageGroup || '',
        status: student.status
      }
    })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json({ success: false, error: 'Gagal memperbarui siswa' }, { status: 500 })
  }
}
`;

fs.writeFileSync(guruApiPath, guruApiContent, 'utf8');
console.log('✅ 1/4 Created: src/app/api/guru/students/route.ts');

// ==========================================
// 2. UPDATE: src/app/api/admin/students/route.ts
// ==========================================
const adminApiPath = path.join(BASE, 'src/app/api/admin/students/route.ts');
const adminApiNew = `import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function findOrCreateParent(name: string) {
  if (!name || name.trim() === '') return null
  const trimmedName = name.trim()
  let parent = await db.parent.findFirst({ where: { fatherName: trimmedName }, include: { user: true } })
  if (parent) return parent
  parent = await db.parent.findFirst({ where: { motherName: trimmedName }, include: { user: true } })
  if (parent) return parent
  const allParents = await db.parent.findMany({ include: { user: true } })
  parent = allParents.find(p => p.user.name.toLowerCase() === trimmedName.toLowerCase())
  if (parent) return parent
  const newUser = await db.user.create({
    data: { username: \`ortu_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}\`, password: 'ortu_default_2024', name: trimmedName, role: 'ORTU', isActive: true }
  })
  return await db.parent.create({ data: { userId: newUser.id, fatherName: trimmedName }, include: { user: true } })
}

export async function GET() {
  try {
    const students = await db.student.findMany({ include: { parent: { include: { user: true } }, class: true }, orderBy: { createdAt: 'desc' } })
    const studentList = students.map(s => ({
      id: s.id, name: s.name, nis: s.nis, birthDate: s.birthDate, gender: s.gender, address: s.address,
      parentId: s.parentId,
      parent: s.parent ? { id: s.parent.id, name: s.parent.fatherName || s.parent.motherName || s.parent.user.name } : null,
      classId: s.classId, class: s.class ? { id: s.class.id, name: s.class.name, ageGroup: s.class.ageGroup } : null,
      status: s.status, createdAt: s.createdAt
    }))
    return NextResponse.json({ success: true, students: studentList })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nis, name, birthDate, gender, address, parentName, classId, status } = body
    if (!nis || !name || !birthDate || !gender || !parentName) {
      return NextResponse.json({ success: false, error: 'NIS, nama, tanggal lahir, jenis kelamin, dan nama orang tua wajib diisi' }, { status: 400 })
    }
    const existingNis = await db.student.findUnique({ where: { nis } })
    if (existingNis) return NextResponse.json({ success: false, error: 'NIS sudah terdaftar' }, { status: 400 })
    const parent = await findOrCreateParent(parentName)
    if (!parent) return NextResponse.json({ success: false, error: 'Gagal menemukan atau membuat data orang tua' }, { status: 400 })
    const student = await db.student.create({
      data: { nis, name, birthDate, gender, address, parentId: parent.id, classId: classId || null, status: status || 'aktif' },
      include: { parent: { include: { user: true } }, class: true }
    })
    return NextResponse.json({
      success: true,
      student: {
        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate, gender: student.gender, address: student.address,
        parentId: student.parentId,
        parent: student.parent ? { id: student.parent.id, name: student.parent.fatherName || student.parent.motherName || student.parent.user.name } : null,
        classId: student.classId, class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null,
        status: student.status, createdAt: student.createdAt
      }
    })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ success: false, error: 'Failed to create student' }, { status: 500 })
  }
}
`;

fs.writeFileSync(adminApiPath, adminApiNew, 'utf8');
console.log('✅ 2/4 Updated: src/app/api/admin/students/route.ts');

// ==========================================
// 3. UPDATE: src/app/api/admin/students/[id]/route.ts
// ==========================================
const adminIdApiPath = path.join(BASE, 'src/app/api/admin/students/[id]/route.ts');
const adminIdApiNew = `import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function findOrCreateParent(name: string) {
  if (!name || name.trim() === '') return null
  const trimmedName = name.trim()
  let parent = await db.parent.findFirst({ where: { fatherName: trimmedName }, include: { user: true } })
  if (parent) return parent
  parent = await db.parent.findFirst({ where: { motherName: trimmedName }, include: { user: true } })
  if (parent) return parent
  const allParents = await db.parent.findMany({ include: { user: true } })
  parent = allParents.find(p => p.user.name.toLowerCase() === trimmedName.toLowerCase())
  if (parent) return parent
  const newUser = await db.user.create({
    data: { username: \`ortu_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}\`, password: 'ortu_default_2024', name: trimmedName, role: 'ORTU', isActive: true }
  })
  return await db.parent.create({ data: { userId: newUser.id, fatherName: trimmedName }, include: { user: true } })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const student = await db.student.findUnique({ where: { id }, include: { parent: { include: { user: true } }, class: true } })
    if (!student) return NextResponse.json({ success: false, error: 'Siswa tidak ditemukan' }, { status: 404 })
    let parsedHealthData = null, parsedImmunization = null
    try { parsedHealthData = student.healthData ? JSON.parse(student.healthData) : null } catch (e) { parsedHealthData = student.healthData }
    try { parsedImmunization = student.immunization ? JSON.parse(student.immunization) : null } catch (e) { parsedImmunization = student.immunization }
    return NextResponse.json({
      success: true, student: {
        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate, gender: student.gender, address: student.address,
        parentId: student.parentId,
        parent: student.parent ? { id: student.parent.id, name: student.parent.fatherName || student.parent.motherName || student.parent.user.name, fatherName: student.parent.fatherName, motherName: student.parent.motherName } : null,
        classId: student.classId, class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null,
        status: student.status, healthData: parsedHealthData, immunization: parsedImmunization, createdAt: student.createdAt
      }
    })
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengambil data siswa' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nis, name, birthDate, gender, address, parentName, classId, status } = body
    const existingStudent = await db.student.findUnique({ where: { id } })
    if (!existingStudent) return NextResponse.json({ success: false, error: 'Siswa tidak ditemukan' }, { status: 404 })
    if (nis && nis !== existingStudent.nis) {
      const dup = await db.student.findUnique({ where: { nis } })
      if (dup) return NextResponse.json({ success: false, error: 'NIS sudah terdaftar' }, { status: 400 })
    }
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (nis !== undefined) updateData.nis = nis
    if (birthDate !== undefined) updateData.birthDate = birthDate
    if (gender !== undefined) updateData.gender = gender
    if (address !== undefined) updateData.address = address
    if (classId !== undefined) updateData.classId = classId
    if (status !== undefined) updateData.status = status
    if (parentName !== undefined && parentName.trim() !== '') {
      const parent = await findOrCreateParent(parentName)
      if (parent) updateData.parentId = parent.id
    }
    const student = await db.student.update({ where: { id }, data: updateData, include: { parent: { include: { user: true } }, class: true } })
    return NextResponse.json({
      success: true, student: {
        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate, gender: student.gender, address: student.address,
        parentId: student.parentId,
        parent: student.parent ? { id: student.parent.id, name: student.parent.fatherName || student.parent.motherName || student.parent.user.name } : null,
        classId: student.classId, class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null,
        status: student.status, createdAt: student.createdAt
      }
    })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json({ success: false, error: 'Failed to update student' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const existing = await db.student.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })
    await db.student.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete student' }, { status: 500 })
  }
}
`;

fs.writeFileSync(adminIdApiPath, adminIdApiNew, 'utf8');
console.log('✅ 3/4 Updated: src/app/api/admin/students/[id]/route.ts');

// ==========================================
// 4. UPDATE: src/app/dashboard/admin/siswa/page.tsx
//    - Ubah parent dari dropdown jadi input manual
// ==========================================
const adminPagePath = path.join(BASE, 'src/app/dashboard/admin/siswa/page.tsx');
let adminPage = fs.readFileSync(adminPagePath, 'utf8');

// Hapus interface Parent
adminPage = adminPage.replace(/interface Parent \{[\s\S]*?\}\n\n/, '');

// Hapus parentList state
adminPage = adminPage.replace(/const \[parentList, setParentList\] = useState<Parent\[\]>\(\[\]\)\n/, '');

// Hapus fetchParentList function
adminPage = adminPage.replace(/  const fetchParentList = async \(\) => \{[\s\S]*?\}\n\n/, '');

// Hapus fetchParentList() dari useEffect
adminPage = adminPage.replace(/    fetchParentList\(\)\n/, '');

// Ubah parentId jadi parentName di formData
adminPage = adminPage.replace(/parentId: ""/g, 'parentName: ""');

// Ubah handleAddSiswa
adminPage = adminPage.replace(
  /parentId: siswa\.parentId/,
  'parentName: siswa.parent?.name || ""'
);

// Ubah Select dropdown parent jadi Input manual
const parentDropdownOld = `              <div className="space-y-2">
                  <Label htmlFor="parentId">Orang Tua *</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih orang tua" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentList.map(parent => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>`;

const parentInputNew = `              <div className="space-y-2">
                  <Label htmlFor="parentName">Nama Orang Tua *</Label>
                  <div className="flex">
                    <Baby className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="parentName"
                      placeholder="Ketik nama orang tua..."
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>`;

adminPage = adminPage.replace(parentDropdownOld, parentInputNew);

fs.writeFileSync(adminPagePath, adminPage, 'utf8');
console.log('✅ 4/5 Updated: src/app/dashboard/admin/siswa/page.tsx (parent dropdown → input manual)');

// ==========================================
// 5. UPDATE: src/app/dashboard/guru/siswa/page.tsx
//    - Tambah tombol Tambah Siswa + Edit + Status
// ==========================================
const guruPagePath = path.join(BASE, 'src/app/dashboard/guru/siswa/page.tsx');
let guruPage = fs.readFileSync(guruPagePath, 'utf8');

// Tambah imports yang diperlukan
if (!guruPage.includes('from "@/components/ui/label"')) {
  guruPage = guruPage.replace(
    'import { ScrollArea } from "@/components/ui/scroll-area"',
    'import { ScrollArea } from "@/components/ui/scroll-area"\nimport { Label } from "@/components/ui/label"\nimport { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"\nimport { useToast } from "@/hooks/use-toast"'
  );
}

// Tambah DialogDescription dan DialogFooter ke import Dialog
if (!guruPage.includes('DialogDescription')) {
  guruPage = guruPage.replace(
    'import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"',
    'import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"'
  );
}

// Tambah Baby, Edit, Plus ke lucide-react imports
if (!guruPage.includes('Baby, Edit') && !guruPage.includes('Edit, Baby')) {
  // Tambah Plus jika belum ada
  if (!guruPage.includes('Plus')) {
    guruPage = guruPage.replace(
      /from "lucide-react"/,
      'Plus, Edit, Baby, MapPin from "lucide-react"'
    );
  } else {
    guruPage = guruPage.replace(
      'Plus,',
      'Plus, Edit, Baby,'
    );
  }
} else if (!guruPage.includes('Plus')) {
  guruPage = guruPage.replace(
    'from "lucide-react"',
    'Plus, Edit, Baby, MapPin from "lucide-react"'
  );
}

// Tambah MapPin jika belum ada
if (!guruPage.includes('MapPin')) {
  guruPage = guruPage.replace(
    /from "lucide-react"/,
    'MapPin from "lucide-react"'
  );
}

// Tambah state dan handler setelah baris "const [selectedStudent..."
const stateCode = `
  // Add/Edit dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [classList, setClassList] = useState<Array<{ id: string; name: string; ageGroup: string }>>([])
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    nis: "", name: "", birthDate: "", gender: "Laki-laki",
    address: "", parentName: "", classId: "", status: "aktif"
  })
  const { toast } = useToast()`;

if (!guruPage.includes('dialogOpen')) {
  guruPage = guruPage.replace(
    'const [selectedStudent, setSelectedStudent]',
    stateCode + '\n\n  const [selectedStudent, setSelectedStudent]'
  );
}

// Tambah fungsi fetchClassList
const fetchClassListCode = `
  // Fetch class list for the form dropdown
  const fetchClassList = async () => {
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      if (userId) {
        const response = await fetch(\`/api/classes/teacher?userId=\${userId}\`)
        const data = await response.json()
        if (data.success && data.teacherClasses) {
          setClassList(data.teacherClasses.map((c: any) => ({ id: c.id, name: c.name, ageGroup: c.ageGroup })))
        }
      }
    } catch (error) { console.error('Error fetching classes:', error) }
  }
`;

if (!guruPage.includes('fetchClassList')) {
  guruPage = guruPage.replace(
    '  useEffect(() => {',
    fetchClassListCode + '\n  useEffect(() => {'
  );
  // Tambah fetchClassList() di dalam useEffect
  guruPage = guruPage.replace(
    'fetchStudents()\n    fetchTeacherClasses()',
    'fetchStudents()\n    fetchTeacherClasses()\n    fetchClassList()'
  );
}

// Tambah handler functions sebelum parseJSON
const handlerCode = `
  const handleAddSiswa = () => {
    setEditingStudent(null)
    setFormData({ nis: "", name: "", birthDate: "", gender: "Laki-laki", address: "", parentName: "", classId: "", status: "aktif" })
    setDialogOpen(true)
  }

  const handleEditSiswa = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      nis: student.nis, name: student.name, birthDate: student.birthDate, gender: student.gender,
      address: student.address || "", parentName: student.parent?.fatherName || student.parent?.motherName || "",
      classId: student.class?.id || "", status: student.status || "aktif"
    })
    setDialogOpen(true)
  }

  const handleSubmitSiswa = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const url = '/api/guru/students'
      const method = editingStudent ? 'PATCH' : 'POST'
      const body = editingStudent ? { ...formData, id: editingStudent.id } : formData
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await response.json()
      if (data.success) {
        toast({ title: editingStudent ? "Berhasil" : "Berhasil", description: editingStudent ? "Data siswa diperbaharui" : "Siswa baru berhasil ditambahkan" })
        setDialogOpen(false)
        fetchStudents()
      } else { throw new Error(data.error || 'Gagal menyimpan data') }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal menyimpan data" })
    } finally { setSubmitting(false) }
  }

`;

if (!guruPage.includes('handleAddSiswa')) {
  guruPage = guruPage.replace(
    '  // Helper: Parse JSON',
    handlerCode + '  // Helper: Parse JSON'
  );
}

// Tambah tombol Tambah Siswa di header
if (!guruPage.includes('Tambah Siswa')) {
  guruPage = guruPage.replace(
    '<Button onClick={fetchStudents}>',
    '<Button onClick={handleAddSiswa}><Plus className="mr-2 h-4 w-4" />Tambah Siswa</Button>\n            <Button onClick={fetchStudents}>'
  );
}

// Ganti tombol Detail jadi Edit
guruPage = guruPage.replace(
  '<Button variant="ghost" size="sm">Detail</Button>',
  '<Button variant="ghost" size="sm" onClick={() => handleEditSiswa(student)}><Edit className="mr-1 h-4 w-4" />Edit</Button>'
);

// Tambah Dialog form setelah Card penutup tabel dan sebelum Fitur Tambahan
const dialogForm = `
        {/* Dialog Tambah/Edit Siswa */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}</DialogTitle>
              <DialogDescription>{editingStudent ? "Perbarui informasi siswa" : "Isi form di bawah untuk menambah siswa baru"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitSiswa}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <div className="flex">
                    <Baby className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-l-none" required />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nis">NIS *</Label>
                    <Input id="nis" value={formData.nis} onChange={(e) => setFormData({ ...formData, nis: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Jenis Kelamin *</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Tanggal Lahir *</Label>
                  <div className="flex">
                    <Calendar className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="rounded-l-none" required />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Nama Orang Tua *</Label>
                    <div className="flex">
                      <Baby className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                      <Input id="parentName" placeholder="Ketik nama orang tua..." value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} className="rounded-l-none" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classId">Kelas</Label>
                    <Select value={formData.classId || "none"} onValueChange={(value) => setFormData({ ...formData, classId: value === "none" ? "" : value })}>
                      <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Belum ada kelas</SelectItem>
                        {classList.map(cls => (<SelectItem key={cls.id} value={cls.id}>{cls.name} ({cls.ageGroup})</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="keluar">Keluar</SelectItem>
                        <SelectItem value="lulus">Lulus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <div className="flex">
                    <MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="rounded-l-none" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                <Button type="submit" disabled={submitting}>{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingStudent ? "Simpan Perubahan" : "Tambah"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>`;

if (!guruPage.includes('Dialog Tambah/Edit Siswa')) {
  // Cari pola penutup Card tabel lalu Fitur Tambahan
  guruPage = guruPage.replace(
    '        {/* Fitur Tambahan */}',
    dialogForm + '\n\n        {/* Fitur Tambahan */}'
  );
}

fs.writeFileSync(guruPagePath, guruPage, 'utf8');
console.log('✅ 5/5 Updated: src/app/dashboard/guru/siswa/page.tsx (Tambah Siswa + Edit + Status)');

console.log('\n========================================');
console.log('SELESAI! Semua 5 file berhasil diubah.');
console.log('Jalankan: npm run dev atau bun run dev');
console.log('Lalu push: git add . ; git commit -m "tambah edit siswa guru + status + parent manual" ; git push origin main');
console.log('========================================');
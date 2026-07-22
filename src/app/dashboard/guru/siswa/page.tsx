"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Baby, Search, User, Phone, Mail, MapPin, Calendar, Heart, Syringe, History, Loader2, X, ArrowRight, CheckCircle, AlertCircle, Eye, Ear, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

interface Student {
  id: string
  name: string
  nis: string
  birthDate: string
  gender: string
  address: string | null
  status: string
  photo: string | null
  class: {
    id: string
    name: string
    ageGroup: string
  } | null
  classHistory: string | null
  healthData: any
  immunization: any
  parent: {
    fatherName: string | null
    fatherOccupation: string | null
    fatherPhone: string | null
    fatherEmail: string | null
    motherName: string | null
    motherOccupation: string | null
    motherPhone: string | null
    motherEmail: string | null
    address: string | null
  } | null
}

export default function GuruSiswaPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [teacherClasses, setTeacherClasses] = useState<string[]>([])

  // Modal states
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showHealthModal, setShowHealthModal] = useState(false)
  const [showImmunizationModal, setShowImmunizationModal] = useState(false)
  
  // Add/Edit dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [classList, setClassList] = useState<Array<{ id: string; name: string; ageGroup: string }>>([])
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    nis: "", name: "", birthDate: "", gender: "Laki-laki",
    address: "", parentName: "", classId: "", status: "aktif",
    fatherName: "", fatherOccupation: "", fatherPhone: "", fatherEmail: "",
    motherName: "", motherOccupation: "", motherPhone: "", motherEmail: "",
    parentAddress: ""
  })
  const { toast } = useToast()

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true)
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

      let url = '/api/students'
      if (userId) {
        url += `?teacherId=${userId}`
      }

      const response = await fetch(url)
      const data = await response.json()
      setStudents(data.students || [])
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch teacher's classes
  const fetchTeacherClasses = async () => {
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      if (userId) {
        const response = await fetch(`/api/classes/teacher?userId=${userId}`)
        const data = await response.json()
        if (data.success && data.teacherClasses) {
          const classNames = data.teacherClasses.map((c: any) => `Kelas ${c.name} (${c.ageGroup})`)
          setTeacherClasses(classNames)
        }
      }
    } catch (error) {
      console.error('Error fetching teacher classes:', error)
    }
  }


  const fetchClassList = async () => {
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      if (userId) {
        const response = await fetch(`/api/classes/teacher?userId=${userId}`)
        const data = await response.json()
        if (data.success && data.teacherClasses) {
          setClassList(data.teacherClasses)
        }
      }
    } catch (error) {
      console.error('Error fetching class list:', error)
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchTeacherClasses()
    fetchClassList()
  }, [])

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.nis.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handler untuk membuka modal riwayat kelas
  const handleShowHistory = () => {
    setShowHistoryModal(true)
  }

  // Handler untuk membuka modal data kesehatan
  const handleShowHealth = () => {
    setShowHealthModal(true)
  }

  // Handler untuk membuka modal data imunisasi
  const handleShowImmunization = () => {
    setShowImmunizationModal(true)
  }


  const handleAddSiswa = () => {
    setEditingStudent(null)
    setFormData({
      nis: "", name: "", birthDate: "", gender: "Laki-laki",
      address: "", parentName: "", classId: "", status: "aktif",
      fatherName: "", fatherOccupation: "", fatherPhone: "", fatherEmail: "",
      motherName: "", motherOccupation: "", motherPhone: "", motherEmail: "",
      parentAddress: ""
    })
    setDialogOpen(true)
  }

  const handleEditSiswa = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      nis: student.nis, name: student.name, birthDate: student.birthDate, gender: student.gender,
      address: student.address || "",
      parentName: student.parent?.fatherName || student.parent?.motherName || "",
      classId: student.class?.id || "", status: student.status || "aktif",
      fatherName: student.parent?.fatherName || "",
      fatherOccupation: student.parent?.fatherOccupation || "",
      fatherPhone: student.parent?.fatherPhone || "",
      fatherEmail: student.parent?.fatherEmail || "",
      motherName: student.parent?.motherName || "",
      motherOccupation: student.parent?.motherOccupation || "",
      motherPhone: student.parent?.motherPhone || "",
      motherEmail: student.parent?.motherEmail || "",
      parentAddress: student.parent?.address || ""
    })
    setDialogOpen(true)
  }

  const handleSubmitSiswa = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const url = '/api/guru/students'
      const method = editingStudent ? 'PATCH' : 'POST'
      let body: any = editingStudent ? { ...formData, id: editingStudent.id } : formData
      // When editing, map parentName to fatherName for the API
      if (editingStudent && formData.parentName) {
        body.fatherName = formData.fatherName || formData.parentName
      }
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await response.json()
      if (data.success) {
        toast({ title: editingStudent ? "Berhasil" : "Berhasil", description: editingStudent ? "Data siswa & orang tua diperbaharui" : "Siswa baru berhasil ditambahkan" })
        setDialogOpen(false)
        fetchStudents()
      } else { throw new Error(data.error || 'Gagal menyimpan data') }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal menyimpan data" })
    } finally { setSubmitting(false) }
  }

  // Helper: Parse JSON string (safely handles already parsed objects)
  const parseJSON = (data: any) => {
    if (!data) return null
    if (typeof data !== 'string') return data
    try {
      return JSON.parse(data)
    } catch (e) {
      return null
    }
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Siswa</h1>
            <p className="text-muted-foreground mt-2">
              Data siswa dari kelas yang Anda ampu
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari siswa..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleAddSiswa}><Plus className="mr-2 h-4 w-4" />Tambah Siswa</Button>
            <Button onClick={fetchStudents}>
              <Loader2 className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistik Siswa */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Baby className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Di kelas Anda</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Siswa Aktif</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{students.filter(s => s.status === 'aktif').length}</div>
              <p className="text-xs text-muted-foreground mt-1">Status aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Laki-laki</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{students.filter(s => s.gender === 'Laki-laki').length}</div>
              <p className="text-xs text-muted-foreground mt-1">Siswa laki-laki</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perempuan</CardTitle>
              <User className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{students.filter(s => s.gender === 'Perempuan').length}</div>
              <p className="text-xs text-muted-foreground mt-1">Siswa perempuan</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabel Siswa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Daftar Siswa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Belum ada siswa di kelas yang Anda ampu</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Foto</TableHead>
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>NIS</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Jenis Kelamin</TableHead>
                      <TableHead>Tanggal Lahir</TableHead>
                      <TableHead>Nama Orang Tua</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.nis}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {student.class?.name || '-'} ({student.class?.ageGroup || '-'})
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.gender === "Laki-laki" ? "default" : "secondary"}>
                            {student.gender}
                          </Badge>
                        </TableCell>
                        <TableCell>{student.birthDate}</TableCell>
                        <TableCell>
                          {student.parent?.fatherName || student.parent?.motherName || '-'}
                        </TableCell>
                        <TableCell>
                          {student.parent?.fatherPhone || student.parent?.motherPhone || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.status === "aktif" ? "default" : "secondary"}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)}><Eye className="mr-1 h-4 w-4" />Detail</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditSiswa(student)}><Edit className="mr-1 h-4 w-4" />Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>


        {/* Dialog Tambah/Edit Siswa */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}</DialogTitle>
              <DialogDescription>{editingStudent ? "Perbarui informasi siswa dan data orang tua" : "Isi form di bawah untuk menambah siswa baru"}</DialogDescription>
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

                {/* Data Orang Tua Section — hanya tampil saat edit */}
                {editingStudent && (
                  <>
                    <div className="col-span-2 border-t pt-4 mt-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <User className="h-4 w-4" /> Data Orang Tua
                      </h4>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fatherName">Nama Ayah</Label>
                        <Input id="fatherName" placeholder="Nama ayah" value={formData.fatherName} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fatherOccupation">Pekerjaan Ayah</Label>
                        <Input id="fatherOccupation" placeholder="Pekerjaan ayah" value={formData.fatherOccupation} onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fatherPhone">No. HP Ayah</Label>
                        <div className="flex">
                          <Phone className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                          <Input id="fatherPhone" placeholder="No. HP ayah" value={formData.fatherPhone} onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })} className="rounded-l-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fatherEmail">Email Ayah</Label>
                        <div className="flex">
                          <Mail className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                          <Input id="fatherEmail" type="email" placeholder="Email ayah" value={formData.fatherEmail} onChange={(e) => setFormData({ ...formData, fatherEmail: e.target.value })} className="rounded-l-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motherName">Nama Ibu</Label>
                        <Input id="motherName" placeholder="Nama ibu" value={formData.motherName} onChange={(e) => setFormData({ ...formData, motherName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motherOccupation">Pekerjaan Ibu</Label>
                        <Input id="motherOccupation" placeholder="Pekerjaan ibu" value={formData.motherOccupation} onChange={(e) => setFormData({ ...formData, motherOccupation: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motherPhone">No. HP Ibu</Label>
                        <div className="flex">
                          <Phone className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                          <Input id="motherPhone" placeholder="No. HP ibu" value={formData.motherPhone} onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })} className="rounded-l-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motherEmail">Email Ibu</Label>
                        <div className="flex">
                          <Mail className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                          <Input id="motherEmail" type="email" placeholder="Email ibu" value={formData.motherEmail} onChange={(e) => setFormData({ ...formData, motherEmail: e.target.value })} className="rounded-l-none" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentAddress">Alamat Orang Tua</Label>
                      <div className="flex">
                        <MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                        <Input id="parentAddress" placeholder="Alamat orang tua" value={formData.parentAddress} onChange={(e) => setFormData({ ...formData, parentAddress: e.target.value })} className="rounded-l-none" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                <Button type="submit" disabled={submitting}>{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingStudent ? "Simpan Perubahan" : "Tambah"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Fitur Tambahan */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleShowHistory}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-5 w-5 text-orange-500" />
                Riwayat Kelas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Lihat riwayat perpindahan kelas siswa</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleShowHealth}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-5 w-5 text-red-500" />
                Data Kesehatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Lihat data kesehatan seluruh siswa</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleShowImmunization}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Syringe className="h-5 w-5 text-blue-500" />
                Data Imunisasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Lihat jadwal dan riwayat imunisasi siswa</p>
            </CardContent>
          </Card>
        </div>

        {/* Modal Riwayat Kelas */}
        <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-orange-500" />
                Riwayat Kelas Siswa
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-4 pt-4">
                {students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Tidak ada data siswa</p>
                  </div>
                ) : (
                  students.map((student) => {
                    const classHistory = parseJSON(student.classHistory)
                    return (
                      <div key={student.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span className="font-semibold">{student.name}</span>
                          <Badge variant="secondary">{student.nis}</Badge>
                        </div>
                        {classHistory && Array.isArray(classHistory) && classHistory.length > 0 ? (
                          <div className="space-y-2 ml-7 text-sm">
                            {classHistory.map((history: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
                                <ArrowRight className="h-4 w-4 mt-0.5 text-orange-500" />
                                <div className="flex-1">
                                  <span className="font-medium">{history.className || history.name || '-'}</span>
                                  <span className="text-muted-foreground"> — {history.date || history.tanggal || '-'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm ml-7">Tidak ada riwayat perpindahan kelas</p>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Modal Data Kesehatan */}
        <Dialog open={showHealthModal} onOpenChange={setShowHealthModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Data Kesehatan Siswa
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-4 pt-4">
                {students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Tidak ada data siswa</p>
                  </div>
                ) : (
                  students.map((student) => {
                    const health = parseJSON(student.healthData)
                    return (
                      <div key={student.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span className="font-semibold">{student.name}</span>
                          <Badge variant="secondary">{student.nis}</Badge>
                        </div>
                        {health ? (
                          <div className="space-y-2 ml-7 text-sm">
                            {health.bloodType && (
                              <div className="flex items-start gap-2">
                                <span className="font-medium w-32">Golongan Darah:</span>
                                <span>{health.bloodType}</span>
                              </div>
                            )}
                            {health.height && (
                              <div className="flex items-start gap-2">
                                <span className="font-medium w-32">Tinggi Badan:</span>
                                <span>{health.height} cm</span>
                              </div>
                            )}
                            {health.weight && (
                              <div className="flex items-start gap-2">
                                <span className="font-medium w-32">Berat Badan:</span>
                                <span>{health.weight} kg</span>
                              </div>
                            )}
                            {health.headCircumference && (
                              <div className="flex items-start gap-2">
                                <span className="font-medium w-32">Lingkar Kepala:</span>
                                <span>{health.headCircumference} cm</span>
                              </div>
                            )}
                            {health.waistCircumference && (
                              <div className="flex items-start gap-2">
                                <span className="font-medium w-32">Lingkar Pinggang:</span>
                                <span>{health.waistCircumference} cm</span>
                              </div>
                            )}
                            {health.eyesFunction && (
                              <div className="flex items-start gap-2">
                                <Eye className="h-4 w-4 mt-0.5" />
                                <span className="font-medium w-32">Fungsi Mata:</span>
                                <span>{health.eyesFunction}</span>
                              </div>
                            )}
                            {health.earsFunction && (
                              <div className="flex items-start gap-2">
                                <Ear className="h-4 w-4 mt-0.5" />
                                <span className="font-medium w-32">Fungsi Telinga:</span>
                                <span>{health.earsFunction}</span>
                              </div>
                            )}
                            {health.allergies && (
                              <div className="flex items-start gap-2">
                                <span className="font-medium w-32">Alergi:</span>
                                <span>{health.allergies}</span>
                              </div>
                            )}
                            {health.diseases && (
                              <div className="flex items-start gap-2">
                                <span className="font-medium w-32">Riwayat Penyakit:</span>
                                <span>{health.diseases}</span>
                              </div>
                            )}
                            {health.medicalNotes && (
                              <div className="flex items-start gap-2">
                                <span className="font-medium w-32">Catatan Medis:</span>
                                <span>{health.medicalNotes}</span>
                              </div>
                            )}
                            {(!health.bloodType && !health.height && !health.weight && !health.headCircumference && !health.waistCircumference && !health.eyesFunction && !health.earsFunction && !health.allergies && !health.diseases && !health.medicalNotes) && (
                              <p className="text-muted-foreground">Tidak ada data kesehatan</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm ml-7">Tidak ada data kesehatan</p>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Modal Data Imunisasi */}
        <Dialog open={showImmunizationModal} onOpenChange={setShowImmunizationModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Syringe className="h-5 w-5 text-blue-500" />
                Jadwal dan Riwayat Imunisasi Siswa
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-4 pt-4">
                {students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Syringe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Tidak ada data siswa</p>
                  </div>
                ) : (
                  students.map((student) => {
                    const immunizations = student.immunization
                    return (
                      <div key={student.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span className="font-semibold">{student.name}</span>
                          <Badge variant="secondary">{student.nis}</Badge>
                        </div>
                        {immunizations && Array.isArray(immunizations) && immunizations.length > 0 ? (
                          <div className="space-y-2 ml-7 text-sm">
                            {immunizations.map((imm: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
                                <Syringe className="h-4 w-4 mt-0.5 text-blue-500" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{imm.vaccine || imm.vaksin || imm.name || 'Vaksin tidak diketahui'}</span>
                                    {imm.completed ? (
                                      <Badge variant="default" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" />Selesai</Badge>
                                    ) : imm.status === 'completed' || imm.status === 'selesai' ? (
                                      <Badge variant="default" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" />Selesai</Badge>
                                    ) : (
                                      <Badge variant="secondary" className="text-xs"><AlertCircle className="h-3 w-3 mr-1" />{imm.status || 'Terjadwal'}</Badge>
                                    )}
                                  </div>
                                  <p className="text-muted-foreground text-xs mt-1">
                                    {imm.date || imm.tanggal || imm.scheduledDate || 'Tanggal belum ditentukan'}
                                  </p>
                                  {imm.dose && <p className="text-muted-foreground text-xs">Dosis: {imm.dose}</p>}
                                  {imm.notes && <p className="text-muted-foreground text-xs mt-1">{imm.notes}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm ml-7">Tidak ada data imunisasi</p>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Detail Siswa Dialog */}
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Detail Siswa
              </DialogTitle>
              <DialogDescription>Informasi lengkap data siswa dan orang tua</DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                    <Badge variant={selectedStudent.status === 'aktif' ? 'default' : 'secondary'}>
                      {selectedStudent.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">NIS</span>
                    <span className="font-medium">{selectedStudent.nis}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">Tanggal Lahir</span>
                    <span className="font-medium">{selectedStudent.birthDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">Jenis Kelamin</span>
                    <span className="font-medium">{selectedStudent.gender}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Baby className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">Kelas</span>
                    <span className="font-medium">{selectedStudent.class?.name ? `Kelas ${selectedStudent.class.name} (${selectedStudent.class.ageGroup})` : 'Tanpa Kelas'}</span>
                  </div>
                  {selectedStudent.address && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground w-28">Alamat</span>
                      <span className="font-medium">{selectedStudent.address}</span>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-semibold">Data Ayah</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Nama</span>
                      <span className="font-medium">{selectedStudent.parent?.fatherName || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Pekerjaan</span>
                      <span className="font-medium">{selectedStudent.parent?.fatherOccupation || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">No. HP</span>
                      {selectedStudent.parent?.fatherPhone ? (
                        <a href={`tel:${selectedStudent.parent.fatherPhone}`} className="font-medium text-primary hover:underline">{selectedStudent.parent.fatherPhone}</a>
                      ) : <span className="font-medium">-</span>}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Email</span>
                      {selectedStudent.parent?.fatherEmail ? (
                        <a href={`mailto:${selectedStudent.parent.fatherEmail}`} className="font-medium text-primary hover:underline break-all">{selectedStudent.parent.fatherEmail}</a>
                      ) : <span className="font-medium">-</span>}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-semibold">Data Ibu</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Nama</span>
                      <span className="font-medium">{selectedStudent.parent?.motherName || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Pekerjaan</span>
                      <span className="font-medium">{selectedStudent.parent?.motherOccupation || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">No. HP</span>
                      {selectedStudent.parent?.motherPhone ? (
                        <a href={`tel:${selectedStudent.parent.motherPhone}`} className="font-medium text-primary hover:underline">{selectedStudent.parent.motherPhone}</a>
                      ) : <span className="font-medium">-</span>}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Email</span>
                      {selectedStudent.parent?.motherEmail ? (
                        <a href={`mailto:${selectedStudent.parent.motherEmail}`} className="font-medium text-primary hover:underline break-all">{selectedStudent.parent.motherEmail}</a>
                      ) : <span className="font-medium">-</span>}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-semibold">Alamat Orang Tua</h4>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="font-medium">{selectedStudent.parent?.address || '-'}</span>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setSelectedStudent(null)} className="w-full">Tutup</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
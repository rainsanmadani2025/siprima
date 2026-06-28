"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, User, Phone, Mail, MapPin, Calendar, Heart, Syringe, History, Loader2, X, ArrowRight, CheckCircle, AlertCircle, Eye, Ear, Baby } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
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
    motherName: string | null
    fatherPhone: string | null
    motherPhone: string | null
  }
}

interface Parent { id: string; name: string }
interface Class { id: string; name: string; ageGroup: string }

export default function GuruSiswaPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [teacherClasses, setTeacherClasses] = useState<string[]>([])
  const [editingStudent, setEditingStudent] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [parentList, setParentList] = useState<Parent[]>([])
  const [classList, setClassList] = useState<Class[]>([])
  const [formData, setFormData] = useState({ nis: "", name: "", birthDate: "", gender: "Laki-laki", address: "", parentId: "", classId: "" })
  const { toast } = useToast()

  // Modal states
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showHealthModal, setShowHealthModal] = useState(false)
  const [showImmunizationModal, setShowImmunizationModal] = useState(false)
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
          setTeacherClasses(classNames); setClassList(data.teacherClasses.map(function(c) { return { id: c.id, name: c.name, ageGroup: c.ageGroup } }))
        }
      }
    } catch (error) {
      console.error('Error fetching teacher classes:', error)
    }
  }

  useEffect(() => {
    fetchStudents(); fetchTeacherClasses();
  }, [])

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.nis.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate statistics
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.status === 'aktif').length
  const maleStudents = students.filter(s => s.gender === 'Laki-laki').length
  const femaleStudents = students.filter(s => s.gender === 'Perempuan').length

  // Handler untuk membuka modal riwayat kelas
  const handleShowHistory = () => {
    setShowHistoryModal(true)
  }

  // Handler untuk membuka modal data kesehatan
  const handleShowHealth = () => {
    setShowHealthModal(true)
  }

  // Handler untuk membuka modal data imunisasi
  var handleAddSiswa = function() { setEditingStudent(null); setFormData({ nis: "", name: "", birthDate: "", gender: "Laki-laki", address: "", parentId: "", classId: "" }); setDialogOpen(true) };
  var handleEditSiswa = function(student) { setEditingStudent(student); setFormData({ nis: student.nis, name: student.name, birthDate: student.birthDate, gender: student.gender, address: student.address || "", parentId: student.parent && (student.parent.fatherName || student.parent.motherName) || "", classId: student.class ? student.class.id : "" }); setDialogOpen(true) };
  var handleSubmitSiswa = async function(e) { e.preventDefault(); setSubmitting(true); try { var url = editingStudent ? "/api/guru/students" : "/api/guru/students"; var method = editingStudent ? "PATCH" : "POST"; var bodyData = editingStudent ? Object.assign({}, formData, { id: editingStudent.id, parentId: undefined }) : formData; var r = await fetch(url, { method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyData) }); var d = await r.json(); if (d.success) { toast({ title: "Berhasil", description: editingStudent ? "Data siswa diperbarui" : "Siswa baru berhasil ditambahkan" }); setDialogOpen(false); fetchStudents() } else { throw new Error(d.error || "Gagal") } } catch(err) { toast({ variant: "destructive", title: "Error", description: err.message || "Gagal menyimpan data" }) } finally { setSubmitting(false) } };
  const handleShowImmunization = () => {
    setShowImmunizationModal(true)
  }

  // Helper: Parse JSON string (safely handles already parsed objects)
  const parseJSON = (data: any) => {
    if (!data) return null
    // If it's already an object (not a string), return as-is
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
            <Button onClick={handleAddSiswa}><Plus className="mr-2 h-4 w-4" />Tambah Siswa</Button><Button onClick={fetchStudents}>
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
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {teacherClasses.length > 0 ? teacherClasses.join(', ') : 'Semua kelas'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Siswa Aktif</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}% siswa aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Laki-laki</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{maleStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalStudents > 0 ? Math.round((maleStudents / totalStudents) * 100) : 0}% dari total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perempuan</CardTitle>
              <User className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{femaleStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalStudents > 0 ? Math.round((femaleStudents / totalStudents) * 100) : 0}% dari total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabel Data Siswa */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Siswa Kelas Anda</CardTitle>
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
                          {student.parent.fatherName || student.parent.motherName || '-'}
                        </TableCell>
                        <TableCell>
                          {student.parent.fatherPhone || student.parent.motherPhone || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.status === "aktif" ? "default" : "secondary"}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={function(){handleEditSiswa(student)}}>Edit</Button>
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

        {/* Fitur Tambahan */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Riwayat Kelas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lihat riwayat perpindahan kelas siswa
              </p>
              <Button variant="outline" className="w-full mt-4" onClick={handleShowHistory}>
                Lihat Riwayat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Data Kesehatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Data kesehatan dan riwayat penyakit siswa
              </p>
              <Button variant="outline" className="w-full mt-4" onClick={handleShowHealth}>
                Lihat Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="h-5 w-5" />
                Data Imunisasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Jadwal dan riwayat imunisasi siswa
              </p>
              <Button variant="outline" className="w-full mt-4" onClick={handleShowImmunization}>
                Lihat Data
              </Button>
            </CardContent>
          </Card>
        </div>

                {/* Dialog Tambah Siswa */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}</DialogTitle>
              <DialogDescription>{editingStudent ? "Perbarui data siswa" : "Isi form di bawah untuk menambah siswa baru"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitSiswa}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <div className="flex">
                    <Baby className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input id="name" value={formData.name} onChange={function(e){setFormData({...formData, name: e.target.value})}} className="rounded-l-none" required />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nis">NIS *</Label>
                    <Input id="nis" value={formData.nis} onChange={function(e){setFormData({...formData, nis: e.target.value})}} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Jenis Kelamin *</Label>
                    <Select value={formData.gender} onValueChange={function(v){setFormData({...formData, gender: v})}}>
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
                    <Input id="birthDate" type="date" value={formData.birthDate} onChange={function(e){setFormData({...formData, birthDate: e.target.value})}} className="rounded-l-none" required />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Nama Orang Tua *</Label>
                    <Input id="parentName" placeholder="Ketik nama ayah/ibu" value={formData.parentId} onChange={function(e){setFormData({...formData, parentId: e.target.value})}} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classId">Kelas</Label>
                    <Select value={formData.classId || "none"} onValueChange={function(v){setFormData({...formData, classId: v === "none" ? "" : v})}}>
                      <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Belum ada kelas</SelectItem>
                        {classList.map(function(cls){return <SelectItem key={cls.id} value={cls.id}>{cls.name} ({cls.ageGroup})</SelectItem>})}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <div className="flex">
                    <MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input id="address" value={formData.address} onChange={function(e){setFormData({...formData, address: e.target.value})}} className="rounded-l-none" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={function(){setDialogOpen(false)}}>Batal</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingStudent ? "Simpan" : "Tambah"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

{/* Modal Riwayat Kelas */}
        <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Riwayat Perpindahan Kelas Siswa
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
                    const history = student.classHistory
                    return (
                      <div key={student.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span className="font-semibold">{student.name}</span>
                          <Badge variant="secondary">{student.nis}</Badge>
                          <Badge>{student.class?.name || '-'} ({student.class?.ageGroup || '-'})</Badge>
                        </div>
                        {history && Array.isArray(history) && history.length > 0 ? (
                          <div className="space-y-2 ml-7">
                            {history.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <div className="flex flex-col items-center">
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                  {idx < history.length - 1 && <div className="w-0.5 h-8 bg-border" />}
                                </div>
                                <div>
                                  <p className="font-medium">{item.className || item.kelas || 'Kelas tidak diketahui'}</p>
                                  <p className="text-muted-foreground text-xs">{item.date || item.tanggal || '-'}</p>
                                  {item.notes && <p className="text-muted-foreground text-xs mt-1">{item.notes}</p>}
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
                    const health = student.healthData
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
                              <div className="flex items-center gap-2">
                                <span className="font-medium w-32">Golongan Darah:</span>
                                <Badge variant="outline">{health.bloodType}</Badge>
                              </div>
                            )}
                            {health.height && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium w-32">Tinggi Badan:</span>
                                <span>{health.height} cm</span>
                              </div>
                            )}
                            {health.weight && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium w-32">Berat Badan:</span>
                                <span>{health.weight} kg</span>
                              </div>
                            )}
                            {health.headCircumference && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium w-32">Lingkar Kepala:</span>
                                <span>{health.headCircumference} cm</span>
                              </div>
                            )}
                            {health.waistCircumference && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium w-32">Lingkar Perut:</span>
                                <span>{health.waistCircumference} cm</span>
                              </div>
                            )}
                            {health.eyesFunction && health.eyesFunction !== "-" && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium w-32 flex items-center gap-2"><Eye className="h-3 w-3" /> Fungsi Mata:</span>
                                <Badge variant={health.eyesFunction === 'normal' ? 'default' : 'secondary'}>
                                  {health.eyesFunction === 'normal' ? 'Normal' :
                                   health.eyesFunction === 'rabun_jauh' ? 'Rabun Jauh' :
                                   health.eyesFunction === 'rabun_dekat' ? 'Rabun Dekat' :
                                   health.eyesFunction === 'buta_warna' ? 'Buta Warna' :
                                   health.eyesFunction === 'lainnya' ? 'Lainnya' : health.eyesFunction}
                                </Badge>
                              </div>
                            )}
                            {health.earsFunction && health.earsFunction !== "-" && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium w-32 flex items-center gap-2"><Ear className="h-3 w-3" /> Fungsi Telinga:</span>
                                <Badge variant={health.earsFunction === 'normal' ? 'default' : 'secondary'}>
                                  {health.earsFunction === 'normal' ? 'Normal' :
                                   health.earsFunction === 'gangguan_pendengaran' ? 'Gangguan Pendengaran' :
                                   health.earsFunction === 'tuli_sebagian' ? 'Tuli Sebagian' :
                                   health.earsFunction === 'tuli_total' ? 'Tuli Total' :
                                   health.earsFunction === 'lainnya' ? 'Lainnya' : health.earsFunction}
                                </Badge>
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
      </div>
    </DashboardLayout>
  )
}

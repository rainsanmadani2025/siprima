"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Users,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Baby,
  Stethoscope,
  Syringe,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Trash
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Class {
  id: string
  name: string
  ageGroup: string
}

interface Siswa {
  id: string
  name: string
  nis: string
  birthDate: string
  gender: string
  address?: string
  parentId: string
  parent?: Parent
  classId?: string
  class?: Class
  status: string
  createdAt: string
}

export default function AdminSiswaPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([])
    const [classList, setClassList] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [classFilter, setClassFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [healthDialogOpen, setHealthDialogOpen] = useState(false)
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null)
  const [deletingSiswa, setDeletingSiswa] = useState<Siswa | null>(null)
  const [healthSiswa, setHealthSiswa] = useState<Siswa | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nis: "",
    name: "",
    birthDate: "",
    gender: "Laki-laki",
    address: "",
    parentName: "",
    classId: "",
    status: "aktif"
  })

  const [healthFormData, setHealthFormData] = useState({
    bloodType: "",
    height: "",
    weight: "",
    headCircumference: "",
    waistCircumference: "",
    eyesFunction: "",
    earsFunction: "",
    allergies: "",
    diseases: "",
    medicalNotes: ""
  })

  const [immunizations, setImmunizations] = useState<Array<{
    id: string
    vaccine: string
    date: string
    dose: string
    status: "completed" | "scheduled"
    notes: string
  }>>([])

  const [newImmunization, setNewImmunization] = useState({
    vaccine: "",
    date: "",
    dose: "",
    status: "scheduled" as "completed" | "scheduled",
    notes: ""
  })

  useEffect(() => {
    fetchSiswaList()
    fetchClassList()
  }, [statusFilter])

  const fetchSiswaList = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/students')
      const data = await response.json()
      if (data.success) {
        let filtered = data.students
        if (statusFilter !== "all") {
          filtered = filtered.filter((s: Siswa) => s.status === statusFilter)
        }
        setSiswaList(filtered)
      }
    } catch (error) {
      console.error('Error fetching student list:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data siswa"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchClassList = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      if (data.success) {
        setClassList(data.classes)
      }
    } catch (error) {
      console.error('Error fetching class list:', error)
    }
  }

  const handleAddSiswa = () => {
    setEditingSiswa(null)
    setFormData({
      nis: "",
      name: "",
      birthDate: "",
      gender: "Laki-laki",
      address: "",
      parentName: "",
      classId: "",
      status: "aktif"
    })
    setDialogOpen(true)
  }

  const handleEditSiswa = (siswa: Siswa) => {
    setEditingSiswa(siswa)
    setFormData({
      nis: siswa.nis,
      name: siswa.name,
      birthDate: siswa.birthDate,
      gender: siswa.gender,
      address: siswa.address || "",
      parentName: siswa.parent?.name || "",
      classId: siswa.classId || "",
      status: siswa.status
    })
    setDialogOpen(true)
  }

  const handleDeleteSiswa = (siswa: Siswa) => {
    setDeletingSiswa(siswa)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingSiswa
        ? `/api/admin/students/${editingSiswa.id}`
        : '/api/admin/students'

      const method = editingSiswa ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: editingSiswa ? "Berhasil" : "Berhasil",
          description: editingSiswa ? "Data siswa diperbarui" : "Siswa baru ditambahkan"
        })
        setDialogOpen(false)
        fetchSiswaList()
      } else {
        throw new Error(data.error || 'Gagal menyimpan data')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan data"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!deletingSiswa) return

    try {
      const response = await fetch(`/api/admin/students/${deletingSiswa.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Siswa berhasil dihapus"
        })
        setDeleteDialogOpen(false)
        fetchSiswaList()
      } else {
        throw new Error(data.error || 'Gagal menghapus siswa')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menghapus siswa"
      })
    }
  }

  const handleHealthDialog = async (siswa: Siswa) => {
    setHealthSiswa(siswa)
    setHealthDialogOpen(true)

    // Fetch current health and immunization data
    try {
      const response = await fetch(`/api/admin/students/${siswa.id}`)
      const data = await response.json()
      if (data.success && data.student) {
        const student = data.student
        // Set health data
        if (student.healthData) {
          setHealthFormData({
            bloodType: student.healthData.bloodType || "",
            height: student.healthData.height || "",
            weight: student.healthData.weight || "",
            headCircumference: student.healthData.headCircumference || "",
            waistCircumference: student.healthData.waistCircumference || "",
            eyesFunction: student.healthData.eyesFunction || "",
            earsFunction: student.healthData.earsFunction || "",
            allergies: student.healthData.allergies || "",
            diseases: student.healthData.diseases || "",
            medicalNotes: student.healthData.medicalNotes || ""
          })
        } else {
          setHealthFormData({
            bloodType: "",
            height: "",
            weight: "",
            headCircumference: "",
            waistCircumference: "",
            eyesFunction: "",
            earsFunction: "",
            allergies: "",
            diseases: "",
            medicalNotes: ""
          })
        }
        // Set immunization data
        if (student.immunization && Array.isArray(student.immunization)) {
          setImmunizations(student.immunization.map((imm: any, idx: number) => ({
            id: imm.id || `imm-${idx}`,
            vaccine: imm.vaccine || imm.vaksin || "",
            date: imm.date || imm.tanggal || "",
            dose: imm.dose || "",
            status: imm.status === "completed" || imm.status === "selesai" || imm.completed ? "completed" : "scheduled",
            notes: imm.notes || ""
          })))
        } else {
          setImmunizations([])
        }
      }
    } catch (error) {
      console.error('Error fetching student health data:', error)
    }
  }

  const handleAddImmunization = () => {
    if (!newImmunization.vaccine) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nama vaksin harus diisi"
      })
      return
    }
    setImmunizations([...immunizations, {
      id: `imm-${Date.now()}`,
      ...newImmunization
    }])
    setNewImmunization({
      vaccine: "",
      date: "",
      dose: "",
      status: "scheduled",
      notes: ""
    })
  }

  const handleRemoveImmunization = (id: string) => {
    setImmunizations(immunizations.filter(imm => imm.id !== id))
  }

  const handleSaveHealthData = async () => {
    if (!healthSiswa) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/admin/students/${healthSiswa.id}/health`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          healthData: healthFormData,
          immunization: immunizations
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Data kesehatan dan imunisasi berhasil disimpan"
        })
        setHealthDialogOpen(false)
        fetchSiswaList()
      } else {
        throw new Error(data.error || 'Gagal menyimpan data kesehatan')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan data kesehatan"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredSiswa = siswaList.filter(siswa => {
    // Filter by search term
    const matchesSearch = siswa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         siswa.nis.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by status
    const matchesStatus = statusFilter === "all" || siswa.status === statusFilter

    // Filter by class
    const matchesClass = classFilter === "all" || siswa.classId === classFilter

    return matchesSearch && matchesStatus && matchesClass
  }).sort((a, b) => {
    // Sort by class name (A1, A2, B1, B2, etc.)
    const classCompare = (a.class?.name || '').localeCompare(b.class?.name || '')
    if (classCompare !== 0) return classCompare

    // Then sort by age group (A before B)
    const ageGroupCompare = (a.class?.ageGroup || '').localeCompare(b.class?.ageGroup || '')
    if (ageGroupCompare !== 0) return ageGroupCompare

    // Finally sort by student name
    return a.name.localeCompare(b.name)
  })

  return (
    <DashboardLayout role="admin" userName="Administrator">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pengaturan Data Siswa</h1>
            <p className="text-muted-foreground mt-2">
              Kelola data siswa RA Insan Madani
            </p>
          </div>
          <Button onClick={handleAddSiswa}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Siswa
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau NIS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classList.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.ageGroup})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="keluar">Keluar</SelectItem>
                  <SelectItem value="lulus">Lulus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Daftar Siswa ({filteredSiswa.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : filteredSiswa.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada data siswa
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIS</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Tanggal Lahir</TableHead>
                      <TableHead>Orang Tua</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSiswa.map((siswa) => (
                      <TableRow key={siswa.id}>
                        <TableCell>
                          <Badge
                            variant={
                              siswa.class?.ageGroup === 'A' ? 'default' :
                              siswa.class?.ageGroup === 'B' ? 'secondary' :
                              'outline'
                            }
                            className={
                              siswa.class?.ageGroup === 'A' ? 'bg-green-600 hover:bg-green-700' :
                              siswa.class?.ageGroup === 'B' ? 'bg-blue-600 hover:bg-blue-700' :
                              ''
                            }
                          >
                            {siswa.class?.name || "-"} ({siswa.class?.ageGroup || "-"})
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{siswa.name}</TableCell>
                        <TableCell>{siswa.nis}</TableCell>
                        <TableCell>{siswa.gender}</TableCell>
                        <TableCell>{siswa.birthDate}</TableCell>
                        <TableCell>{siswa.parent?.name || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              siswa.status === "aktif" ? "default" :
                              siswa.status === "keluar" ? "destructive" : "secondary"
                            }
                          >
                            {siswa.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleHealthDialog(siswa)}
                              title="Data Kesehatan & Imunisasi"
                            >
                              <Stethoscope className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSiswa(siswa)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSiswa(siswa)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
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
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSiswa ? "Edit Data Siswa" : "Tambah Siswa Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingSiswa ? "Perbarui informasi siswa" : "Isi form di bawah untuk menambah siswa baru"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <div className="flex">
                  <Baby className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nis">NIS *</Label>
                  <Input
                    id="nis"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    required
                    disabled={!!editingSiswa}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classId">Kelas</Label>
                  <Select
                    value={formData.classId || "none"}
                    onValueChange={(value) => setFormData({ ...formData, classId: value === "none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Belum ada kelas</SelectItem>
                      {classList.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} ({cls.ageGroup})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingSiswa ? "Simpan Perubahan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Siswa?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data siswa "{deletingSiswa?.name}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Data Kesehatan & Imunisasi */}
      <Dialog open={healthDialogOpen} onOpenChange={setHealthDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              Data Kesehatan & Imunisasi
            </DialogTitle>
            <DialogDescription>
              Siswa: <span className="font-semibold">{healthSiswa?.name}</span> ({healthSiswa?.nis})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Data Kesehatan Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-blue-600" />
                Data Kesehatan
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="height">Tinggi Badan (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Contoh: 110"
                    value={healthFormData.height}
                    onChange={(e) => setHealthFormData({ ...healthFormData, height: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Berat Badan (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Contoh: 18"
                    value={healthFormData.weight}
                    onChange={(e) => setHealthFormData({ ...healthFormData, weight: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headCircumference">Lingkar Kepala (LILA) (cm)</Label>
                  <Input
                    id="headCircumference"
                    type="number"
                    placeholder="Contoh: 48"
                    value={healthFormData.headCircumference}
                    onChange={(e) => setHealthFormData({ ...healthFormData, headCircumference: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waistCircumference">Lingkar Perut (LP) (cm)</Label>
                  <Input
                    id="waistCircumference"
                    type="number"
                    placeholder="Contoh: 50"
                    value={healthFormData.waistCircumference}
                    onChange={(e) => setHealthFormData({ ...healthFormData, waistCircumference: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Alergi</Label>
                  <Input
                    id="allergies"
                    placeholder="Contoh: Udang, Kacang"
                    value={healthFormData.allergies}
                    onChange={(e) => setHealthFormData({ ...healthFormData, allergies: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodType">Golongan Darah</Label>
                  <Select
                    value={healthFormData.bloodType || "none"}
                    onValueChange={(value) => setHealthFormData({ ...healthFormData, bloodType: value === "none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih golongan darah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="O">O</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eyesFunction">Fungsi Indera - Mata</Label>
                  <Select
                    value={healthFormData.eyesFunction || "none"}
                    onValueChange={(value) => setHealthFormData({ ...healthFormData, eyesFunction: value === "none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kondisi mata" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="rabun_jauh">Rabun Jauh</SelectItem>
                      <SelectItem value="rabun_dekat">Rabun Dekat</SelectItem>
                      <SelectItem value="buta_warna">Buta Warna</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="earsFunction">Fungsi Indera - Telinga</Label>
                  <Select
                    value={healthFormData.earsFunction || "none"}
                    onValueChange={(value) => setHealthFormData({ ...healthFormData, earsFunction: value === "none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kondisi telinga" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="gangguan_pendengaran">Gangguan Pendengaran</SelectItem>
                      <SelectItem value="tuli_sebagian">Tuli Sebagian</SelectItem>
                      <SelectItem value="tuli_total">Tuli Total</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diseases">Riwayat Penyakit</Label>
                <Input
                  id="diseases"
                  placeholder="Contoh: Asma, Demam Berdarah"
                  value={healthFormData.diseases}
                  onChange={(e) => setHealthFormData({ ...healthFormData, diseases: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalNotes">Catatan Medis</Label>
                <textarea
                  id="medicalNotes"
                  className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-y"
                  placeholder="Catatan khusus mengenai kesehatan siswa..."
                  value={healthFormData.medicalNotes}
                  onChange={(e) => setHealthFormData({ ...healthFormData, medicalNotes: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t" />

            {/* Data Imunisasi Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Syringe className="h-4 w-4 text-blue-500" />
                Data Imunisasi
              </h3>

              {/* Form Tambah Imunisasi */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Tambah Imunisasi Baru
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vaccine">Nama Vaksin *</Label>
                    <Input
                      id="vaccine"
                      placeholder="Contoh: BCG, Polio"
                      value={newImmunization.vaccine}
                      onChange={(e) => setNewImmunization({ ...newImmunization, vaccine: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="immDate">Tanggal</Label>
                    <Input
                      id="immDate"
                      type="date"
                      value={newImmunization.date}
                      onChange={(e) => setNewImmunization({ ...newImmunization, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dose">Dosis</Label>
                    <Input
                      id="dose"
                      placeholder="Contoh: 1, 2, 3"
                      value={newImmunization.dose}
                      onChange={(e) => setNewImmunization({ ...newImmunization, dose: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="immStatus">Status</Label>
                    <Select
                      value={newImmunization.status}
                      onValueChange={(value: "completed" | "scheduled") => setNewImmunization({ ...newImmunization, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Terjadwal</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="immNotes">Catatan</Label>
                    <Input
                      id="immNotes"
                      placeholder="Catatan tambahan..."
                      value={newImmunization.notes}
                      onChange={(e) => setNewImmunization({ ...newImmunization, notes: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Button
                      type="button"
                      onClick={handleAddImmunization}
                      className="w-full"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Tambah Imunisasi
                    </Button>
                  </div>
                </div>
              </div>

              {/* List Imunisasi */}
              {immunizations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Daftar Imunisasi ({immunizations.length})</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {immunizations.map((imm) => (
                      <div key={imm.id} className="flex items-start justify-between p-3 border rounded-md bg-background">
                        <div className="flex items-start gap-3 flex-1">
                          <Syringe className="h-4 w-4 mt-0.5 text-blue-500" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{imm.vaccine}</span>
                              {imm.status === "completed" ? (
                                <Badge variant="default" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Selesai
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Terjadwal
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {imm.date && <span className="mr-3">{imm.date}</span>}
                              {imm.dose && <span className="mr-3">Dosis: {imm.dose}</span>}
                            </div>
                            {imm.notes && (
                              <p className="text-xs text-muted-foreground mt-1">{imm.notes}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveImmunization(imm.id)}
                          className="text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {immunizations.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  <Syringe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Belum ada data imunisasi
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setHealthDialogOpen(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSaveHealthData}
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Edit,
  Trash2,
  Loader2,
  Calendar,
  Users,
  GraduationCap
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StudentAttendance {
  id: string
  studentId: string
  studentName: string
  date: string
  status: string
  notes?: string
  checkInTime?: string
  checkOutTime?: string
}

interface TeacherAttendance {
  id: string
  teacherId: string
  teacherName: string
  date: string
  status: string
  notes?: string
  checkInTime?: string
  checkOutTime?: string
}

export default function AdminAbsensiPage() {
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>([])
  const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingAttendance, setEditingAttendance] = useState<any>(null)
  const [deletingAttendance, setDeletingAttendance] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [attendanceType, setAttendanceType] = useState<"student" | "teacher">("student")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    status: "hadir",
    notes: "",
    checkInTime: "",
    checkOutTime: ""
  })

  useEffect(() => {
    fetchAttendanceData()
  }, [dateFilter, statusFilter, attendanceType])

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      const url = `/api/admin/attendance?type=${attendanceType}${dateFilter ? `&date=${dateFilter}` : ''}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        if (attendanceType === "student") {
          setStudentAttendance(data.attendance)
        } else {
          setTeacherAttendance(data.attendance)
        }
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data absensi"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditAttendance = (attendance: StudentAttendance | TeacherAttendance) => {
    setEditingAttendance(attendance)
    setFormData({
      status: attendance.status,
      notes: attendance.notes || "",
      checkInTime: attendance.checkInTime || "",
      checkOutTime: attendance.checkOutTime || ""
    })
    setDialogOpen(true)
  }

  const handleDeleteAttendance = (attendance: StudentAttendance | TeacherAttendance) => {
    setDeletingAttendance(attendance)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAttendance) return

    setSubmitting(true)

    try {
      const endpoint = attendanceType === "student"
        ? `/api/admin/student-attendance/${editingAttendance.id}`
        : `/api/admin/teacher-attendance/${editingAttendance.id}`

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Data absensi diperbarui"
        })
        setDialogOpen(false)
        fetchAttendanceData()
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
    if (!deletingAttendance) return

    try {
      const endpoint = attendanceType === "student"
        ? `/api/admin/student-attendance/${deletingAttendance.id}`
        : `/api/admin/teacher-attendance/${deletingAttendance.id}`

      const response = await fetch(endpoint, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Absensi berhasil dihapus"
        })
        setDeleteDialogOpen(false)
        fetchAttendanceData()
      } else {
        throw new Error(data.error || 'Gagal menghapus absensi')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menghapus absensi"
      })
    }
  }

  const currentAttendance = attendanceType === "student" ? studentAttendance : teacherAttendance

  const filteredAttendance = currentAttendance.filter((att: any) =>
    att.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    att.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const config = {
      hadir: { label: "Hadir", className: "bg-green-500" },
      izin: { label: "Izin", className: "bg-blue-500" },
      sakit: { label: "Sakit", className: "bg-yellow-500" },
      alpha: { label: "Alpha", className: "bg-red-500" }
    }
    const { label, className } = config[status as keyof typeof config] || config.hadir
    return <Badge className={className}>{label}</Badge>
  }

  return (
    <DashboardLayout role="admin" userName="Administrator">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan Absensi Sekolah</h1>
          <p className="text-muted-foreground mt-2">
            Kelola data absensi siswa dan guru
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-auto"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="hadir">Hadir</SelectItem>
                  <SelectItem value="izin">Izin</SelectItem>
                  <SelectItem value="sakit">Sakit</SelectItem>
                  <SelectItem value="alpha">Alpha</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs value={attendanceType} onValueChange={(v) => setAttendanceType(v as "student" | "teacher")}>
          <TabsList>
            <TabsTrigger value="student" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Absensi Siswa
            </TabsTrigger>
            <TabsTrigger value="teacher" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Absensi Guru
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Data Absensi Siswa ({filteredAttendance.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : filteredAttendance.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Tidak ada data absensi siswa
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Nama Siswa</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Jam Masuk</TableHead>
                          <TableHead>Jam Keluar</TableHead>
                          <TableHead>Catatan</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAttendance.map((att: any) => (
                          <TableRow key={att.id}>
                            <TableCell>{att.date}</TableCell>
                            <TableCell className="font-medium">{att.studentName}</TableCell>
                            <TableCell>{getStatusBadge(att.status)}</TableCell>
                            <TableCell>{att.checkInTime || "-"}</TableCell>
                            <TableCell>{att.checkOutTime || "-"}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{att.notes || "-"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditAttendance(att)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteAttendance(att)}
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
          </TabsContent>

          <TabsContent value="teacher" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Data Absensi Guru ({filteredAttendance.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : filteredAttendance.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Tidak ada data absensi guru
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Nama Guru</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Jam Masuk</TableHead>
                          <TableHead>Jam Keluar</TableHead>
                          <TableHead>Catatan</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAttendance.map((att: any) => (
                          <TableRow key={att.id}>
                            <TableCell>{att.date}</TableCell>
                            <TableCell className="font-medium">{att.teacherName}</TableCell>
                            <TableCell>{getStatusBadge(att.status)}</TableCell>
                            <TableCell>{att.checkInTime || "-"}</TableCell>
                            <TableCell>{att.checkOutTime || "-"}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{att.notes || "-"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditAttendance(att)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteAttendance(att)}
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
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Absensi</DialogTitle>
              <DialogDescription>
                Perbarui data absensi {attendanceType === "student" ? "siswa" : "guru"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
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
                      <SelectItem value="hadir">Hadir</SelectItem>
                      <SelectItem value="izin">Izin</SelectItem>
                      <SelectItem value="sakit">Sakit</SelectItem>
                      <SelectItem value="alpha">Alpha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="checkInTime">Jam Masuk</Label>
                    <Input
                      id="checkInTime"
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkOutTime">Jam Keluar</Label>
                    <Input
                      id="checkOutTime"
                      type="time"
                      value={formData.checkOutTime}
                      onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Keterangan tambahan..."
                  />
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
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Absensi?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus data absensi ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}

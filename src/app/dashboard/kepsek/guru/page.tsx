"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Users, GraduationCap, Calendar, CheckCircle2, Clock, Search, Loader2, AlertCircle, Eye, Mail, Phone, BookOpen, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

interface TeacherData {
  id: string
  userId: string
  name: string
  username: string
  email: string | null
  phone: string | null
  nuptk: string | null
  employmentStatus: string
  subjects: string
  lastEducation: string | null
  isActive: boolean
  classes: Array<{
    id: string
    name: string
    studentCount: number
  }>
  attendance: {
    hadir: number
    izin: number
    sakit: number
    alpha: number
    percentage: number
  }
  todayAttendance: string | null
}

export default function KepsekGuruPage() {
  const [teachers, setTeachers] = useState<TeacherData[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("semua")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherData | null>(null)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/kepsek/guru')
      const data = await response.json()
      if (data.success) {
        setTeachers(data.teachers)
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Hitung statistik dari data real
  const totalTeachers = teachers.length
  const totalTeachersTetap = teachers.filter(t => t.employmentStatus === 'tetap').length
  const totalTeachersHonorer = teachers.filter(t => t.employmentStatus === 'honorer').length
  const todayPresent = teachers.filter(t => t.todayAttendance === 'hadir').length

  // Filter guru
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.nuptk?.includes(searchQuery)
    const matchesFilter = filterStatus === 'semua' || teacher.employmentStatus === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Guru</h1>
            <p className="text-muted-foreground mt-2">
              Kelola data guru dan staf pengajar
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari guru..." 
                className="pl-8 w-64" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua</SelectItem>
                <SelectItem value="tetap">Tetap</SelectItem>
                <SelectItem value="honorer">Honorer</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Guru
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Statistik Guru */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTeachers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Semua guru</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Guru Tetap</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{totalTeachersTetap}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalTeachers > 0 ? `${Math.round((totalTeachersTetap / totalTeachers) * 100)}% dari total` : '0% dari total'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Guru Honorer</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{totalTeachersHonorer}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalTeachers > 0 ? `${Math.round((totalTeachersHonorer / totalTeachers) * 100)}% dari total` : '0% dari total'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kehadiran Hari Ini</CardTitle>
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalTeachers > 0 ? `${Math.round((todayPresent / totalTeachers) * 100)}%` : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {todayPresent}/{totalTeachers} hadir
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabel Data Guru */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Guru</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTeachers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Guru</TableHead>
                        <TableHead>NUPTK</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Mata Kegiatan</TableHead>
                        <TableHead>Pendidikan</TableHead>
                        <TableHead>Kelas Ampu</TableHead>
                        <TableHead>Kehadiran</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.nuptk || '-'}</TableCell>
                          <TableCell>
                            <Badge className={
                              teacher.employmentStatus === 'tetap' 
                                ? 'bg-green-600' 
                                : 'bg-orange-600'
                            }>
                              {teacher.employmentStatus === 'tetap' ? 'Tetap' : 'Honorer'}
                            </Badge>
                          </TableCell>
                          <TableCell>{teacher.subjects || '-'}</TableCell>
                          <TableCell>{teacher.lastEducation || '-'}</TableCell>
                          <TableCell>
                            {teacher.classes.length > 0 
                              ? teacher.classes.map(c => c.name).join(', ') 
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {teacher.todayAttendance ? (
                              <div className="flex items-center gap-2">
                                {teacher.todayAttendance === 'hadir' ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-600">Hadir</span>
                                  </>
                                ) : teacher.todayAttendance === 'izin' ? (
                                  <>
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm text-blue-600">Izin</span>
                                  </>
                                ) : teacher.todayAttendance === 'sakit' ? (
                                  <>
                                    <Clock className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm text-orange-600">Sakit</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-4 w-4 text-red-600" />
                                    <span className="text-sm text-red-600">Alpha</span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Belum</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTeacher(teacher)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">Tidak ada data guru ditemukan</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Jadwal Mengajar Hari Ini */}
            {filteredTeachers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Jadwal Mengajar Hari Ini
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTeachers.slice(0, 3).map((teacher, index) => (
                      <div key={teacher.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {teacher.classes.length > 0 ? teacher.classes.map(c => c.name).join(', ') : 'Belum ada kelas'}
                            </p>
                          </div>
                          {teacher.todayAttendance === 'hadir' && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Hadir
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">
                          {teacher.subjects || 'Mata kegiatan belum ditetapkan'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rekap Absensi Guru Bulanan */}
            {filteredTeachers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Rekap Absensi Guru - {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Guru</TableHead>
                      <TableHead className="text-center">Hadir</TableHead>
                      <TableHead className="text-center">Izin</TableHead>
                      <TableHead className="text-center">Sakit</TableHead>
                      <TableHead className="text-center">Alpha</TableHead>
                      <TableHead className="text-center">Persentase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => {
                      const total = teacher.attendance.hadir + teacher.attendance.izin + teacher.attendance.sakit + teacher.attendance.alpha
                      return (
                        <TableRow key={teacher.id}>
                          <TableCell>{teacher.name}</TableCell>
                          <TableCell className="text-center text-green-600 font-medium">{teacher.attendance.hadir}</TableCell>
                          <TableCell className="text-center text-blue-600">{teacher.attendance.izin}</TableCell>
                          <TableCell className="text-center text-orange-600">{teacher.attendance.sakit}</TableCell>
                          <TableCell className="text-center text-red-600">{teacher.attendance.alpha}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={
                              teacher.attendance.percentage >= 90 
                                ? 'bg-green-600' 
                                : teacher.attendance.percentage >= 70 
                                  ? 'bg-yellow-600' 
                                  : 'bg-red-600'
                            }>
                              {teacher.attendance.percentage}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            )}
          </>
        )}

        {/* Detail Guru Dialog */}
        <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Detail Guru
              </DialogTitle>
            </DialogHeader>
            {selectedTeacher && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedTeacher.name}</h3>
                    <Badge className={selectedTeacher.employmentStatus === 'tetap' ? 'bg-green-600' : 'bg-orange-600'}>
                      {selectedTeacher.employmentStatus === 'tetap' ? 'Guru Tetap' : 'Guru Honorer'}
                    </Badge>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">NUPTK</span>
                    <span className="font-medium">{selectedTeacher.nuptk || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">Email</span>
                    <span className="font-medium">{selectedTeacher.email || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">Telepon</span>
                    <span className="font-medium">{selectedTeacher.phone || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">Pendidikan</span>
                    <span className="font-medium">{selectedTeacher.lastEducation || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">Mata Kegiatan</span>
                    <span className="font-medium">{selectedTeacher.subjects || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">Kelas Ampu</span>
                    <span className="font-medium">
                      {selectedTeacher.classes.length > 0 
                        ? selectedTeacher.classes.map(c => `Kelas ${c.name} (${c.studentCount} siswa)`).join(', ')
                        : '-'
                      }
                    </span>
                  </div>
                </div>

                {/* Kehadiran Hari Ini */}
                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="text-sm font-semibold">Kehadiran Hari Ini</h4>
                  {selectedTeacher.todayAttendance ? (
                    <div className="flex items-center gap-2">
                      {selectedTeacher.todayAttendance === 'hadir' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      {selectedTeacher.todayAttendance === 'izin' && <Clock className="w-5 h-5 text-blue-600" />}
                      {selectedTeacher.todayAttendance === 'sakit' && <Clock className="w-5 h-5 text-orange-600" />}
                      {selectedTeacher.todayAttendance === 'alpha' && <Clock className="w-5 h-5 text-red-600" />}
                      <span className={`font-medium capitalize ${
                        selectedTeacher.todayAttendance === 'hadir' ? 'text-green-600' :
                        selectedTeacher.todayAttendance === 'izin' ? 'text-blue-600' :
                        selectedTeacher.todayAttendance === 'sakit' ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {selectedTeacher.todayAttendance}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum melakukan absensi</p>
                  )}
                </div>

                {/* Rekap Absensi Bulanan */}
                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-semibold">Rekap Absensi Bulan Ini</h4>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="rounded-md bg-green-50 p-2">
                      <div className="text-lg font-bold text-green-600">{selectedTeacher.attendance.hadir}</div>
                      <div className="text-xs text-green-700">Hadir</div>
                    </div>
                    <div className="rounded-md bg-blue-50 p-2">
                      <div className="text-lg font-bold text-blue-600">{selectedTeacher.attendance.izin}</div>
                      <div className="text-xs text-blue-700">Izin</div>
                    </div>
                    <div className="rounded-md bg-orange-50 p-2">
                      <div className="text-lg font-bold text-orange-600">{selectedTeacher.attendance.sakit}</div>
                      <div className="text-xs text-orange-700">Sakit</div>
                    </div>
                    <div className="rounded-md bg-red-50 p-2">
                      <div className="text-lg font-bold text-red-600">{selectedTeacher.attendance.alpha}</div>
                      <div className="text-xs text-red-700">Alpha</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Persentase Kehadiran</span>
                    <Badge className={
                      selectedTeacher.attendance.percentage >= 90 ? 'bg-green-600' :
                      selectedTeacher.attendance.percentage >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                    }>
                      {selectedTeacher.attendance.percentage}%
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setSelectedTeacher(null)} className="w-full">
                  Tutup
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
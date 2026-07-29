"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, GraduationCap, CheckCircle2, AlertCircle, Download, CalendarClock, Loader2, ClipboardList } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface ClassAttendance {
  classId: string
  className: string
  ageGroup: string
  totalStudents: number
  hadir: number
  izin: number
  sakit: number
  alpha: number
  assessedCount: number
  percent: number
  isComplete: boolean
}

interface TeacherDaily {
  teacherId: string
  teacherName: string
  classNames: string
  status: string
  checkInTime: string
  checkOutTime: string
  notes: string
  isHoliday: boolean
}

interface MonthlyRecap {
  classId?: string
  teacherId?: string
  className?: string
  teacherName?: string
  hadir: number
  izin: number
  sakit: number
  alpha: number
  totalRecords: number
  percent: number
}

interface AbsensiData {
  date: string
  month: string
  summary: {
    studentPercent: number
    studentHadir: number
    studentTotal: number
    teacherPercent: number
    teacherHadir: number
    teacherTotal: number
    totalIzin: number
    izinStudents: number
    izinTeachers: number
    totalSakit: number
    sakitStudents: number
    sakitTeachers: number
  }
  classAttendance: ClassAttendance[]
  teacherDailyData: TeacherDaily[]
  monthlyStudentRecap: MonthlyRecap[]
  monthlyTeacherRecap: MonthlyRecap[]
  availableDates: string[]
  availableMonths: string[]
}

interface DetailClass {
  id: string
  name: string
  studentCount: number
}

interface DetailStudent {
  id: string
  name: string
}

interface DetailRecord {
  id: string
  date: string
  studentName: string
  studentId: string
  status: string
  checkInTime: string
  checkOutTime: string
  notes: string
  isHoliday: boolean
}

interface DetailData {
  classes: DetailClass[]
  students: DetailStudent[]
  selectedClass: DetailClass | null
  month: string
  records: DetailRecord[]
  availableMonths: string[]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function getPercentColor(percent: number): string {
  if (percent >= 90) return 'bg-green-600'
  if (percent >= 70) return 'bg-yellow-600'
  return 'bg-red-600'
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'hadir':
      return <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" /><span className="text-green-600">Hadir</span></div>
    case 'izin':
      return <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-blue-600" /><span className="text-blue-600">Izin</span></div>
    case 'sakit':
      return <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-orange-600" /><span className="text-orange-600">Sakit</span></div>
    case 'alpha':
      return <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-red-600" /><span className="text-red-600">Alpha</span></div>
    default:
      return <span className="text-muted-foreground">-</span>
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'hadir':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Hadir</Badge>
    case 'izin':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Izin</Badge>
    case 'sakit':
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Sakit</Badge>
    case 'alpha':
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Alpha</Badge>
    default:
      return <Badge variant="secondary">-</Badge>
  }
}

export default function KepsekAbsensiPage() {
  const [data, setData] = useState<AbsensiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")

  // Detail tab states
  const [detailData, setDetailData] = useState<DetailData | null>(null)
  const [detailLoading, setDetailLoading] = useState(true)
  const [detailClassId, setDetailClassId] = useState<string>("")
  const [detailStudentId, setDetailStudentId] = useState<string>("semua")
  const [detailMonth, setDetailMonth] = useState<string>("")

  const fetchData = async (date?: string, month?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (date) params.set('date', date)
      if (month) params.set('month', month)

      const response = await fetch(`/api/kepsek/absensi?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
        setSelectedDate(result.data.date)
        setSelectedMonth(result.data.month)
      }
    } catch (error) {
      console.error('Error fetching absensi data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDetailData = async (classId?: string, month?: string, studentId?: string) => {
    try {
      setDetailLoading(true)
      const params = new URLSearchParams()
      if (classId) params.set('classId', classId)
      if (month) params.set('month', month)
      if (studentId && studentId !== 'semua') params.set('studentId', studentId)

      const response = await fetch(`/api/kepsek/absensi/detail?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setDetailData(result.data)
        if (result.data.selectedClass && !classId) {
          setDetailClassId(result.data.selectedClass.id)
        }
        if (!month && result.data.month) {
          setDetailMonth(result.data.month)
        }
      }
    } catch (error) {
      console.error('Error fetching detail data:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchDetailData()
  }, [])

  const handleDetailClassChange = (value: string) => {
    setDetailClassId(value)
    setDetailStudentId('semua')
    fetchDetailData(value, detailMonth, 'semua')
  }

  const handleDetailStudentChange = (value: string) => {
    setDetailStudentId(value)
    fetchDetailData(detailClassId, detailMonth, value)
  }

  const handleDetailMonthChange = (value: string) => {
    setDetailMonth(value)
    fetchDetailData(detailClassId, value, detailStudentId)
  }

  if (loading) {
    return (
      <DashboardLayout role="kepsek" userName="Kepala Sekolah">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!data) {
    return (
      <DashboardLayout role="kepsek" userName="Kepala Sekolah">
        <div className="text-center py-8 text-muted-foreground">
          Gagal memuat data absensi
        </div>
      </DashboardLayout>
    )
  }

  const { summary, classAttendance, teacherDailyData, monthlyStudentRecap, monthlyTeacherRecap } = data

  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitoring Absensi Sekolah</h1>
            <p className="text-muted-foreground mt-2">
              Pantau kehadiran siswa dan guru
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => fetchData(e.target.value)}
              className="w-48"
            />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistik */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran Siswa</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.studentPercent}%</div>
              <p className="text-xs text-muted-foreground mt-1">{summary.studentHadir}/{summary.studentTotal} hadir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran Guru</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.teacherPercent}%</div>
              <p className="text-xs text-muted-foreground mt-1">{summary.teacherHadir}/{summary.teacherTotal} hadir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Izin</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summary.totalIzin}</div>
              <p className="text-xs text-muted-foreground mt-1">{summary.izinStudents} siswa, {summary.izinTeachers} guru</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sakit</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{summary.totalSakit}</div>
              <p className="text-xs text-muted-foreground mt-1">{summary.sakitStudents} siswa, {summary.sakitTeachers} guru</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="siswa" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="siswa">Absensi Siswa</TabsTrigger>
	    <TabsTrigger value="detail">Detail Siswa</TabsTrigger>
            <TabsTrigger value="guru">Absensi Guru</TabsTrigger>
            <TabsTrigger value="rekap">Rekap Bulanan</TabsTrigger>
          </TabsList>

          {/* Absensi Siswa */}
          <TabsContent value="siswa" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Absensi Siswa - {formatDate(selectedDate)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classAttendance.length > 0 ? (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kelas</TableHead>
                          <TableHead>Total Siswa</TableHead>
                          <TableHead className="text-center text-green-600">Hadir</TableHead>
                          <TableHead className="text-center text-blue-600">Izin</TableHead>
                          <TableHead className="text-center text-orange-600">Sakit</TableHead>
                          <TableHead className="text-center text-red-600">Alpha</TableHead>
                          <TableHead className="text-center">Persentase</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classAttendance.map((cls) => (
                          <TableRow key={cls.classId}>
                            <TableCell className="font-medium">Kelas {cls.className}</TableCell>
                            <TableCell>{cls.totalStudents}</TableCell>
                            <TableCell className="text-center text-green-600 font-medium">{cls.hadir}</TableCell>
                            <TableCell className="text-center text-blue-600">{cls.izin}</TableCell>
                            <TableCell className="text-center text-orange-600">{cls.sakit}</TableCell>
                            <TableCell className="text-center text-red-600">{cls.alpha}</TableCell>
                            <TableCell className="text-center">
                              {cls.assessedCount > 0 ? (
                                <Badge className={getPercentColor(cls.percent)}>{cls.percent}%</Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {cls.assessedCount === 0 ? (
                                <span className="text-muted-foreground text-sm">Belum diisi</span>
                              ) : cls.isComplete ? (
                                <div className="flex items-center gap-2 justify-end">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-green-600">Lengkap</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 justify-end">
                                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm text-yellow-600">Belum Lengkap</span>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Tidak ada data kelas
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Absensi Guru */}
          <TabsContent value="guru" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Absensi Guru - {formatDate(selectedDate)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teacherDailyData.length > 0 ? (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Guru</TableHead>
                          <TableHead>Kelas Ampu</TableHead>
                          <TableHead>Jam Masuk</TableHead>
                          <TableHead>Jam Pulang</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Keterangan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teacherDailyData.map((teacher) => (
                          <TableRow key={teacher.teacherId}>
                            <TableCell className="font-medium">{teacher.teacherName}</TableCell>
                            <TableCell>{teacher.classNames || '-'}</TableCell>
                            <TableCell>{teacher.checkInTime}</TableCell>
                            <TableCell>{teacher.checkOutTime}</TableCell>
                            <TableCell>{getStatusIcon(teacher.status)}</TableCell>
                            <TableCell className="text-muted-foreground">{teacher.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Tidak ada data guru
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rekap Bulanan */}
          <TabsContent value="rekap" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5" />
                    Rekap Absensi Bulanan - {formatMonth(selectedMonth)}
                  </CardTitle>
                  <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => fetchData(undefined, e.target.value)}
                    className="w-48"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Rekap Absensi Siswa per Kelas</h3>
                    {monthlyStudentRecap.length > 0 ? (
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kelas</TableHead>
                              <TableHead className="text-center">Hadir</TableHead>
                              <TableHead className="text-center">Izin</TableHead>
                              <TableHead className="text-center">Sakit</TableHead>
                              <TableHead className="text-center">Alpha</TableHead>
                              <TableHead className="text-center">Persentase</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {monthlyStudentRecap.map((cls) => (
                              <TableRow key={cls.classId}>
                                <TableCell>Kelas {cls.className}</TableCell>
                                <TableCell className="text-center text-green-600 font-medium">{cls.hadir}</TableCell>
                                <TableCell className="text-center text-blue-600">{cls.izin}</TableCell>
                                <TableCell className="text-center text-orange-600">{cls.sakit}</TableCell>
                                <TableCell className="text-center text-red-600">{cls.alpha}</TableCell>
                                <TableCell className="text-center">
                                  {cls.totalRecords > 0 ? (
                                    <Badge className={getPercentColor(cls.percent)}>{cls.percent}%</Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">-</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Belum ada data absensi siswa bulan ini
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Rekap Absensi Guru</h3>
                    {monthlyTeacherRecap.length > 0 ? (
                      <div className="rounded-md border overflow-x-auto">
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
                            {monthlyTeacherRecap.map((teacher) => (
                              <TableRow key={teacher.teacherId}>
                                <TableCell>{teacher.teacherName}</TableCell>
                                <TableCell className="text-center text-green-600 font-medium">{teacher.hadir}</TableCell>
                                <TableCell className="text-center text-blue-600">{teacher.izin}</TableCell>
                                <TableCell className="text-center text-orange-600">{teacher.sakit}</TableCell>
                                <TableCell className="text-center text-red-600">{teacher.alpha}</TableCell>
                                <TableCell className="text-center">
                                  {teacher.totalRecords > 0 ? (
                                    <Badge className={getPercentColor(teacher.percent)}>{teacher.percent}%</Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">-</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Belum ada data absensi guru bulan ini
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detail Siswa */}
          <TabsContent value="detail" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Detail Absensi Siswa
                  </CardTitle>
		    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium whitespace-nowrap">Siswa:</span>
                      <Select value={detailStudentId} onValueChange={handleDetailStudentChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih siswa..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="semua">Semua Siswa</SelectItem>
                          {detailData?.students.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium whitespace-nowrap">Kelas:</span>
                      <Select value={detailClassId} onValueChange={handleDetailClassChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih kelas..." />
                        </SelectTrigger>
                        <SelectContent>
                          {detailData?.classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name} ({cls.studentCount} siswa)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium whitespace-nowrap">Bulan:</span>
                      <Select value={detailMonth} onValueChange={handleDetailMonthChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih bulan..." />
                        </SelectTrigger>
                        <SelectContent>
                          {detailData?.availableMonths.map((m) => (
                            <SelectItem key={m} value={m}>
                              {formatMonth(m)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {detailLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : detailData && detailData.records.length > 0 ? (
                  <>
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[130px]">Tanggal</TableHead>
                            <TableHead className="min-w-[200px]">Nama Siswa</TableHead>
                            <TableHead className="text-center w-[100px]">Status</TableHead>
                            <TableHead className="text-center w-[110px]">Jam Masuk</TableHead>
                            <TableHead className="text-center w-[110px]">Jam Pulang</TableHead>
                            <TableHead className="min-w-[180px]">Keterangan</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {detailData.records.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell className="font-mono text-sm">
                                {formatDateShort(record.date)}
                              </TableCell>
                              <TableCell className="font-medium">
                                {record.studentName}
                              </TableCell>
                              <TableCell className="text-center">
                                {getStatusBadge(record.status)}
                              </TableCell>
                              <TableCell className="text-center font-mono text-sm">
                                {record.checkInTime !== '-' ? record.checkInTime : <span className="text-muted-foreground">-</span>}
                              </TableCell>
                              <TableCell className="text-center font-mono text-sm">
                                {record.checkOutTime !== '-' ? record.checkOutTime : <span className="text-muted-foreground">-</span>}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {record.notes !== '-' ? record.notes : <span className="text-muted-foreground">-</span>}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary stats */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-green-700">
                            {detailData.records.filter(r => r.status === 'hadir').length}
                          </div>
                          <div className="text-xs text-green-600">Hadir</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-blue-700">
                            {detailData.records.filter(r => r.status === 'izin').length}
                          </div>
                          <div className="text-xs text-blue-600">Izin</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <div>
                          <div className="text-sm font-medium text-orange-700">
                            {detailData.records.filter(r => r.status === 'sakit').length}
                          </div>
                          <div className="text-xs text-orange-600">Sakit</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <div>
                          <div className="text-sm font-medium text-red-700">
                            {detailData.records.filter(r => r.status === 'alpha').length}
                          </div>
                          <div className="text-xs text-red-600">Alpha</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-6 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm border border-slate-200 mb-5">
                      <ClipboardList className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-lg font-bold text-slate-700">Belum ada data absensi</p>
                    <p className="text-sm mt-2 text-slate-500 text-center max-w-md">
                      {detailData?.selectedClass
                        ? `Data absensi untuk Kelas ${detailData.selectedClass.name} bulan ${detailMonth ? formatMonth(detailMonth) : 'ini'} belum tersedia. Data akan muncul di sini setelah guru menginput absensi siswa.`
                        : 'Pilih kelas untuk melihat detail absensi siswa.'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
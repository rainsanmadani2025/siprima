"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowLeft,
  Loader2,
  Users
} from "lucide-react"

interface Student {
  id: string
  name: string
  nis: string
}

interface AttendanceRecord {
  studentId: string
  date: string
  status: string
  isHoliday: boolean
}

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function KepsekAbsensiViewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const classId = searchParams.get('classId') || ""

  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonthNum, setSelectedMonthNum] = useState(now.getMonth() + 1)
  const selectedMonth = `${selectedYear}-${String(selectedMonthNum).padStart(2, '0')}`

  const [students, setStudents] = useState<Student[]>([])
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])

  const year = selectedYear
  const month = selectedMonthNum
  const daysInMonth = new Date(year, month, 0).getDate()

  const days: { day: number; dateStr: string; isWeekend: boolean }[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d)
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dow = date.getDay()
    days.push({ day: d, dateStr, isWeekend: dow === 0 || dow === 6 })
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (classId && selectedMonth) {
      fetchAttendance()
    }
  }, [classId, selectedMonth])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      if (data.success && data.classes) {
        setClasses(data.classes.map((c: any) => ({ id: c.id, name: c.name })))
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/kepsek/attendance/class-month?classId=${classId}&month=${selectedMonth}`)
      const data = await response.json()
      if (data.success) {
        setStudents(data.students)
        setAttendances(data.attendances)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusSymbol = (studentId: string, dateStr: string) => {
    const record = attendances.find(a => a.studentId === studentId && a.date === dateStr)
    if (record?.isHoliday) return { symbol: 'L', color: 'text-orange-500 font-semibold', bg: 'bg-orange-50 dark:bg-orange-950/20' }
    if (!record?.status) return { symbol: '-', color: 'text-muted-foreground', bg: '' }
    switch (record.status) {
      case 'hadir': return { symbol: 'H', color: 'text-green-600 font-semibold', bg: 'bg-green-50 dark:bg-green-950/20' }
      case 'sakit': return { symbol: 'S', color: 'text-yellow-600 font-semibold', bg: 'bg-yellow-50 dark:bg-yellow-950/20' }
      case 'izin': return { symbol: 'I', color: 'text-blue-600 font-semibold', bg: 'bg-blue-50 dark:bg-blue-950/20' }
      case 'alpha': return { symbol: 'A', color: 'text-red-600 font-semibold', bg: 'bg-red-50 dark:bg-red-950/20' }
      default: return { symbol: '-', color: 'text-muted-foreground', bg: '' }
    }
  }

  const getStudentSummary = (studentId: string) => {
    const studentAtt = attendances.filter(a => a.studentId === studentId && !a.isHoliday)
    return {
      hadir: studentAtt.filter(a => a.status === 'hadir').length,
      sakit: studentAtt.filter(a => a.status === 'sakit').length,
      izin: studentAtt.filter(a => a.status === 'izin').length,
      alpha: studentAtt.filter(a => a.status === 'alpha').length
    }
  }

  // Totals
  const allSummaries = students.map(s => getStudentSummary(s.id))
  const totalHadir = allSummaries.reduce((sum, s) => sum + s.hadir, 0)
  const totalSakit = allSummaries.reduce((sum, s) => sum + s.sakit, 0)
  const totalIzin = allSummaries.reduce((sum, s) => sum + s.izin, 0)
  const totalAlpha = allSummaries.reduce((sum, s) => sum + s.alpha, 0)

  const holidayDays = new Set(
    attendances.filter(a => a.isHoliday).map(a => a.date)
  )
  const effectiveDays = days.filter(d => !d.isWeekend && !holidayDays.has(d.dateStr)).length

  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/kepsek/absensi')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Detail Absensi Siswa</h1>
              <p className="text-muted-foreground text-sm">Lihat data absensi per siswa dalam sebulan</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Select value={classId} onValueChange={(v) => router.push(`/dashboard/kepsek/absensi/view?classId=${v}`)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Kelas" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => {
                  const yr = now.getFullYear() - 5 + i
                  return (
                    <SelectItem key={`year-${yr}`} value={String(yr)}>
                      {yr}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Select value={String(selectedMonthNum)} onValueChange={(v) => setSelectedMonthNum(Number(v))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent>
                {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((name, i) => (
                  <SelectItem key={`month-${i + 1}`} value={String(i + 1)}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Hari Efektif</p>
                  <p className="text-2xl font-bold">{effectiveDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Hadir</p>
                  <p className="text-2xl font-bold text-green-600">{totalHadir}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Sakit</p>
                  <p className="text-2xl font-bold text-yellow-600">{totalSakit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Izin</p>
                  <p className="text-2xl font-bold text-blue-600">{totalIzin}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <X className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Alpha</p>
                  <p className="text-2xl font-bold text-red-600">{totalAlpha}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabel Absensi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Rekap Absensi Kelas {classes.find(c => c.id === classId)?.name || '-'} — {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][month - 1]} {year}
            </CardTitle>
            <CardDescription>{students.length} siswa</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada data siswa di kelas ini</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-2 py-2 border text-center w-8">No</th>
                      <th className="px-2 py-2 border text-left min-w-[140px]">Nama Siswa</th>
                      <th className="px-2 py-2 border text-center w-16">NIS</th>
                      {days.map(d => (
                        <th key={d.day} className={`px-1 py-2 border text-center w-7 ${d.isWeekend ? 'bg-red-50 dark:bg-red-950/20' : ''}`}>
                          <div className="text-[9px] text-muted-foreground">{dayNames[new Date(year, month - 1, d.day).getDay()]}</div>
                          <div className="font-medium">{d.day}</div>
                        </th>
                      ))}
                      <th className="px-2 py-2 border text-center w-7 bg-green-50 dark:bg-green-950/20 font-semibold">H</th>
                      <th className="px-2 py-2 border text-center w-7 bg-yellow-50 dark:bg-yellow-950/20 font-semibold">S</th>
                      <th className="px-2 py-2 border text-center w-7 bg-blue-50 dark:bg-blue-950/20 font-semibold">I</th>
                      <th className="px-2 py-2 border text-center w-7 bg-red-50 dark:bg-red-950/20 font-semibold">A</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => {
                      const summary = getStudentSummary(student.id)
                      return (
                        <tr key={student.id} className={idx % 2 === 1 ? 'bg-muted/20' : ''}>
                          <td className="px-2 py-1.5 border text-center">{idx + 1}</td>
                          <td className="px-2 py-1.5 border font-medium">{student.name}</td>
                          <td className="px-2 py-1.5 border text-center">{student.nis}</td>
                          {days.map(d => {
                            const { symbol, color, bg } = getStatusSymbol(student.id, d.dateStr)
                            const dayBg = d.isWeekend ? 'bg-red-50 dark:bg-red-950/20' : bg
                            return (
                              <td key={d.day} className={`px-1 py-1.5 border text-center ${dayBg}`}>
                                {d.isWeekend ? (
                                  <span className="text-red-400 text-[10px]">-</span>
                                ) : (
                                  <span className={`text-[10px] ${color}`}>{symbol}</span>
                                )}
                              </td>
                            )
                          })}
                          <td className="px-2 py-1.5 border text-center font-semibold text-green-600">{summary.hadir}</td>
                          <td className="px-2 py-1.5 border text-center text-yellow-600">{summary.sakit}</td>
                          <td className="px-2 py-1.5 border text-center text-blue-600">{summary.izin}</td>
                          <td className="px-2 py-1.5 border text-center text-red-600">{summary.alpha}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><span className="font-bold text-green-600">H</span> = Hadir</div>
              <div className="flex items-center gap-1"><span className="font-bold text-yellow-600">S</span> = Sakit</div>
              <div className="flex items-center gap-1"><span className="font-bold text-blue-600">I</span> = Izin</div>
              <div className="flex items-center gap-1"><span className="font-bold text-red-600">A</span> = Alpha</div>
              <div className="flex items-center gap-1"><span className="font-bold text-orange-500">L</span> = Libur</div>
              <div className="flex items-center gap-1"><span className="font-bold text-red-400">-</span> = Weekend</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
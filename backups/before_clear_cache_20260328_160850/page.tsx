"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, AlertCircle, FileText, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  name: string
  nis: string
  class?: {
    id: string
    name: string
  }
}

interface Attendance {
  id: string
  studentId: string
  date: string
  status: string
  notes: string | null
}

interface AttendanceFormData {
  [studentId_date: string]: string // Key format: "studentId_YYYY-MM-DD"
}

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  hadir: { label: 'H', color: 'text-green-700', bg: 'bg-green-100' },
  izin: { label: 'I', color: 'text-blue-700', bg: 'bg-blue-100' },
  sakit: { label: 'S', color: 'text-orange-700', bg: 'bg-orange-100' },
  alpha: { label: 'A', color: 'text-red-700', bg: 'bg-red-100' }
}

export default function GuruAbsensiPage() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // Format: YYYY-MM
  const [attendanceData, setAttendanceData] = useState<AttendanceFormData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Get days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const [year, month] = selectedMonth.split('-').map(Number)
  const daysInMonth = getDaysInMonth(year, month)

  // Generate month options (last 6 months and next 6 months)
  const getMonthOptions = () => {
    const options = []
    const current = new Date()
    current.setMonth(current.getMonth() - 6)
    
    for (let i = 0; i < 12; i++) {
      const year = current.getFullYear()
      const month = String(current.getMonth() + 1).padStart(2, '0')
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      options.push({
        value: `${year}-${month}`,
        label: `${monthNames[current.getMonth()]} ${year}`
      })
      current.setMonth(current.getMonth() + 1)
    }
    return options
  }

  // Fetch students
  useEffect(() => {
    fetchStudents()
  }, [])

  // Fetch attendance when month changes
  useEffect(() => {
    if (selectedMonth) {
      fetchAttendanceForMonth()
    }
  }, [selectedMonth, students])

  const fetchStudents = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.warn('[Students] No userId found')
        return
      }

      const response = await fetch(`/api/guru/students-list?userId=${userId}`)
      const data = await response.json()
      if (data.success && data.students) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data siswa",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendanceForMonth = async () => {
    try {
      const response = await fetch(`/api/guru/attendance/month?month=${selectedMonth}`)
      const data = await response.json()
      if (data.success && data.attendance) {
        const attendanceMap: AttendanceFormData = {}
        data.attendance.forEach((attendance: Attendance) => {
          attendanceMap[`${attendance.studentId}_${attendance.date}`] = attendance.status
        })
        setAttendanceData(attendanceMap)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const handleStatusChange = (studentId: string, day: number, status: string) => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const key = `${studentId}_${date}`
    setAttendanceData(prev => ({
      ...prev,
      [key]: status
    }))
  }

  const handleSaveAttendance = async () => {
    setSaving(true)
    try {
      const attendances = Object.entries(attendanceData).map(([key, status]) => {
        const [studentId, date] = key.split('_')
        return { studentId, date, status, notes: '' }
      })

      const response = await fetch('/api/guru/attendance/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          month: selectedMonth,
          attendances
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Data absensi berhasil disimpan"
        })
      } else {
        throw new Error(data.error || 'Gagal menyimpan absensi')
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      toast({
        title: "Error",
        description: "Gagal menyimpan data absensi",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  // Calculate statistics
  const stats = {
    total: students.length * daysInMonth,
    hadir: Object.values(attendanceData).filter(s => s === 'hadir').length,
    izin: Object.values(attendanceData).filter(s => s === 'izin').length,
    sakit: Object.values(attendanceData).filter(s => s === 'sakit').length,
    alpha: Object.values(attendanceData).filter(s => s === 'alpha').length
  }

  const percentage = stats.total > 0 ? ((stats.hadir / stats.total) * 100).toFixed(0) : 0

  // Format month for display
  const formatMonthDisplay = (monthString: string) => {
    const [year, monthNum] = monthString.split('-')
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    return `${months[parseInt(monthNum) - 1]} ${year}`
  }

  // Get day name for header
  const getDayName = (day: number) => {
    const date = new Date(year, month - 1, day)
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    return days[date.getDay()]
  }

  // Check if day is weekend (Saturday/Sunday)
  const isWeekend = (day: number) => {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()
    return dayOfWeek === 0 || dayOfWeek === 6 // Sunday or Saturday
  }

  // Get status for a student on a specific day
  const getStatus = (studentId: string, day: number) => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const key = `${studentId}_${date}`
    return attendanceData[key] || 'hadir' // Default to 'hadir'
  }

  if (loading) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Absensi Siswa</h1>
            <p className="text-muted-foreground mt-2">
              Catat kehadiran siswa setiap hari
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {getMonthOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSaveAttendance} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Absensi
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistik Absensi Bulan Ini */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hari</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysInMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Hari kerja</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Siswa terdaftar</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hadir</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.hadir}</div>
              <p className="text-xs text-muted-foreground mt-1">{percentage}% hadir</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Izin/Sakit</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.izin + stats.sakit}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.izin} izin, {stats.sakit} sakit
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alpha</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.alpha}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0 ? ((stats.alpha / stats.total) * 100).toFixed(0) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Matriks Absensi */}
        <Card>
          <CardHeader>
            <CardTitle>Matriks Absensi - {formatMonthDisplay(selectedMonth)}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead className="w-64">Nama Siswa</TableHead>
                  <TableHead className="w-32">NIS</TableHead>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <TableHead 
                      key={day} 
                      className={`text-center px-2 py-2 min-w-[60px] ${isWeekend(day) ? 'bg-muted/50' : ''}`}
                    >
                      <div className="text-xs text-muted-foreground">{getDayName(day)}</div>
                      <div className="text-sm font-semibold">{day}</div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.nis}</TableCell>
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1
                      const status = getStatus(student.id, day)
                      const statusInfo = statusLabels[status] || statusLabels.hadir
                      
                      return (
                        <TableCell 
                          key={day} 
                          className={`p-1 text-center min-w-[60px] ${isWeekend(day) ? 'bg-muted/30' : ''}`}
                        >
                          <Select
                            value={status}
                            onValueChange={(value) => handleStatusChange(student.id, day, value)}
                            disabled={isWeekend(day)}
                          >
                            <SelectTrigger className={`h-8 text-xs font-bold ${statusInfo.bg} ${statusInfo.color} border-0`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusLabels).map(([key, info]) => (
                                <SelectItem key={key} value={key} className="text-xs">
                                  <Badge className={`${info.bg} ${info.color} border-0`}>
                                    {info.label} - {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700">H - Hadir</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700">I - Izin</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-700">S - Sakit</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-700">A - Alpha</Badge>
              </div>
              <div className="text-muted-foreground ml-auto">
                Hari Sabtu & Minggu di-gray out (libur)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

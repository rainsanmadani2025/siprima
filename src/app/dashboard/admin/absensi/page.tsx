"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  FileText,
  Loader2,
  Edit,
  X,
  Save,
  RotateCcw,
  Download,
  Users,
  School
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ClassItem {
  id: string
  name: string
  teacherName: string | null
  studentCount: number
}

interface Student {
  id: string
  name: string
  nis: string
  className: string
}

interface DayAttendance {
  day: number
  date: string
  checkIn?: string
  checkOut?: string
  status: 'hadir' | 'sakit' | 'izin' | 'alpha' | ''
  notes?: string
  isHoliday?: boolean
  isWeekend?: boolean
}

export default function AdminAbsensiPage() {
  const { toast } = useToast()
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonthNum, setSelectedMonthNum] = useState(now.getMonth() + 1)
  const selectedMonth = `${selectedYear}-${String(selectedMonthNum).padStart(2, '0')}`
  const [attendanceData, setAttendanceData] = useState<DayAttendance[]>([])
  const [originalData, setOriginalData] = useState<DayAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [editingDay, setEditingDay] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<{ checkIn: string; checkOut: string; status: string; notes: string; isHoliday: boolean }>({
    checkIn: '',
    checkOut: '',
    status: '',
    notes: '',
    isHoliday: false
  })

  const year = selectedYear
  const month = selectedMonthNum
  const daysInMonth = new Date(year, month, 0).getDate()

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
    }
  }, [selectedClass])

  useEffect(() => {
    if (selectedStudent) {
      fetchAttendanceForStudent(selectedStudent.id)
    }
  }, [selectedStudent, selectedMonth])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      if (data.success && data.classes) {
        setClasses(data.classes)
        if (data.classes.length > 0) {
          setSelectedClass(data.classes[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/admin/students-by-class?classId=${selectedClass}`)
      const data = await response.json()
      if (data.success && data.students) {
        setStudents(data.students)
        if (data.students.length > 0) {
          setSelectedStudent(data.students[0])
        } else {
          setSelectedStudent(null)
          setAttendanceData([])
          setOriginalData([])
        }
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchAttendanceForStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/admin/attendance/month?month=${selectedMonth}&studentId=${studentId}`)
      const data = await response.json()

      const days: DayAttendance[] = []
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day)
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const dayOfWeek = date.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

        const existingRecord = data.attendance?.find((a: any) => a.date === dateStr)

        days.push({
          day,
          date: dateStr,
          checkIn: existingRecord?.checkIn || '',
          checkOut: existingRecord?.checkOut || '',
          status: existingRecord?.status || '',
          notes: existingRecord?.notes || '',
          isHoliday: existingRecord?.isHoliday || false,
          isWeekend
        })
      }

      setAttendanceData(days)
      setOriginalData(JSON.parse(JSON.stringify(days)))
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const handleStatusChange = (day: number, status: string) => {
    setAttendanceData(prev => prev.map(d => {
      if (d.day !== day) return d
      const updated = { ...d, status: status as any }
      if (status === 'hadir') {
        if (!updated.checkIn) updated.checkIn = '07:30'
        if (!updated.checkOut) updated.checkOut = '13:00'
      } else {
        updated.checkIn = ''
        updated.checkOut = ''
      }
      return updated
    }))
  }

  const handleTimeChange = (day: number, field: 'checkIn' | 'checkOut', value: string) => {
    setAttendanceData(prev => prev.map(d => {
      if (d.day !== day) return d
      if (value) {
        return { ...d, [field]: value, status: 'hadir' as any }
      }
      const updated = { ...d, [field]: value }
      if (!updated.checkIn && !updated.checkOut) {
        updated.status = ''
      }
      return updated
    }))
  }

  const handleHolidayChange = (day: number, isHoliday: boolean) => {
    setAttendanceData(prev => prev.map(d => {
      if (d.day !== day) return d
      return { ...d, isHoliday, status: '' as any, checkIn: '', checkOut: '', notes: '' }
    }))
  }

  const handleNotesChange = (day: number, notes: string) => {
    setAttendanceData(prev => prev.map(d => {
      if (d.day !== day) return d
      return { ...d, notes }
    }))
  }

  const hasUnsavedChanges = JSON.stringify(attendanceData) !== JSON.stringify(originalData)

  const handleSaveAll = async () => {
    if (!selectedStudent) return
    setSaving(true)
    try {
      const recordsToSave = attendanceData
        .filter(d => !d.isWeekend && (d.status || d.isHoliday || d.checkIn || d.checkOut))
        .map(d => ({
          studentId: selectedStudent.id,
          date: d.date,
          status: d.status || null,
          notes: d.notes || null,
          checkIn: d.checkIn || null,
          checkOut: d.checkOut || null,
          isHoliday: d.isHoliday || false
        }))

      const response = await fetch('/api/admin/attendance/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: selectedMonth, attendances: recordsToSave })
      })

      const data = await response.json()

      if (data.success) {
        toast({ title: "Berhasil", description: `Data absensi berhasil disimpan (${data.count} record)` })
        fetchAttendanceForStudent(selectedStudent.id)
      } else {
        throw new Error(data.error || 'Gagal menyimpan')
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal menyimpan data absensi" })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setAttendanceData(JSON.parse(JSON.stringify(originalData)))
  }

  const handleExportPDF = async () => {
    if (!selectedClass) return
    setExporting(true)
    try {
      const response = await fetch('/api/admin/attendance/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: selectedClass, month: selectedMonth })
      })

      if (!response.ok) throw new Error('Gagal mengunduh PDF')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `absensi-siswa-${selectedClass}-${selectedMonth}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({ title: "Berhasil", description: "PDF berhasil diunduh" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "Gagal mengunduh PDF" })
    } finally {
      setExporting(false)
    }
  }

  const handleEditDay = (day: number) => {
    const dayData = attendanceData.find(d => d.day === day)
    if (dayData) {
      setEditingDay(day)
      setEditForm({
        checkIn: dayData.checkIn || '',
        checkOut: dayData.checkOut || '',
        status: dayData.status || '',
        notes: dayData.notes || '',
        isHoliday: dayData.isHoliday || false
      })
    }
  }

  const handleUpdateDay = () => {
    if (editingDay === null) return
    setAttendanceData(prev => prev.map(d => {
      if (d.day !== editingDay) return d
      return { ...d, ...editForm, status: editForm.status as any }
    }))
    setEditingDay(null)
  }

  const handleCancelEdit = () => {
    setEditingDay(null)
  }

  const effectiveDays = attendanceData.filter(d => !d.isWeekend && !d.isHoliday).length
  const hadirCount = attendanceData.filter(d => d.status === 'hadir' && !d.isWeekend && !d.isHoliday).length
  const sakitIzinCount = attendanceData.filter(d => (d.status === 'sakit' || d.status === 'izin') && !d.isWeekend && !d.isHoliday).length
  const alphaCount = attendanceData.filter(d => d.status === 'alpha' && !d.isWeekend && !d.isHoliday).length

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  return (
    <DashboardLayout role="admin" userName="Administrator">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Absensi Siswa</h1>
          <p className="text-muted-foreground mt-2">
            Kelola data absensi siswa per bulan
          </p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <p className="text-sm text-muted-foreground">Hadir</p>
                  <p className="text-2xl font-bold text-green-600">{hadirCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Sakit/Izin</p>
                  <p className="text-2xl font-bold text-yellow-600">{sakitIzinCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <X className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Alpha</p>
                  <p className="text-2xl font-bold text-red-600">{alphaCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  Filter Data
                </CardTitle>
                <CardDescription>Pilih kelas, siswa, dan bulan untuk melihat absensi</CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
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
                <Button
                  onClick={handleSaveAll}
                  disabled={saving || !hasUnsavedChanges || !selectedStudent}
                  variant={hasUnsavedChanges ? "default" : "outline"}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </Button>
                <Button
                  onClick={handleReset}
                  disabled={!hasUnsavedChanges}
                  variant="outline"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  onClick={handleExportPDF}
                  disabled={exporting || !selectedClass}
                  variant="outline"
                >
                  {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setSelectedStudent(null) }}>
                <SelectTrigger className="w-full sm:w-auto flex-1">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.teacherName || '-'}) — {cls.studentCount} siswa
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedStudent?.id || ""}
                onValueChange={(v) => {
                  const student = students.find(s => s.id === v)
                  if (student) setSelectedStudent(student)
                }}
                disabled={!students.length}
              >
                <SelectTrigger className="w-full sm:w-auto flex-1">
                  <SelectValue placeholder="Pilih Siswa" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.nis})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabel Absensi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Kalender Absensi — {selectedStudent?.name || '-'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : !selectedStudent ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Pilih kelas dan siswa untuk melihat data absensi</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-2 py-2 text-center border w-10">No.</th>
                      <th className="px-2 py-2 text-center border w-12">Hari</th>
                      <th className="px-2 py-2 text-center border w-16">Tanggal</th>
                      <th className="px-2 py-2 text-center border w-20">Status</th>
                      <th className="px-2 py-2 text-center border w-16">Masuk</th>
                      <th className="px-2 py-2 text-center border w-16">Pulang</th>
                      <th className="px-2 py-2 text-center border w-12">H</th>
                      <th className="px-2 py-2 text-center border w-12">S</th>
                      <th className="px-2 py-2 text-center border w-12">I</th>
                      <th className="px-2 py-2 text-center border w-12">A</th>
                      <th className="px-2 py-2 text-center border min-w-[120px]">Keterangan</th>
                      <th className="px-2 py-2 text-center border w-12">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((dayData) => {
                      const date = new Date(year, month - 1, dayData.day)
                      const dayName = dayNames[date.getDay()]
                      const isEditing = editingDay === dayData.day

                      if (dayData.isWeekend) {
                        return (
                          <tr key={dayData.day} className="bg-red-50 dark:bg-red-950/20">
                            <td className="px-2 py-1.5 text-center border text-red-400 font-medium">{dayData.day}</td>
                            <td className="px-2 py-1.5 text-center border text-red-400 font-medium">{dayName}</td>
                            <td className="px-2 py-1.5 text-center border text-red-400">{String(dayData.day).padStart(2, '0')}/{String(month).padStart(2, '0')}/{year}</td>
                            <td colSpan={9} className="px-2 py-1.5 text-center border text-red-400 font-semibold">WEEKEND</td>
                          </tr>
                        )
                      }

                      if (dayData.isHoliday) {
                        return (
                          <tr key={dayData.day} className="bg-orange-50 dark:bg-orange-950/20">
                            <td className="px-2 py-1.5 text-center border text-orange-500 font-medium">{dayData.day}</td>
                            <td className="px-2 py-1.5 text-center border text-orange-500 font-medium">{dayName}</td>
                            <td className="px-2 py-1.5 text-center border text-orange-500">{String(dayData.day).padStart(2, '0')}/{String(month).padStart(2, '0')}/{year}</td>
                            <td colSpan={9} className="px-2 py-1.5 text-center border text-orange-500 font-semibold">LIBUR</td>
                          </tr>
                        )
                      }

                      return (
                        <tr key={dayData.day} className={isEditing ? "bg-yellow-50 dark:bg-yellow-950/20" : (dayData.day % 2 === 0 ? "bg-muted/20" : "")}>
                          <td className="px-2 py-1.5 text-center border">{dayData.day}</td>
                          <td className="px-2 py-1.5 text-center border font-medium">{dayName}</td>
                          <td className="px-2 py-1.5 text-center border text-xs">{String(dayData.day).padStart(2, '0')}/{String(month).padStart(2, '0')}/{year}</td>
                          <td className="px-2 py-1.5 text-center border">
                            <select
                              value={dayData.status}
                              onChange={(e) => handleHolidayChange(dayData.day, e.target.value === 'LIBUR')}
                              className="w-full text-xs bg-transparent border-none p-0 focus:outline-none cursor-pointer"
                            >
                              <option value="Sekolah">Sekolah</option>
                              <option value="LIBUR">LIBUR</option>
                            </select>
                          </td>
                          <td className="px-2 py-1.5 text-center border">
                            {isEditing ? (
                              <Input type="time" value={editForm.checkIn} onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })} className="h-7 text-xs" />
                            ) : (
                              <span className={dayData.checkIn ? "text-green-600 font-medium" : "text-muted-foreground"}>{dayData.checkIn || "-"}</span>
                            )}
                          </td>
                          <td className="px-2 py-1.5 text-center border">
                            {isEditing ? (
                              <Input type="time" value={editForm.checkOut} onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })} className="h-7 text-xs" />
                            ) : (
                              <span className={dayData.checkOut ? "text-green-600 font-medium" : "text-muted-foreground"}>{dayData.checkOut || "-"}</span>
                            )}
                          </td>
                          <td className="px-2 py-1.5 text-center border">
                            <input type="radio" name={`status-${dayData.day}`} checked={dayData.status === 'hadir'} onChange={() => handleStatusChange(dayData.day, 'hadir')} className="accent-green-500 cursor-pointer" />
                          </td>
                          <td className="px-2 py-1.5 text-center border">
                            <input type="radio" name={`status-${dayData.day}`} checked={dayData.status === 'sakit'} onChange={() => handleStatusChange(dayData.day, 'sakit')} className="accent-yellow-500 cursor-pointer" />
                          </td>
                          <td className="px-2 py-1.5 text-center border">
                            <input type="radio" name={`status-${dayData.day}`} checked={dayData.status === 'izin'} onChange={() => handleStatusChange(dayData.day, 'izin')} className="accent-blue-500 cursor-pointer" />
                          </td>
                          <td className="px-2 py-1.5 text-center border">
                            <input type="radio" name={`status-${dayData.day}`} checked={dayData.status === 'alpha'} onChange={() => handleStatusChange(dayData.day, 'alpha')} className="accent-red-500 cursor-pointer" />
                          </td>
                          <td className="px-2 py-1.5 text-center border">
                            {isEditing ? (
                              <Input value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} placeholder="Keterangan" className="h-7 text-xs" />
                            ) : (
                              <span className="text-xs text-muted-foreground truncate block max-w-[100px]">{dayData.notes || "-"}</span>
                            )}
                          </td>
                          <td className="px-2 py-1.5 text-center border">
                            {isEditing ? (
                              <div className="flex gap-1 justify-center">
                                <Button size="sm" variant="ghost" onClick={handleUpdateDay} className="h-6 w-6 p-0 text-green-600 hover:text-green-700">
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6 p-0 text-red-500 hover:text-red-600">
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => handleEditDay(dayData.day)} className="h-6 w-6 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                          </td>
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
              <div className="flex items-center gap-1"><span className="font-bold text-red-400">WEEKEND</span> = Hari libur Sabtu/Minggu</div>
              <div className="flex items-center gap-1"><span className="font-bold text-orange-500">LIBUR</span> = Hari libur nasional/khusus</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
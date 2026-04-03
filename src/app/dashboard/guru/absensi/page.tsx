'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, CheckCircle2, AlertCircle, FileText, Loader2, Edit, X, Save, RotateCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Student {
  id: string
  name: string
  nis: string
  nisn?: string
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

export default function GuruAbsensiPage() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [attendanceData, setAttendanceData] = useState<DayAttendance[]>([])
  const [originalData, setOriginalData] = useState<DayAttendance[]>([]) // Data terakhir yang disimpan
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Edit mode per tanggal
  const [editingDay, setEditingDay] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<{ checkIn: string; checkOut: string; status: string; notes: string; isHoliday: boolean }>({
    checkIn: '',
    checkOut: '',
    status: '',
    notes: '',
    isHoliday: false
  })

  const [year, month] = selectedMonth.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      fetchAttendanceForStudent(selectedStudent.id)
    }
  }, [selectedStudent, selectedMonth])

  const fetchStudents = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) return

      const response = await fetch(`/api/guru/students-list?userId=${userId}`)
      const data = await response.json()
      if (data.success && data.students) {
        setStudents(data.students)
        if (data.students.length > 0) {
          setSelectedStudent(data.students[0])
        }
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendanceForStudent = async (studentId: string) => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await fetch(`/api/guru/attendance/month?month=${selectedMonth}&userId=${userId}`)
      const data = await response.json()
      
      // Generate data untuk semua tanggal dalam bulan
      const days: DayAttendance[] = []
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day)
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const dayOfWeek = date.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 // Minggu = 0, Sabtu = 6
        
        // Cek apakah ada data absensi dari database
        const existingRecord = data.attendance?.find((a: any) => a.studentId === studentId && a.date === dateStr)
        
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
      setOriginalData(JSON.parse(JSON.stringify(days))) // Deep copy untuk data asli
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const handleSaveAll = async () => {
    if (!selectedStudent) return

    // Validasi semua data sebelum simpan
    for (const dayData of attendanceData) {
      if (dayData.status === 'hadir' && (!dayData.checkIn || !dayData.checkOut)) {
        toast({
          title: "Error",
          description: `Tanggal ${formatDateDisplay(dayData.date)}: Untuk status Hadir, jam masuk dan pulang harus diisi`,
          variant: "destructive"
        })
        return
      }
      if ((dayData.status === 'izin' || dayData.status === 'alpha') && !dayData.notes) {
        toast({
          title: "Error",
          description: `Tanggal ${formatDateDisplay(dayData.date)}: Keterangan wajib diisi untuk status Izin atau Alpha`,
          variant: "destructive"
        })
        return
      }
    }

    try {
      setSaving(true)

      // Siapkan data untuk dikirim (tanggal yang ada isinya atau ditandai LIBUR)
      const attendancesToSave = attendanceData
        .filter(d => d.status || d.isHoliday)
        .map(d => ({
          studentId: selectedStudent.id,
          date: d.date,
          status: d.status || '',
          notes: d.notes || '',
          checkIn: d.checkIn || '',
          checkOut: d.checkOut || '',
          isHoliday: d.isHoliday || false
        }))

      const response = await fetch('/api/guru/attendance/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: selectedMonth,
          attendances: attendancesToSave
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Semua absensi berhasil disimpan"
        })
        // Refresh data dan update originalData
        await fetchAttendanceForStudent(selectedStudent.id)
        setEditingDay(null)
        setEditForm({ checkIn: '', checkOut: '', status: '', notes: '', isHoliday: false })
      } else {
        throw new Error(data.error || 'Gagal menyimpan absensi')
      }
    } catch (error: any) {
      console.error('Error saving attendance:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan data absensi",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    // Kembalikan ke data terakhir yang disimpan
    setAttendanceData(JSON.parse(JSON.stringify(originalData)))
    setEditingDay(null)
    setEditForm({ checkIn: '', checkOut: '', status: '', notes: '', isHoliday: false })
    toast({
      title: "Reset",
      description: "Perubahan dikembalikan ke data terakhir yang disimpan"
    })
  }

  const handleEditDay = (day: number) => {
    const dayData = attendanceData.find(d => d.day === day)
    if (!dayData) return

    setEditingDay(day)
    setEditForm({
      checkIn: dayData.checkIn || '',
      checkOut: dayData.checkOut || '',
      status: dayData.status || '',
      notes: dayData.notes || '',
      isHoliday: dayData.isHoliday || false
    })
  }

  const handleCancelEdit = () => {
    setEditingDay(null)
    setEditForm({ checkIn: '', checkOut: '', status: '', notes: '', isHoliday: false })
  }

  const handleUpdateDay = () => {
    if (editingDay === null) return

    // Validasi
    if (editForm.status === 'hadir' && (!editForm.checkIn || !editForm.checkOut)) {
      toast({
        title: "Error",
        description: "Untuk status Hadir, jam masuk dan pulang harus diisi",
        variant: "destructive"
      })
      return
    }

    if ((editForm.status === 'izin' || editForm.status === 'alpha') && !editForm.notes) {
      toast({
        title: "Error",
        description: "Keterangan wajib diisi untuk status Izin atau Alpha",
        variant: "destructive"
      })
      return
    }

    // Update data lokal
    setAttendanceData(prev => prev.map(d =>
      d.day === editingDay ? {
        ...d,
        checkIn: editForm.checkIn,
        checkOut: editForm.checkOut,
        status: editForm.status,
        notes: editForm.notes,
        isHoliday: editForm.isHoliday
      } : d
    ))

    setEditingDay(null)
    setEditForm({ checkIn: '', checkOut: '', status: '', notes: '', isHoliday: false })
  }

  const formatMonthDisplay = (monthString: string) => {
    const [year, monthNum] = monthString.split('-')
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    return `${months[parseInt(monthNum) - 1]} ${year}`
  }

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    return days[date.getDay()]
  }

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Calculate statistics
  const stats = {
    hadir: attendanceData.filter(r => r.status === 'hadir').length,
    sakit: attendanceData.filter(r => r.status === 'sakit').length,
    izin: attendanceData.filter(r => r.status === 'izin').length,
    alpha: attendanceData.filter(r => r.status === 'alpha').length
  }

  const total = attendanceData.length
  const percentage = total > 0 ? ((stats.hadir / total) * 100).toFixed(0) : 0

  // Cek apakah ada perubahan yang belum disimpan
  const hasUnsavedChanges = JSON.stringify(attendanceData) !== JSON.stringify(originalData)

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Absensi Siswa</h1>
          <p className="text-muted-foreground mt-2">
            Catat kehadiran siswa setiap hari
          </p>
        </div>

        {/* Statistik Absensi */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hari</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysInMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Hari dalam bulan</p>
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
              <p className="text-xs text-muted-foreground">
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
              <p className="text-xs text-muted-foreground">
                {total > 0 ? ((stats.alpha / total) * 100).toFixed(0) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pilih Siswa dan Bulan dengan Tombol Simpan/Reset */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <CardTitle>Pilih Siswa</CardTitle>
                <CardDescription>Pilih siswa untuk melihat dan mengedit absensi</CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const currentDate = new Date()
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6 + i, 1)
                      const year = date.getFullYear()
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
                      return (
                        <SelectItem key={`month-${i}-${year}-${month}`} value={`${year}-${month}`}>
                          {months[date.getMonth()]} {year}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleSaveAll} 
                  disabled={saving || !hasUnsavedChanges}
                  variant={hasUnsavedChanges ? "default" : "outline"}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </Button>
                <Button 
                  onClick={handleReset} 
                  disabled={!hasUnsavedChanges}
                  variant="outline"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {students.length > 0 ? (
              <Select
                value={selectedStudent?.id || ''}
                onValueChange={(value) => {
                  const student = students.find(s => s.id === value)
                  if (student) setSelectedStudent(student)
                }}
              >
                <SelectTrigger className="w-full md:w-96">
                  <SelectValue placeholder="Pilih Siswa" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.nis}) - {student.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground">Tidak ada siswa yang tersedia</p>
            )}
          </CardContent>
        </Card>

        {/* Tabel Absensi */}
        {selectedStudent && (
          <Card>
            <CardHeader>
              <CardTitle>Tabel Absensi - {formatMonthDisplay(selectedMonth)}</CardTitle>
              <CardDescription>
                {hasUnsavedChanges ? (
                  <span className="text-amber-600 font-medium">⚠️ Ada perubahan yang belum disimpan</span>
                ) : (
                  <span className="text-green-600 font-medium">✓ Semua data tersimpan</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-400">
                    <th className="p-2 text-center border border-gray-300 w-12">No.</th>
                    <th className="p-2 text-center border border-gray-300 w-20">Hari</th>
                    <th className="p-2 text-center border border-gray-300 w-28">Tanggal</th>
                    <th className="p-2 text-center border border-gray-300 w-24">Status</th>
                    <th className="p-2 text-center border border-gray-300 w-28">Masuk</th>
                    <th className="p-2 text-center border border-gray-300 w-28">Pulang</th>
                    <th className="p-2 text-center border border-gray-300 w-16">Hadir</th>
                    <th className="p-2 text-center border border-gray-300 w-16">Sakit</th>
                    <th className="p-2 text-center border border-gray-300 w-16">Izin</th>
                    <th className="p-2 text-center border border-gray-300 w-16">Alpa</th>
                    <th className="p-2 text-center border border-gray-300 w-64">Keterangan</th>
                    <th className="p-2 text-center border border-gray-300 w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((dayData) => {
                    const isEditing = editingDay === dayData.day
                    const isLibur = dayData.isWeekend || dayData.isHoliday || (isEditing && editForm.isHoliday)

                    // Tentukan data yang ditampilkan
                    const currentStatus = isEditing ? editForm.status : dayData.status
                    const currentCheckIn = isEditing ? editForm.checkIn : dayData.checkIn
                    const currentCheckOut = isEditing ? editForm.checkOut : dayData.checkOut
                    const currentNotes = isEditing ? editForm.notes : dayData.notes

                    return (
                      <tr key={dayData.day} className="border-b border-gray-200 hover:bg-muted/30">
                        <td className="p-2 text-center border border-gray-200">{dayData.day}.</td>
                        <td className="p-2 text-center border border-gray-200 text-sm font-medium">
                          {getDayName(dayData.date)}
                        </td>
                        <td className="p-2 text-center border border-gray-200 text-sm">
                          {formatDateDisplay(dayData.date)}
                        </td>

                        {/* Status Hari (Sekolah/LIBUR) */}
                        <td className="p-1 text-center border border-gray-200">
                          {(dayData.isWeekend || dayData.isHoliday) && !isEditing ? (
                            <span className="text-red-600 font-bold text-xs">LIBUR</span>
                          ) : isEditing ? (
                            <select
                              value={editForm.isHoliday ? 'LIBUR' : 'Sekolah'}
                              onChange={(e) => setEditForm({ ...editForm, isHoliday: e.target.value === 'LIBUR' })}
                              className="h-9 text-xs text-center border border-gray-300 rounded px-1 cursor-pointer"
                            >
                              <option value="Sekolah">Sekolah</option>
                              <option value="LIBUR">LIBUR</option>
                            </select>
                          ) : (
                            <select
                              value={dayData.isHoliday ? 'LIBUR' : 'Sekolah'}
                              onChange={(e) => {
                                setAttendanceData(prev => prev.map(d =>
                                  d.day === dayData.day ? { ...d, isHoliday: e.target.value === 'LIBUR' } : d
                                ))
                              }}
                              className="h-9 text-xs text-center border border-gray-300 rounded px-1 cursor-pointer"
                            >
                              <option value="Sekolah">Sekolah</option>
                              <option value="LIBUR">LIBUR</option>
                            </select>
                          )}
                        </td>

                        {/* Absen - Jam Masuk */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : (
                            <>
                              {isEditing ? (
                                <Input
                                  type="time"
                                  value={editForm.checkIn}
                                  onChange={(e) => {
                                    setEditForm({ ...editForm, checkIn: e.target.value })
                                    // Auto-set status ke 'hadir' saat jam diisi
                                    if (e.target.value || editForm.checkOut) {
                                      setEditForm(prev => ({ ...prev, status: 'hadir', notes: '' }))
                                    }
                                  }}
                                  className="h-9 text-sm text-center cursor-pointer"
                                  disabled={isLibur || !!(editForm.status && editForm.status !== 'hadir')}
                                />
                              ) : (
                                <Input
                                  type="time"
                                  value={currentCheckIn}
                                  onChange={(e) => {
                                    // Update langsung (mode edit otomatis di awal)
                                    setAttendanceData(prev => prev.map(d =>
                                      d.day === dayData.day ? { ...d, checkIn: e.target.value } : d
                                    ))
                                    // Auto-set status ke 'hadir' saat jam diisi
                                    if (e.target.value || currentCheckOut) {
                                      setAttendanceData(prev => prev.map(d =>
                                        d.day === dayData.day ? { ...d, status: 'hadir', notes: '' } : d
                                      ))
                                    }
                                  }}
                                  className="h-9 text-sm text-center cursor-pointer"
                                  disabled={isLibur || !!(currentStatus && currentStatus !== 'hadir')}
                                />
                              )}
                            </>
                          )}
                        </td>
                        
                        {/* Absen - Jam Pulang */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : (
                            <>
                              {isEditing ? (
                                <Input
                                  type="time"
                                  value={editForm.checkOut}
                                  onChange={(e) => {
                                    setEditForm({ ...editForm, checkOut: e.target.value })
                                    // Auto-set status ke 'hadir' saat jam diisi
                                    if (e.target.value || editForm.checkIn) {
                                      setEditForm(prev => ({ ...prev, status: 'hadir', notes: '' }))
                                    }
                                  }}
                                  className="h-9 text-sm text-center cursor-pointer"
                                  disabled={isLibur || !!(editForm.status && editForm.status !== 'hadir')}
                                />
                              ) : (
                                <Input
                                  type="time"
                                  value={currentCheckOut}
                                  onChange={(e) => {
                                    setAttendanceData(prev => prev.map(d =>
                                      d.day === dayData.day ? { ...d, checkOut: e.target.value } : d
                                    ))
                                    // Auto-set status ke 'hadir' saat jam diisi
                                    if (e.target.value || currentCheckIn) {
                                      setAttendanceData(prev => prev.map(d =>
                                        d.day === dayData.day ? { ...d, status: 'hadir', notes: '' } : d
                                      ))
                                    }
                                  }}
                                  className="h-9 text-sm text-center cursor-pointer"
                                  disabled={isLibur || !!(currentStatus && currentStatus !== 'hadir')}
                                />
                              )}
                            </>
                          )}
                        </td>
                        
                        {/* Kehadiran - Hadir */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : (
                            <>
                              {isEditing ? (
                                <input
                                  type="radio"
                                  name={`status-${dayData.day}`}
                                  checked={editForm.status === 'hadir'}
                                  onChange={() => setEditForm({ ...editForm, status: 'hadir', notes: '' })}
                                  disabled={isLibur || !editForm.checkIn || !editForm.checkOut}
                                  className="w-4 h-4"
                                />
                              ) : (
                                <input
                                  type="radio"
                                  name={`status-${dayData.day}`}
                                  checked={currentStatus === 'hadir'}
                                  onChange={() => {
                                    setAttendanceData(prev => prev.map(d => 
                                      d.day === dayData.day ? { ...d, status: 'hadir', notes: '' } : d
                                    ))
                                  }}
                                  disabled={isLibur || !currentCheckIn || !currentCheckOut}
                                  className="w-4 h-4"
                                />
                              )}
                            </>
                          )}
                        </td>
                        
                        {/* Kehadiran - Sakit */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : (
                            <>
                              {isEditing ? (
                                <input
                                  type="radio"
                                  name={`status-${dayData.day}`}
                                  checked={editForm.status === 'sakit'}
                                  onChange={() => setEditForm({ ...editForm, status: 'sakit', checkIn: '', checkOut: '', notes: '' })}
                                  disabled={isLibur || !!editForm.checkIn || !!editForm.checkOut}
                                  className="w-4 h-4"
                                />
                              ) : (
                                <input
                                  type="radio"
                                  name={`status-${dayData.day}`}
                                  checked={currentStatus === 'sakit'}
                                  onChange={() => {
                                    setAttendanceData(prev => prev.map(d => 
                                      d.day === dayData.day ? { ...d, status: 'sakit', checkIn: '', checkOut: '', notes: '' } : d
                                    ))
                                  }}
                                  disabled={isLibur || !!currentCheckIn || !!currentCheckOut}
                                  className="w-4 h-4"
                                />
                              )}
                            </>
                          )}
                        </td>
                        
                        {/* Kehadiran - Izin */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : (
                            <>
                              {isEditing ? (
                                <input
                                  type="radio"
                                  name={`status-${dayData.day}`}
                                  checked={editForm.status === 'izin'}
                                  onChange={() => setEditForm({ ...editForm, status: 'izin', checkIn: '', checkOut: '' })}
                                  disabled={isLibur || !!editForm.checkIn || !!editForm.checkOut}
                                  className="w-4 h-4"
                                />
                              ) : (
                                <input
                                  type="radio"
                                  name={`status-${dayData.day}`}
                                  checked={currentStatus === 'izin'}
                                  onChange={() => {
                                    setAttendanceData(prev => prev.map(d => 
                                      d.day === dayData.day ? { ...d, status: 'izin', checkIn: '', checkOut: '' } : d
                                    ))
                                  }}
                                  disabled={isLibur || !!currentCheckIn || !!currentCheckOut}
                                  className="w-4 h-4"
                                />
                              )}
                            </>
                          )}
                        </td>
                        
                        {/* Kehadiran - Alpa */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : (
                            <>
                              {isEditing ? (
                                <input
                                  type="radio"
                                  name={`status-${dayData.day}`}
                                  checked={editForm.status === 'alpha'}
                                  onChange={() => setEditForm({ ...editForm, status: 'alpha', checkIn: '', checkOut: '' })}
                                  disabled={isLibur || !!editForm.checkIn || !!editForm.checkOut}
                                  className="w-4 h-4"
                                />
                              ) : (
                                <input
                                  type="radio"
                                  name={`status-${dayData.day}`}
                                  checked={currentStatus === 'alpha'}
                                  onChange={() => {
                                    setAttendanceData(prev => prev.map(d => 
                                      d.day === dayData.day ? { ...d, status: 'alpha', checkIn: '', checkOut: '' } : d
                                    ))
                                  }}
                                  disabled={isLibur || !!currentCheckIn || !!currentCheckOut}
                                  className="w-4 h-4"
                                />
                              )}
                            </>
                          )}
                        </td>
                        
                        {/* Keterangan */}
                        <td className="p-1 text-center border border-gray-200">
                          {dayData.isWeekend && !isEditing ? (
                            <Input
                              value=""
                              readOnly
                              className="h-9 text-sm"
                              disabled={true}
                            />
                          ) : isLibur ? (
                            // LIBUR (manual) - aktif untuk input keterangan libur
                            <>
                              {isEditing ? (
                                <Input
                                  value={editForm.notes}
                                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                  className="h-9 text-sm"
                                  placeholder="Keterangan libur"
                                />
                              ) : (
                                <Input
                                  value={currentNotes}
                                  onChange={(e) => {
                                    setAttendanceData(prev => prev.map(d =>
                                      d.day === dayData.day ? { ...d, notes: e.target.value } : d
                                    ))
                                  }}
                                  className="h-9 text-sm"
                                  placeholder="Keterangan libur"
                                />
                              )}
                            </>
                          ) : (
                            // Hari kerja biasa - aktif hanya jika status izin/alpha
                            <>
                              {isEditing ? (
                                <Input
                                  value={editForm.notes}
                                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                  className="h-9 text-sm"
                                  placeholder={currentStatus === 'izin' ? 'Alasan izin' : currentStatus === 'alpha' ? 'Alasan alpha' : 'Keterangan'}
                                  disabled={currentStatus !== 'izin' && currentStatus !== 'alpha'}
                                />
                              ) : (
                                <Input
                                  value={currentNotes}
                                  onChange={(e) => {
                                    setAttendanceData(prev => prev.map(d =>
                                      d.day === dayData.day ? { ...d, notes: e.target.value } : d
                                    ))
                                  }}
                                  className="h-9 text-sm"
                                  placeholder={currentStatus === 'izin' ? 'Alasan izin' : currentStatus === 'alpha' ? 'Alasan alpha' : 'Keterangan'}
                                  disabled={currentStatus !== 'izin' && currentStatus !== 'alpha'}
                                />
                              )}
                            </>
                          )}
                        </td>
                        
                        {/* Aksi */}
                        <td className="p-1 text-center border border-gray-200">
                          {isEditing ? (
                            <div className="flex gap-1 justify-center">
                              <Button
                                size="sm"
                                onClick={handleUpdateDay}
                                className="h-9 w-9 p-0"
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                                className="h-9 w-9 p-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditDay(dayData.day)}
                              className="h-9 w-9 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Cara Menggunakan:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Pada awal buka halaman, semua tanggal bisa diisi langsung (mode edit)</li>
              <li>Kolom <strong>Status</strong> memungkinkan mengubah hari kerja menjadi LIBUR atau sebaliknya</li>
              <li>Saat status <strong>LIBUR</strong>: jam masuk/pulang dan status kehadiran tidak aktif, keterangan aktif untuk input alasan libur</li>
              <li><strong>Sabtu/Minggu = LIBUR</strong> otomatis, keterangan tidak aktif</li>
              <li>Setelah selesai mengisi beberapa tanggal, klik <strong>Simpan Perubahan</strong> di atas</li>
              <li>Setelah disimpan, semua tanggal menjadi read-only</li>
              <li>Jika ingin mengubah, klik tombol <strong>Edit</strong> di tanggal yang diinginkan</li>
              <li>Klik <strong>X</strong> untuk batal edit per tanggal</li>
              <li>Klik <strong>Reset</strong> untuk mengembalikan semua perubahan ke data terakhir yang disimpan</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

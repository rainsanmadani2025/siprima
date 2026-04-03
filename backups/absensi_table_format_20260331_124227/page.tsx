'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, CheckCircle2, AlertCircle, FileText, Loader2, Edit, X, Save } from 'lucide-react'
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
  status: 'hadir' | 'sakit' | 'izin' | 'alpha' | 'libur' | ''
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Edit mode per tanggal
  const [editingDay, setEditingDay] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<{ checkIn: string; checkOut: string; status: string; notes: string }>({
    checkIn: '',
    checkOut: '',
    status: '',
    notes: ''
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
      const response = await fetch(`/api/guru/attendance/month?month=${selectedMonth}`)
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
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const handleEditDay = (day: DayAttendance) => {
    setEditingDay(day.day)
    setEditForm({
      checkIn: day.checkIn || '',
      checkOut: day.checkOut || '',
      status: day.status || '',
      notes: day.notes || ''
    })
  }

  const handleCancelEdit = () => {
    setEditingDay(null)
    setEditForm({ checkIn: '', checkOut: '', status: '', notes: '' })
  }

  const handleSaveDay = async () => {
    if (!selectedStudent || editingDay === null) return

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

    try {
      setSaving(true)
      const response = await fetch('/api/guru/attendance/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: selectedMonth,
          attendances: [
            {
              studentId: selectedStudent.id,
              date: `${year}-${String(month).padStart(2, '0')}-${String(editingDay).padStart(2, '0')}`,
              status: editForm.status || 'hadir',
              notes: editForm.notes || '',
              checkIn: editForm.checkIn || '',
              checkOut: editForm.checkOut || ''
            }
          ]
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Data absensi berhasil disimpan"
        })
        // Refresh data
        fetchAttendanceForStudent(selectedStudent.id)
        setEditingDay(null)
        setEditForm({ checkIn: '', checkOut: '', status: '', notes: '' })
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

  const formatMonthDisplay = (monthString: string) => {
    const [year, monthNum] = monthString.split('-')
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    return `${months[parseInt(monthNum) - 1]} ${year}`
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

        {/* Pilih Siswa dan Bulan */}
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

        {/* Info Siswa yang Dipilih */}
        {selectedStudent && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Nama Siswa :</span>
                  <span className="ml-2">{'.'.repeat(50)}</span>
                </div>
                <div>
                  <span className="font-medium">NISN :</span>
                  <span className="ml-2">{'.'.repeat(50)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                <div>
                  <span className="font-medium">{selectedStudent.name}</span>
                </div>
                <div>
                  <span>{selectedStudent.nisn || '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabel Absensi */}
        {selectedStudent && (
          <Card>
            <CardHeader>
              <CardTitle>Tabel Absensi - {formatMonthDisplay(selectedMonth)}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-400">
                    <th className="p-2 text-center border border-gray-300 w-16">No.</th>
                    <th className="p-2 text-center border border-gray-300 w-32">Tanggal</th>
                    <th className="p-2 text-center border border-gray-300 w-24" colSpan={2}>Absen</th>
                    <th className="p-2 text-center border border-gray-300" colSpan={4}>Kehadiran</th>
                    <th className="p-2 text-center border border-gray-300 w-48">Keterangan</th>
                    <th className="p-2 text-center border border-gray-300 w-24">Aksi</th>
                  </tr>
                  <tr className="border-b border-gray-400 bg-muted/50">
                    <th></th>
                    <th></th>
                    <th className="p-1 text-center border border-gray-300 text-xs">Masuk</th>
                    <th className="p-1 text-center border border-gray-300 text-xs">Pulang</th>
                    <th className="p-1 text-center border border-gray-300 text-xs">Hadir</th>
                    <th className="p-1 text-center border border-gray-300 text-xs">Sakit</th>
                    <th className="p-1 text-center border border-gray-300 text-xs">Izin</th>
                    <th className="p-1 text-center border border-gray-300 text-xs">Alpa</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((dayData) => {
                    const isEditing = editingDay === dayData.day
                    const isLibur = dayData.isWeekend || dayData.isHoliday
                    
                    // Tentukan status berdasarkan edit form atau data yang ada
                    const currentStatus = isEditing ? editForm.status : dayData.status
                    const currentCheckIn = isEditing ? editForm.checkIn : dayData.checkIn
                    const currentCheckOut = isEditing ? editForm.checkOut : dayData.checkOut
                    const currentNotes = isEditing ? editForm.notes : dayData.notes

                    return (
                      <tr key={dayData.day} className="border-b border-gray-200 hover:bg-muted/30">
                        <td className="p-2 text-center border border-gray-200">{dayData.day}.</td>
                        <td className="p-2 text-center border border-gray-200 text-sm">
                          {formatDateDisplay(dayData.date)}
                        </td>
                        
                        {/* Absen - Jam Masuk */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : isEditing ? (
                            <Input
                              type="time"
                              value={editForm.checkIn}
                              onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
                              className="h-8 text-xs text-center"
                              disabled={currentStatus !== 'hadir'}
                            />
                          ) : (
                            <span className={currentCheckIn ? 'text-sm font-medium' : 'text-gray-400'}>
                              {currentCheckIn || '-'}
                            </span>
                          )}
                        </td>
                        
                        {/* Absen - Jam Pulang */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : isEditing ? (
                            <Input
                              type="time"
                              value={editForm.checkOut}
                              onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
                              className="h-8 text-xs text-center"
                              disabled={currentStatus !== 'hadir'}
                            />
                          ) : (
                            <span className={currentCheckOut ? 'text-sm font-medium' : 'text-gray-400'}>
                              {currentCheckOut || '-'}
                            </span>
                          )}
                        </td>
                        
                        {/* Kehadiran - Hadir */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : isEditing ? (
                            <input
                              type="radio"
                              name={`status-${dayData.day}`}
                              checked={editForm.status === 'hadir'}
                              onChange={() => setEditForm({ ...editForm, status: 'hadir', notes: '' })}
                              disabled={!editForm.checkIn || !editForm.checkOut}
                              className="w-4 h-4"
                            />
                          ) : (
                            <span className="text-xl">{currentStatus === 'hadir' ? '✅' : '-'}</span>
                          )}
                        </td>
                        
                        {/* Kehadiran - Sakit */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : isEditing ? (
                            <input
                              type="radio"
                              name={`status-${dayData.day}`}
                              checked={editForm.status === 'sakit'}
                              onChange={() => setEditForm({ ...editForm, status: 'sakit', checkIn: '', checkOut: '', notes: '' })}
                              disabled={!!editForm.checkIn || !!editForm.checkOut}
                              className="w-4 h-4"
                            />
                          ) : (
                            <span className="text-xl">{currentStatus === 'sakit' ? '✅' : '-'}</span>
                          )}
                        </td>
                        
                        {/* Kehadiran - Izin */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : isEditing ? (
                            <input
                              type="radio"
                              name={`status-${dayData.day}`}
                              checked={editForm.status === 'izin'}
                              onChange={() => setEditForm({ ...editForm, status: 'izin', checkIn: '', checkOut: '' })}
                              disabled={!!editForm.checkIn || !!editForm.checkOut}
                              className="w-4 h-4"
                            />
                          ) : (
                            <span className="text-xl">{currentStatus === 'izin' ? '✅' : '-'}</span>
                          )}
                        </td>
                        
                        {/* Kehadiran - Alpa */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">-</span>
                          ) : isEditing ? (
                            <input
                              type="radio"
                              name={`status-${dayData.day}`}
                              checked={editForm.status === 'alpha'}
                              onChange={() => setEditForm({ ...editForm, status: 'alpha', checkIn: '', checkOut: '' })}
                              disabled={!!editForm.checkIn || !!editForm.checkOut}
                              className="w-4 h-4"
                            />
                          ) : (
                            <span className="text-xl">{currentStatus === 'alpha' ? '✅' : '-'}</span>
                          )}
                        </td>
                        
                        {/* Keterangan */}
                        <td className="p-1 text-center border border-gray-200">
                          {isLibur && !isEditing ? (
                            <span className="text-red-600 font-bold">LIBUR</span>
                          ) : isEditing ? (
                            <Input
                              value={editForm.notes}
                              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                              className="h-8 text-xs"
                              placeholder={currentStatus === 'izin' ? 'Alasan izin' : currentStatus === 'alpha' ? 'Alasan alpha' : 'Keterangan'}
                              disabled={currentStatus !== 'izin' && currentStatus !== 'alpha'}
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground max-w-32 truncate block">
                              {currentNotes || '-'}
                            </span>
                          )}
                        </td>
                        
                        {/* Aksi */}
                        <td className="p-1 text-center border border-gray-200">
                          {isEditing ? (
                            <div className="flex gap-1 justify-center">
                              <Button
                                size="sm"
                                onClick={handleSaveDay}
                                disabled={saving}
                                className="h-8 w-8 p-0"
                              >
                                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditDay(dayData)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3 h-3" />
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
              <li>Klik tombol <strong>Edit</strong> di setiap baris tanggal untuk mengubah absensi</li>
              <li><strong>Hadir</strong>: Isi jam masuk dan pulang (wajib keduanya)</li>
              <li><strong>Sakit</strong>: Pilih radio Sakit (jam akan otomatis kosong)</li>
              <li><strong>Izin/Alpha</strong>: Pilih radio Izin/Alpha dan isi keterangan (wajib)</li>
              <li><strong>LIBUR</strong>: Sabtu dan Minggu otomatis LIBUR, tapi tetap bisa diedit</li>
              <li>Klik <strong>Simpan</strong> untuk menyimpan perubahan, <strong>X</strong> untuk batal</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

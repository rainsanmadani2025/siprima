'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, CheckCircle2, AlertCircle, FileText, Loader2, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Student {
  id: string
  name: string
  nis: string
  className: string
}

interface TimeRecord {
  studentId: string
  date: string
  checkIn?: string
  checkOut?: string
  status: 'hadir' | 'sakit' | 'izin' | 'alpha'
  notes?: string
}

export default function GuruAbsensiPage() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // State untuk form input
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [status, setStatus] = useState<'hadir' | 'sakit' | 'izin' | 'alpha'>('hadir')
  const [notes, setNotes] = useState('')

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
      if (!userId) {
        console.warn('[Students] No userId found')
        return
      }

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
      toast({
        title: "Error",
        description: "Gagal memuat data siswa",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendanceForStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/guru/attendance/month?month=${selectedMonth}`)
      const data = await response.json()
      if (data.success && data.attendance) {
        const studentRecords = data.attendance
          .filter((a: any) => a.studentId === studentId)
          .map((a: any) => ({
            studentId: a.studentId,
            date: a.date,
            status: a.status,
            notes: a.notes
          }))
        setTimeRecords(studentRecords)
      } else {
        setTimeRecords([])
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const handleSaveAttendance = async () => {
    if (!selectedStudent) return

    if (status === 'hadir' && (!checkIn || !checkOut)) {
      toast({
        title: "Error",
        description: "Untuk status Hadir, jam masuk dan pulang harus diisi",
        variant: "destructive"
      })
      return
    }

    if (status !== 'hadir' && !notes) {
      toast({
        title: "Error",
        description: "Keterangan wajib diisi untuk status Sakit, Izin, atau Alpha",
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
              date: selectedMonth + '-01',
              status,
              notes,
              checkIn,
              checkOut
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
        // Reset form
        setCheckIn('')
        setCheckOut('')
        setStatus('hadir')
        setNotes('')
        // Refresh data
        fetchAttendanceForStudent(selectedStudent.id)
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

  // Calculate statistics
  const stats = {
    hadir: timeRecords.filter(r => r.status === 'hadir').length,
    sakit: timeRecords.filter(r => r.status === 'sakit').length,
    izin: timeRecords.filter(r => r.status === 'izin').length,
    alpha: timeRecords.filter(r => r.status === 'alpha').length
  }

  const total = timeRecords.length
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

        {/* Statistik Absensi - Di atas card pilih siswa */}
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

        {/* Pilih Siswa - Filter bulan dan tombol simpan sejajar */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <CardTitle>Pilih Siswa</CardTitle>
                <CardDescription>
                  Pilih siswa untuk menginput absensi
                </CardDescription>
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
                <Button onClick={handleSaveAttendance} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Absensi
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
                <SelectTrigger className="w-full">
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

        {/* Cara Menggunakan - Di dalam card pilih siswa (sebagai card description) */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Cara Menggunakan:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Pilih siswa dari dropdown di atas</li>
              <li>Untuk status <strong>Hadir</strong>: Isi jam masuk dan jam pulang</li>
              <li>Untuk status <strong>Sakit/Izin/Alpha</strong>: Isi keterangan</li>
              <li>Status Hadir akan auto-set saat jam diisi</li>
              <li>Status Sakit/Izin/Alpha akan di-disable saat ada jam</li>
              <li>Klik tombol X untuk menghapus jam masuk/pulang</li>
              <li>Klik "Simpan Absensi" untuk menyimpan data</li>
            </ul>
          </CardContent>
        </Card>

        {/* Input Absensi */}
        {selectedStudent && (
          <Card>
            <CardHeader>
              <CardTitle>Input Absensi - {selectedStudent.name}</CardTitle>
              <CardDescription>
                Bulan: {formatMonthDisplay(selectedMonth)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Jam Masuk & Pulang */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Jam Masuk</Label>
                  <div className="flex gap-2">
                    <Input
                      id="checkIn"
                      type="time"
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value)
                        // Auto-set status ke 'hadir' saat jam diisi
                        if (e.target.value || checkOut) {
                          setStatus('hadir')
                        }
                      }}
                      disabled={status !== 'hadir'}
                    />
                    {checkIn && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCheckIn('')
                          if (!checkOut) setStatus('hadir')
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkOut">Jam Pulang</Label>
                  <div className="flex gap-2">
                    <Input
                      id="checkOut"
                      type="time"
                      value={checkOut}
                      onChange={(e) => {
                        setCheckOut(e.target.value)
                        // Auto-set status ke 'hadir' saat jam diisi
                        if (e.target.value || checkIn) {
                          setStatus('hadir')
                        }
                      }}
                      disabled={status !== 'hadir'}
                    />
                    {checkOut && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCheckOut('')
                          if (!checkIn) setStatus('hadir')
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="hadir"
                      checked={status === 'hadir'}
                      onChange={() => setStatus('hadir')}
                      disabled={!checkIn && !checkOut}
                      className="w-4 h-4"
                    />
                    <span>Hadir</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="sakit"
                      checked={status === 'sakit'}
                      onChange={() => {
                        setStatus('sakit')
                        setCheckIn('')
                        setCheckOut('')
                      }}
                      disabled={!!checkIn || !!checkOut}
                      className="w-4 h-4"
                    />
                    <span>Sakit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="izin"
                      checked={status === 'izin'}
                      onChange={() => {
                        setStatus('izin')
                        setCheckIn('')
                        setCheckOut('')
                      }}
                      disabled={!!checkIn || !!checkOut}
                      className="w-4 h-4"
                    />
                    <span>Izin</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="alpha"
                      checked={status === 'alpha'}
                      onChange={() => {
                        setStatus('alpha')
                        setCheckIn('')
                        setCheckOut('')
                      }}
                      disabled={!!checkIn || !!checkOut}
                      className="w-4 h-4"
                    />
                    <span>Alpha</span>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {status === 'hadir' && (!checkIn || !checkOut) && 'Radio Hadir disabled - isi jam masuk dan pulang'}
                  {(status === 'sakit' || status === 'izin' || status === 'alpha') && (checkIn || checkOut) && 'Radio status disabled - hapus jam terlebih dahulu'}
                </p>
              </div>

              {/* Keterangan - Hanya aktif untuk izin dan alpha */}
              <div className="space-y-2">
                <Label htmlFor="notes">
                  Keterangan {status === 'izin' || status === 'alpha' ? '*' : '(Opsional)'}
                </Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={status === 'izin' ? 'Contoh: Ada acara keluarga' : status === 'alpha' ? 'Contoh: Tanpa keterangan' : 'Keterangan tambahan (opsional)'}
                  disabled={status === 'hadir' || status === 'sakit'}
                />
                <p className="text-xs text-muted-foreground">
                  {status === 'hadir' || status === 'sakit' ? 'Field keterangan hanya aktif untuk status Izin dan Alpha' : ''}
                </p>
              </div>

              {/* Riwayat Absensi Bulan Ini */}
              <div className="space-y-2">
                <Label>Riwayat Absensi Bulan Ini</Label>
                {timeRecords.length > 0 ? (
                  <div className="space-y-2">
                    {timeRecords.map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <span className="font-medium">{record.date}</span>
                          <span className="ml-3 text-sm">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              record.status === 'hadir' ? 'bg-green-100 text-green-800' :
                              record.status === 'sakit' ? 'bg-orange-100 text-orange-800' :
                              record.status === 'izin' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {record.status.toUpperCase()}
                            </span>
                          </span>
                          {record.notes && (
                            <span className="ml-3 text-sm text-muted-foreground">- {record.notes}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Belum ada data absensi untuk bulan ini</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Download,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface Attendance {
  id: string
  date: string
  status: string
  notes: string | null
  checkInTime: string | null
  checkOutTime: string | null
}

interface Student {
  id: string
  name: string
  nis: string
}

export default function AbsensiPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedYear, setSelectedYear] = useState<string>('2025')
  const [loading, setLoading] = useState(true)
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [student, setStudent] = useState<Student | null>(null)

  // Demo student ID (in real app, this would come from authenticated user's children)
  const studentId = 'demo-student-id'

  useEffect(() => {
    fetchStudentData()
    fetchAttendanceData()
  }, [selectedYear])

  const fetchStudentData = async () => {
    try {
      // In a real app, you'd fetch the logged-in parent's children
      // For now, using a demo student
      const response = await fetch('/api/students')
      const data = await response.json()
      if (data.students && data.students.length > 0) {
        setStudent(data.students[0])
      }
    } catch (error) {
      console.error('Error fetching student data:', error)
    }
  }

  const fetchAttendanceData = async () => {
    setLoading(true)
    try {
      // Fetch attendance for the selected year
      const response = await fetch(`/api/student-attendance?studentId=${studentId}`)
      const data = await response.json()

      if (data.success && data.data) {
        // Filter by selected year
        const filteredData = data.data.filter((attendance: Attendance) =>
          attendance.date.startsWith(selectedYear)
        )
        setAttendances(filteredData)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data absensi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const hadir = attendances.filter(a => a.status === 'hadir').length
    const sakit = attendances.filter(a => a.status === 'sakit').length
    const izin = attendances.filter(a => a.status === 'izin').length
    const alpa = attendances.filter(a => a.status === 'alpha').length
    const total = hadir + sakit + izin + alpa

    return {
      totalHadir: hadir,
      totalSakit: sakit,
      totalIzin: izin,
      totalAlpa: alpa,
      total: total,
      persentaseHadir: total > 0 ? ((hadir / total) * 100).toFixed(1) : '0',
      persentaseSakit: total > 0 ? ((sakit / total) * 100).toFixed(1) : '0',
      persentaseIzin: total > 0 ? ((izin / total) * 100).toFixed(1) : '0',
      persentaseAlpa: total > 0 ? ((alpa / total) * 100).toFixed(1) : '0',
    }
  }

  const stats = calculateStats()

  const getMonthlyData = () => {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]

    const monthlyStats: Record<string, { hadir: number; sakit: number; izin: number; alpa: number; total: number }> = {}

    attendances.forEach(attendance => {
      const month = attendance.date.substring(5, 7) // MM
      const monthKey = `${parseInt(month) - 1}` // 0-indexed

      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { hadir: 0, sakit: 0, izin: 0, alpa: 0, total: 0 }
      }

      monthlyStats[monthKey][attendance.status as keyof typeof monthlyStats[0]]++
      monthlyStats[monthKey].total++
    })

    return Object.entries(monthlyStats)
      .map(([monthIndex, data]) => ({
        bulan: `${monthNames[parseInt(monthIndex)]} ${selectedYear}`,
        hadir: data.hadir,
        sakit: data.sakit,
        izin: data.izin,
        alpa: data.alpa,
        persentase: data.total > 0 ? ((data.hadir / data.total) * 100).toFixed(0) : '0'
      }))
      .reverse() // Show most recent months first
  }

  const monthlyData = getMonthlyData()

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    return `${dayName}, ${day} ${month} ${year}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hadir':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Hadir</Badge>
      case 'sakit':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Sakit</Badge>
      case 'izin':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Izin</Badge>
      case 'alpha':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Alpa</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case 'sakit':
        return <XCircle className="w-5 h-5 text-yellow-600" />
      case 'izin':
        return <AlertCircle className="w-5 h-5 text-blue-600" />
      case 'alpha':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Absensi Anak</h1>
          <p className="text-gray-600 mt-1">
            {student ? `Riwayat kehadiran ${student.name}` : 'Riwayat kehadiran dan rekap bulanan'}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/ortu')}
            className="mt-4 gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Laporan
        </Button>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-5 md:p-7">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-emerald-100 text-sm md:text-base font-semibold">Total Hadir</p>
                <p className="text-3xl md:text-4xl lg:text-3xl font-bold mt-2">{stats.totalHadir}</p>
                <p className="text-emerald-100 text-sm md:text-base mt-2">{stats.persentaseHadir}%</p>
              </div>
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-200 flex-shrink-0 ml-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0">
          <CardContent className="p-5 md:p-7">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-yellow-100 text-sm md:text-base font-semibold">Total Sakit</p>
                <p className="text-3xl md:text-4xl lg:text-3xl font-bold mt-2">{stats.totalSakit}</p>
                <p className="text-yellow-100 text-sm md:text-base mt-2">{stats.persentaseSakit}%</p>
              </div>
              <XCircle className="w-10 h-10 md:w-12 md:h-12 text-yellow-200 flex-shrink-0 ml-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-5 md:p-7">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-blue-100 text-sm md:text-base font-semibold">Total Izin</p>
                <p className="text-3xl md:text-4xl lg:text-3xl font-bold mt-2">{stats.totalIzin}</p>
                <p className="text-blue-100 text-sm md:text-base mt-2">{stats.persentaseIzin}%</p>
              </div>
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-blue-200 flex-shrink-0 ml-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500 to-pink-500 text-white border-0">
          <CardContent className="p-5 md:p-7">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-rose-100 text-sm md:text-base font-semibold">Total Alpa</p>
                <p className="text-3xl md:text-4xl lg:text-3xl font-bold mt-2">{stats.totalAlpa}</p>
                <p className="text-rose-100 text-sm md:text-base mt-2">{stats.persentaseAlpa}%</p>
              </div>
              <XCircle className="w-10 h-10 md:w-12 md:h-12 text-rose-200 flex-shrink-0 ml-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Absensi Harian */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            Absensi Harian
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {attendances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada data absensi untuk tahun {selectedYear}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Keterangan</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Jam Masuk</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Jam Pulang</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((absen) => (
                    <tr key={absen.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">{formatDateDisplay(absen.date)}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(absen.status)}
                          {getStatusBadge(absen.status)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{absen.notes || '-'}</td>
                      <td className="py-4 px-4 text-center text-gray-600">{absen.checkInTime || '-'}</td>
                      <td className="py-4 px-4 text-center text-gray-600">{absen.checkOutTime || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rekap Bulanan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-teal-600" />
              Rekap Absensi Bulanan
            </CardTitle>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">Tahun 2025</SelectItem>
                <SelectItem value="2024">Tahun 2024</SelectItem>
                <SelectItem value="2023">Tahun 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {monthlyData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada data absensi untuk tahun {selectedYear}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Bulan</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Hadir</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Sakit</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Izin</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Alpa</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((rekap, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">{rekap.bulan}</td>
                      <td className="py-4 px-4 text-center">
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                          {rekap.hadir}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                          {rekap.sakit}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          {rekap.izin}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                          {rekap.alpa}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                parseFloat(rekap.persentase) >= 95 ? 'bg-emerald-500' :
                                parseFloat(rekap.persentase) >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${rekap.persentase}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{rekap.persentase}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Catatan Penting */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Catatan Penting</p>
              <p className="text-amber-800 text-sm mt-1">
                Data absensi di atas diinput oleh guru setiap hari. Jika ada ketidaksesuaian, silakan hubungi guru atau sekolah melalui menu Komunikasi.
                Anak diharapkan hadir minimal 90% dalam satu semester untuk mendapatkan raport lengkap.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  )
}

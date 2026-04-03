'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import {
  Download,
  Printer,
  FileText,
  Star,
  TrendingUp,
  Award,
  MessageSquare,
  Heart,
  User,
  Brain,
  MessageCircle,
  Users,
  Palette,
  ArrowLeft,
  RefreshCw
} from 'lucide-react'
import { io, Socket } from 'socket.io-client'

interface StudentReport {
  id: string
  studentId: string
  semester: string
  academicYear: string
  assessments: string // JSON
  teacherNotes?: string | null
  parentSuggestion?: string | null
  activities: string // JSON array
  status: string
  generatedAt: string
  student: {
    id: string
    name: string
    nis: string
  }
}

interface Assessment {
  aspek: string
  nilai: string
  icon: string
}

interface Attendance {
  totalHadir: number
  totalSakit: number
  totalIzin: number
  totalAlpa: number
  persentaseHadir: number
}

export default function RaportPage() {
  const router = useRouter()
  const [reports, setReports] = useState<StudentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<string>('genap-2024-2025')
  const [socket, setSocket] = useState<Socket | null>(null)

  // Student ID yang sedang login (hardcoded untuk demo)
  const studentId = 'student-1'

  // Fetch reports from API
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/student-reports?studentId=${studentId}`)
      const data = await response.json()
      setReports(data.reports || [])
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }, [studentId])

  // Initialize WebSocket
  useEffect(() => {
    const socketInstance = io('/', {
      query: { XTransformPort: 3003 },
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('Connected to chat service for reports')
      socketInstance.emit('user:join', {
        userId: 'user-parent-1',
        role: 'ORTU',
        name: 'Bapak Ahmad Fauzi'
      })
    })

    // Listen for new report
    socketInstance.on('report:new', (data) => {
      console.log('New report received:', data)
      if (data.studentId === studentId) {
        fetchReports()
      }
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [fetchReports, studentId])

  // Initial fetch
  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const getNilaiBadge = (nilai: string) => {
    switch (nilai) {
      case 'BB':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">BB</Badge>
      case 'MB':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">MB</Badge>
      case 'BSH':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">BSH</Badge>
      case 'BSB':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">BSB</Badge>
      default:
        return <Badge>{nilai}</Badge>
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-5 h-5 text-emerald-600" />
      case 'User': return <User className="w-5 h-5 text-blue-600" />
      case 'Brain': return <Brain className="w-5 h-5 text-purple-600" />
      case 'MessageCircle': return <MessageCircle className="w-5 h-5 text-orange-600" />
      case 'Users': return <Users className="w-5 h-5 text-pink-600" />
      case 'Palette': return <Palette className="w-5 h-5 text-teal-600" />
      default: return <Star className="w-5 h-5 text-amber-600" />
    }
  }

  const getCurrentReport = () => {
    return reports.find(r => `${r.semester}-${r.academicYear}` === selectedReport)
  }

  const currentReport = getCurrentReport()

  // Parse assessments from JSON
  const parseAssessments = (): Assessment[] => {
    if (!currentReport?.assessments) return []
    try {
      const parsed = JSON.parse(currentReport.assessments)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  // Parse activities from JSON
  const parseActivities = () => {
    if (!currentReport?.activities) return []
    try {
      const parsed = JSON.parse(currentReport.activities)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  // Parse suggestions
  const parseSuggestions = (): string[] => {
    if (!currentReport?.parentSuggestion) return []
    try {
      const parsed = JSON.parse(currentReport.parentSuggestion)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return currentReport.parentSuggestion ? [currentReport.parentSuggestion] : []
    }
  }

  return (
    <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Perkembangan Anak</h1>
          <p className="text-gray-600 mt-1">Raport perkembangan dan hasil evaluasi semesteran</p>
        </div>

      {/* Pilihan Semester */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Pilih Raport</label>
              <Select
                value={selectedReport}
                onValueChange={setSelectedReport}
                disabled={loading || reports.length === 0}
              >
                <SelectTrigger className="w-64 mt-1">
                  <SelectValue placeholder="Pilih raport" />
                </SelectTrigger>
                <SelectContent>
                  {reports.map((report) => (
                    <SelectItem key={`${report.semester}-${report.academicYear}`} value={`${report.semester}-${report.academicYear}`}>
                      {report.semester === 'ganjil' ? 'Semester Ganjil' : 'Semester Genap'} {report.academicYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {currentReport && (
              <div className="flex-1 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tahun Ajaran</p>
                    <p className="text-lg font-bold text-gray-900">{currentReport.academicYear}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Semester</p>
                    <p className="text-lg font-bold text-emerald-600">{currentReport.semester}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-12 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mr-2" />
            <span>Memuat data raport...</span>
          </CardContent>
        </Card>
      ) : !currentReport ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Raport</h3>
            <p className="text-gray-500">
              Raport untuk anak Anda belum tersedia. Silakan hubungi guru untuk informasi lebih lanjut.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Header Raport */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">RA INSAN MADANI</h2>
                <p className="text-emerald-100">Laporan Perkembangan Anak Didik</p>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-32 text-gray-600">Nama Anak</span>
                    <span className="font-medium text-gray-900">: {currentReport.student.name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600">NIS</span>
                    <span className="font-medium text-gray-900">: {currentReport.student.nis}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600">Status</span>
                    <span className="font-medium text-gray-900">: {currentReport.status === 'published' ? 'Sudah Dipublikasi' : 'Draft'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-32 text-gray-600">Semester</span>
                    <span className="font-medium text-gray-900">: {currentReport.semester}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600">Tahun Ajaran</span>
                    <span className="font-medium text-gray-900">: {currentReport.academicYear}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600">Tanggal Cetak</span>
                    <span className="font-medium text-gray-900">: {new Date(currentReport.generatedAt).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Penilaian Akhir */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" />
                Hasil Penilaian Akhir
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {parseAssessments().length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Aspek Perkembangan</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseAssessments().map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                                {getIconComponent(item.icon)}
                              </div>
                              <span className="font-medium text-gray-900">{item.aspek}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {getNilaiBadge(item.nilai)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Belum ada data penilaian</p>
                </div>
              )}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
                <p className="font-semibold text-blue-900 mb-1">Keterangan Nilai:</p>
                <div className="grid md:grid-cols-4 gap-2 text-blue-800">
                  <p><span className="font-bold">BB</span> = Belum Berkembang</p>
                  <p><span className="font-bold">MB</span> = Mulai Berkembang</p>
                  <p><span className="font-bold">BSH</span> = Berkembang Sesuai Harapan</p>
                  <p><span className="font-bold">BSB</span> = Berkembang Sangat Baik</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Catatan Guru */}
          {currentReport.teacherNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-teal-600" />
                  Catatan Guru
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{currentReport.teacherNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prestasi */}
          {parseActivities().filter((a: any) => a.jenis === 'prestasi' || a.jenis === 'penghargaan').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-500" />
                  Prestasi dan Penghargaan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-3">
                  {parseActivities()
                    .filter((a: any) => a.jenis === 'prestasi' || a.jenis === 'penghargaan')
                    .map((activity: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-1">
                            {activity.jenis === 'prestasi' ? 'Prestasi' : 'Penghargaan'}
                          </Badge>
                          <p className="font-medium text-gray-900">{activity.kegiatan || activity.nama}</p>
                          <p className="text-sm text-gray-600">{activity.tanggal}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saran untuk Orang Tua */}
          {parseSuggestions().length > 0 && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  Saran untuk Orang Tua
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <ul className="space-y-3">
                  {parseSuggestions().map((saran: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{saran}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Dokumentasi Kegiatan */}
          {parseActivities().filter((a: any) => a.jenis === 'foto').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Dokumentasi Kegiatan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {parseActivities()
                    .filter((a: any) => a.jenis === 'foto')
                    .map((activity: any, index: number) => (
                      <div key={index} className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                        <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center">
                          <FileText className="w-12 h-12 text-emerald-600" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white font-medium text-sm">{activity.kegiatan || activity.nama}</p>
                            <p className="text-white/80 text-xs">{activity.tanggal}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tanda Tangan */}
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-16">Mengetahui,</p>
                  <p className="font-bold text-gray-900">Orang Tua/Wali</p>
                  <p className="text-sm text-gray-600 mt-1">(................................)</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Jakarta, {new Date(currentReport.generatedAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                  <p className="text-sm text-gray-600 mb-16">Guru Kelas,</p>
                  <p className="font-bold text-gray-900">Ibu Siti Aminah, S.Pd</p>
                  <p className="text-sm text-gray-600 mt-1">NIP. 198505152010012001</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-16">Kepala Sekolah,</p>
                <p className="font-bold text-gray-900">Ibu Hj. Nurul Hidayah, M.Pd</p>
                <p className="text-sm text-gray-600 mt-1">NIP. 198003152008011004</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
    </DashboardLayout>
  )
}

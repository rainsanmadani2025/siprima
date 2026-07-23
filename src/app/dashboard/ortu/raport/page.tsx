'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import {
  Download,
  FileText,
  Star,
  Award,
  MessageSquare,
  Heart,
  User,
  Brain,
  MessageCircle,
  Users,
  Palette,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar
} from 'lucide-react'

interface ChildData {
  id: string
  name: string
  nis: string
  className: string | null
  reports: ReportData[]
}

interface ReportData {
  id: string
  semester: string
  academicYear: string
  assessments: string
  teacherNotes: string | null
  parentSuggestion: string | null
  activities: string
  status: string
  generatedAt: string
}

interface Assessment {
  aspek: string
  nilai: string
  icon: string
}

interface ApiResponse {
  success: boolean
  children: ChildData[]
}

export default function RaportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [children, setChildren] = useState<ChildData[]>([])
  const [selectedChildIdx, setSelectedChildIdx] = useState(0)
  const [selectedReportIdx, setSelectedReportIdx] = useState(0)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        setError(null)

        const userId = localStorage.getItem('userId')
        if (!userId) {
          setError('Sesi login tidak ditemukan. Silakan login kembali.')
          setLoading(false)
          return
        }

        const res = await fetch(`/api/parent/reports?userId=${encodeURIComponent(userId)}`)
        const data: ApiResponse = await res.json()

        if (data.success) {
          setChildren(data.children || [])
        } else {
          setError('Gagal memuat data raport.')
        }
      } catch (err) {
        console.error('Error:', err)
        setError('Terjadi kesalahan saat memuat data raport.')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const selectedChild = children[selectedChildIdx] || null
  const reports = selectedChild?.reports || []
  const currentReport = reports[selectedReportIdx] || null

  // Reset index saat data berubah
  useEffect(() => {
    if (selectedChildIdx >= children.length) setSelectedChildIdx(0)
    if (selectedReportIdx >= (children[selectedChildIdx]?.reports?.length || 0)) setSelectedReportIdx(0)
  }, [children, selectedChildIdx])

  const parseAssessments = (): Assessment[] => {
    if (!currentReport?.assessments) return []
    try {
      const parsed = JSON.parse(currentReport.assessments)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const parseActivities = (): any[] => {
    if (!currentReport?.activities) return []
    try {
      const parsed = JSON.parse(currentReport.activities)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const parseSuggestions = (): string[] => {
    if (!currentReport?.parentSuggestion) return []
    try {
      const parsed = JSON.parse(currentReport.parentSuggestion)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return currentReport.parentSuggestion ? [currentReport.parentSuggestion] : []
    }
  }

  const formatPeriodLabel = (semester: string, academicYear: string) => {
    const s = semester ? semester.charAt(0).toUpperCase() + semester.slice(1) : '-'
    const y = academicYear || '-'
    return `Semester ${s} — ${y}`
  }

  const getNilaiBadge = (nilai: string) => {
    switch (nilai) {
      case 'BB':
        return <Badge className="bg-red-100 text-red-800">BB</Badge>
      case 'MB':
        return <Badge className="bg-orange-100 text-orange-800">MB</Badge>
      case 'BSH':
        return <Badge className="bg-emerald-100 text-emerald-800">BSH</Badge>
      case 'BSB':
        return <Badge className="bg-blue-100 text-blue-800">BSB</Badge>
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

  if (loading) {
    return (
      <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laporan Perkembangan Anak</h1>
            <p className="text-gray-600 mt-1">Raport perkembangan dan hasil evaluasi semesteran</p>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <p className="text-lg font-medium text-red-600">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()} className="mt-6 gap-2">
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (children.length === 0) {
    return (
      <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laporan Perkembangan Anak</h1>
            <p className="text-gray-600 mt-1">Raport perkembangan dan hasil evaluasi semesteran</p>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Belum Ada Data Anak Terdaftar</p>
              <p className="text-sm text-muted-foreground mt-1">Data raport akan muncul setelah guru mempublikasikan raport</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Perkembangan Anak</h1>
          <p className="text-gray-600 mt-1">Raport perkembangan dan hasil evaluasi semesteran</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/ortu')}
            className="mt-4 gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
        </div>

        {/* Selector Anak & Raport */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-5">
            {/* Info Siswa */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                {selectedChild?.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedChild?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedChild?.nis && (
                    <Badge variant="outline">NIS: {selectedChild.nis}</Badge>
                  )}
                  {selectedChild?.className && (
                    <Badge variant="secondary">{selectedChild.className}</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-emerald-300 mb-4" />

            {/* Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Pilih Anak</label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <Select
                    value={String(selectedChildIdx)}
                    onValueChange={(val) => {
                      setSelectedChildIdx(Number(val))
                      setSelectedReportIdx(0)
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Pilih anak" />
                    </SelectTrigger>
                    <SelectContent>
                      {children.map((child, idx) => (
                        <SelectItem key={child.id} value={String(idx)}>
                          {child.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Pilih Raport</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <Select
                    value={String(selectedReportIdx)}
                    onValueChange={(val) => setSelectedReportIdx(Number(val))}
                    disabled={reports.length === 0}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Pilih raport" />
                    </SelectTrigger>
                    <SelectContent>
                      {reports.map((report, idx) => (
                        <SelectItem key={report.id} value={String(idx)}>
                          {formatPeriodLabel(report.semester, report.academicYear)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Raport Content */}
        {reports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Belum Ada Raport Tersedia</p>
              <p className="text-sm text-muted-foreground mt-1">
                Raport untuk {selectedChild?.name} belum dipublikasikan oleh guru. Silakan hubungi guru untuk informasi lebih lanjut.
              </p>
            </CardContent>
          </Card>
        ) : currentReport ? (
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
                      <span className="font-medium text-gray-900">: {selectedChild?.name}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">NIS</span>
                      <span className="font-medium text-gray-900">: {selectedChild?.nis}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Status</span>
                      <span className="font-medium text-gray-900">: {currentReport.status === 'published' ? 'Dipublikasi' : 'Draft'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-32 text-gray-600">Semester</span>
                      <span className="font-medium text-gray-900">: {currentReport.semester.charAt(0).toUpperCase() + currentReport.semester.slice(1)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Tahun Ajaran</span>
                      <span className="font-medium text-gray-900">: {currentReport.academicYear}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-600">Tanggal Publikasi</span>
                      <span className="font-medium text-gray-900">: {new Date(currentReport.generatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-blue-800">
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
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{currentReport.teacherNotes}</p>
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
                            <Badge className="bg-amber-100 text-amber-800 mb-1">
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
          </>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
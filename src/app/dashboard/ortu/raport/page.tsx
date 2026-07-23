'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import {
  FileText,
  User,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  Eye
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
  status: string
  generatedAt: string
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
  const [selectedReportId, setSelectedReportId] = useState<string>('')
  const [loadingPDF, setLoadingPDF] = useState(false)

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
          // Auto-select first report
          if (data.children.length > 0 && data.children[0].reports.length > 0) {
            setSelectedReportId(data.children[0].reports[0].id)
          }
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

  // Reset selection saat children berubah
  useEffect(() => {
    if (selectedChildIdx >= children.length) setSelectedChildIdx(0)
  }, [children])

  // Auto-select first report saat ganti anak
  useEffect(() => {
    const currentChild = children[selectedChildIdx]
    if (currentChild?.reports.length > 0) {
      setSelectedReportId(currentChild.reports[0].id)
    } else {
      setSelectedReportId('')
    }
  }, [selectedChildIdx])

  const selectedChild = children[selectedChildIdx] || null
  const reports = selectedChild?.reports || []

  const handleViewPDF = async () => {
    if (!selectedReportId) return

    try {
      setLoadingPDF(true)

      // Fetch PDF data
      const dataRes = await fetch(`/api/parent/raport-pdf-data?reportId=${selectedReportId}`)
      const dataResult = await dataRes.json()

      if (!dataResult.success) {
        alert(dataResult.error || 'Gagal memuat data raport')
        return
      }

      // Call the same PDF generation API as guru
      const pdfRes = await fetch('/api/raport/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataResult.data)
      })

      if (!pdfRes.ok) {
        const errData = await pdfRes.json()
        throw new Error(errData.error || 'Gagal membuat PDF')
      }

      const blob = await pdfRes.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (err: any) {
      console.error('Error:', err)
      alert(err.message || 'Gagal menampilkan raport')
    } finally {
      setLoadingPDF(false)
    }
  }

  const formatPeriodLabel = (semester: string, academicYear: string) => {
    const s = semester ? semester.charAt(0).toUpperCase() + semester.slice(1) : '-'
    return `Semester ${s} — ${academicYear}`
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

        {/* Selector */}
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
                  {selectedChild?.nis && <Badge variant="outline">NIS: {selectedChild.nis}</Badge>}
                  {selectedChild?.className && <Badge variant="secondary">{selectedChild.className}</Badge>}
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-emerald-300 mb-4" />

            {/* Dropdowns + Tombol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Pilih Anak</label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <Select
                    value={String(selectedChildIdx)}
                    onValueChange={(val) => setSelectedChildIdx(Number(val))}
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
                    value={selectedReportId}
                    onValueChange={setSelectedReportId}
                    disabled={reports.length === 0}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Pilih raport" />
                    </SelectTrigger>
                    <SelectContent>
                      {reports.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {formatPeriodLabel(report.semester, report.academicYear)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tombol Lihat PDF */}
            <div className="mt-4 flex gap-3">
              <Button
                onClick={handleViewPDF}
                disabled={!selectedReportId || loadingPDF}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                {loadingPDF ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {loadingPDF ? 'Memuat Raport...' : 'Lihat Raport PDF'}
              </Button>
              {selectedReportId && (
                <Badge variant="secondary" className="self-center">
                  Raport sudah dipublikasikan oleh guru
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info jika belum ada raport */}
        {reports.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Belum Ada Raport Tersedia</p>
              <p className="text-sm text-muted-foreground mt-1">
                Raport untuk {selectedChild?.name} belum dipublikasikan oleh guru.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
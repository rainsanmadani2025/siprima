'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import {
  Heart,
  User,
  Brain,
  MessageCircle,
  Users,
  Palette,
  Calendar,
  FileText,
  ArrowLeft,
  Loader2,
  Eye,
  ClipboardList,
  ChevronRight,
  AlertCircle
} from 'lucide-react'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

// Mapping aspek penilaian dari database key → label, icon, warna
const aspectConfig: Record<string, { label: string; icon: any; gradient: string; bgGradient: string; description: string }> = {
  agama_budi_pekerti: {
    label: 'Nilai Agama & Budi Pekerti',
    icon: Heart,
    gradient: 'from-emerald-500 to-green-600',
    bgGradient: 'from-emerald-500/20 to-green-600/20 hover:from-emerald-500/30 hover:to-green-600/30',
    description: 'Nilai agama, moral, dan perilaku'
  },
  agama_moral: {
    label: 'Nilai Agama & Moral',
    icon: Heart,
    gradient: 'from-emerald-500 to-green-600',
    bgGradient: 'from-emerald-500/20 to-green-600/20 hover:from-emerald-500/30 hover:to-green-600/30',
    description: 'Perkembangan nilai dan keyakinan agama'
  },
  jati_diri: {
    label: 'Jati Diri',
    icon: User,
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-500/20 to-indigo-600/20 hover:from-blue-500/30 hover:to-indigo-600/30',
    description: 'Kemandirian dan percaya diri'
  },
  fisik_motorik: {
    label: 'Fisik Motorik',
    icon: User,
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-500/20 to-indigo-600/20 hover:from-blue-500/30 hover:to-indigo-600/30',
    description: 'Motorik kasar dan halus'
  },
  kognitif: {
    label: 'Kognitif',
    icon: Brain,
    gradient: 'from-purple-500 to-violet-600',
    bgGradient: 'from-purple-500/20 to-violet-600/20 hover:from-purple-500/30 hover:to-violet-600/30',
    description: 'Berpikir logis, memecahkan masalah'
  },
  bahasa: {
    label: 'Bahasa',
    icon: MessageCircle,
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30',
    description: 'Mendengar, berbicara, membaca'
  },
  sosial_emosional: {
    label: 'Sosial Emosional',
    icon: Users,
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-500/20 to-rose-600/20 hover:from-pink-500/30 hover:to-rose-600/30',
    description: 'Bersosialisasi, mengenali emosi'
  },
  seni: {
    label: 'Seni',
    icon: Palette,
    gradient: 'from-teal-500 to-cyan-600',
    bgGradient: 'from-teal-500/20 to-cyan-600/20 hover:from-teal-500/30 hover:to-cyan-600/30',
    description: 'Kreativitas dan ekspresi seni'
  },
  literasi_sains: {
    label: 'Literasi, Sains & Teknologi',
    icon: Brain,
    gradient: 'from-purple-500 to-violet-600',
    bgGradient: 'from-purple-500/20 to-violet-600/20 hover:from-purple-500/30 hover:to-violet-600/30',
    description: 'Dasar literasi, matematika, sains'
  }
}

const scoreLabels: Record<string, string> = {
  BB: 'Belum Berkembang',
  MB: 'Mulai Berkembang',
  BSH: 'Berkembang Sesuai Harapan',
  BSB: 'Berkembang Sangat Baik'
}

interface ChildData {
  id: string
  name: string
  nis: string
  className: string | null
  aspects: Record<string, {
    latestScore: string
    totalAssessments: number
    assessments: Array<{
      id: string
      date: string
      score: string
      notes: string
      observation: string
      documentation: string | null
      teacherName: string
    }>
  }>
}

interface PeriodData {
  semester: string
  academicYear: string
}

export default function PenilaianPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [children, setChildren] = useState<ChildData[]>([])
  const [selectedChildIdx, setSelectedChildIdx] = useState(0)
  const [availablePeriods, setAvailablePeriods] = useState<PeriodData[]>([])
  const [selectedPeriodIdx, setSelectedPeriodIdx] = useState(0)
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const getProgressWidth = (nilai: string) => {
    switch (nilai) {
      case 'BB': return '25%'
      case 'MB': return '50%'
      case 'BSH': return '75%'
      case 'BSB': return '100%'
      default: return '0%'
    }
  }

  const formatPeriodLabel = (semester: string, academicYear: string) => {
    const s = semester ? semester.charAt(0).toUpperCase() + semester.slice(1) : '-'
    const y = academicYear || '-'
    return `Semester ${s} ${y}`
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  // Fetch data dari API
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      setLoading(false)
      setErrorMsg('Sesi login tidak ditemukan. Silakan login kembali.')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setErrorMsg(null)

        const params = new URLSearchParams()
        params.set('userId', userId)

        // If a period is selected, filter by it
        const selectedPeriod = availablePeriods[selectedPeriodIdx]
        if (selectedPeriod && availablePeriods.length > 0) {
          params.set('semester', selectedPeriod.semester)
          params.set('academicYear', selectedPeriod.academicYear)
        }

        const res = await fetch(`/api/parent/assessments?${params.toString()}`)
        const data = await res.json()

        if (data.success) {
          setChildren(data.children || [])
          setAvailablePeriods(data.availablePeriods || [])
        } else {
          setErrorMsg(data.error || 'Gagal memuat data penilaian')
        }
      } catch (error) {
        console.error('Error fetching assessments:', error)
        setErrorMsg('Terjadi kesalahan saat memuat data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedPeriodIdx])

  // Reset child index saat children berubah
  useEffect(() => {
    if (selectedChildIdx >= children.length) {
      setSelectedChildIdx(0)
    }
  }, [children.length])

  // Ambil data anak yang dipilih + filter periode
  const selectedChild = children[selectedChildIdx] || null
  const selectedPeriod = availablePeriods[selectedPeriodIdx] || null

  // Filter aspects berdasarkan periode yang dipilih (jika ada)
  const filteredAspects = selectedChild?.aspects || {}

  const handleDetailClick = (aspectKey: string) => {
    setSelectedAspect(aspectKey)
    setDetailOpen(true)
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (errorMsg) {
    return (
      <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Penilaian Perkembangan Anak</h1>
            <p className="text-gray-600 mt-2">Hasil observasi dan penilaian guru pada aspek perkembangan PAUD</p>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <p className="text-lg font-medium text-red-600">{errorMsg}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="mt-6 gap-2"
              >
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // No children
  if (children.length === 0) {
    return (
      <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Penilaian Perkembangan Anak</h1>
            <p className="text-gray-600 mt-2">Hasil observasi dan penilaian guru pada aspek perkembangan PAUD</p>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Belum ada data anak terdaftar</p>
              <p className="text-sm text-muted-foreground mt-1">Data penilaian akan muncul setelah guru melakukan penilaian</p>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/ortu')}
                className="mt-6 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const aspectKeys = Object.keys(filteredAspects)

  return (
    <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Penilaian Perkembangan Anak</h1>
            <p className="text-gray-600 mt-1">Hasil observasi dan penilaian guru pada aspek perkembangan PAUD</p>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/ortu')}
              className="mt-4 gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Button>
          </div>
        </div>

        {/* Selector: Anak & Periode */}
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Pilih Anak */}
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1.5">Pilih Anak</p>
                  <Select
                    value={String(selectedChildIdx)}
                    onValueChange={(val) => setSelectedChildIdx(Number(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih anak" />
                    </SelectTrigger>
                    <SelectContent>
                      {children.map((child, idx) => (
                        <SelectItem key={child.id} value={String(idx)}>
                          {child.name} {child.nis ? `(${child.nis})` : ''} {child.className ? `— ${child.className}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pilih Periode */}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1.5">Pilih Periode</p>
                  <Select
                    value={String(selectedPeriodIdx)}
                    onValueChange={(val) => setSelectedPeriodIdx(Number(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-1">Semua Periode</SelectItem>
                      {availablePeriods.map((period, idx) => (
                        <SelectItem key={idx} value={String(idx)}>
                          {formatPeriodLabel(period.semester, period.academicYear)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Anak */}
        {selectedChild && (
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                {selectedChild.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedChild.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedChild.nis && (
                    <Badge variant="outline">NIS: {selectedChild.nis}</Badge>
                  )}
                  {selectedChild.className && (
                    <Badge variant="secondary">{selectedChild.className}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabel Perkembangan */}
        {selectedChild && aspectKeys.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                Perkembangan {selectedChild.name}
                {selectedPeriod && (
                  <Badge variant="outline" className="ml-2 font-normal">
                    {formatPeriodLabel(selectedPeriod.semester, selectedPeriod.academicYear)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[220px]">Aspek</TableHead>
                      <TableHead className="w-[200px]">Deskripsi</TableHead>
                      <TableHead className="w-[100px]">Nilai</TableHead>
                      <TableHead className="w-[160px]">Progress</TableHead>
                      <TableHead className="w-[80px] text-center">Jumlah</TableHead>
                      <TableHead className="text-right w-[100px]">Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aspectKeys.map((aspectKey) => {
                      const config = aspectConfig[aspectKey] || {
                        label: aspectKey,
                        icon: ClipboardList,
                        gradient: 'from-gray-500 to-gray-600',
                        bgGradient: 'from-gray-500/20 to-gray-600/20',
                        description: aspectKey
                      }
                      const Icon = config.icon
                      const aspectData = filteredAspects[aspectKey]
                      const score = aspectData?.latestScore || '-'

                      return (
                        <TableRow key={aspectKey} className={config.bgGradient}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-semibold text-gray-900">{config.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">
                            {config.description}
                          </TableCell>
                          <TableCell>
                            {score !== '-' ? (
                              <Badge className={`bg-gradient-to-r ${config.gradient} text-white border-0`}>
                                {score}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {score !== '-' ? (
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className={`bg-gradient-to-r ${config.gradient} rounded-full h-full transition-all duration-500`}
                                  style={{ width: getProgressWidth(score) }}
                                />
                              </div>
                            ) : (
                              <div className="w-full bg-gray-200 rounded-full h-3" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">
                              {aspectData?.totalAssessments || 0}x
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDetailClick(aspectKey)}
                              className="gap-1 hover:bg-white/60"
                            >
                              <Eye className="w-4 h-4" />
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : selectedChild ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ClipboardList className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Belum ada data penilaian</p>
              <p className="text-sm text-muted-foreground mt-1">
                Data penilaian akan muncul setelah guru melakukan penilaian untuk {selectedChild.name}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {/* Keterangan Penilaian */}
        <Card className="bg-gradient-to-r from-amber-50 to-blue-50 border-amber-200">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900">Keterangan Penilaian</p>
                <p className="text-amber-800">
                  Penilaian dilakukan oleh guru berdasarkan observasi harian. BB = Belum Berkembang, MB = Mulai Berkembang,
                  BSH = Berkembang Sesuai Harapan, BSB = Berkembang Sangat Baik.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900">Catatan</p>
                <p className="text-blue-800">
                  Penilaian ini bersifat dinamis dan akan terus diperbarui oleh guru. Jika ada pertanyaan mengenai perkembangan anak,
                  silakan hubungi guru melalui menu Komunikasi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Detail Per Aspek */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
              Detail Penilaian
            </DialogTitle>
            <DialogDescription>
              {selectedAspect && selectedChild && (
                <>
                  {selectedChild.name} —{' '}
                  {aspectConfig[selectedAspect]?.label || selectedAspect}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedAspect && selectedChild && filteredAspects[selectedAspect] && (
            <div className="space-y-4 py-2">
              {/* Ringkasan */}
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className={`w-12 h-12 bg-gradient-to-br ${aspectConfig[selectedAspect]?.gradient || 'from-gray-500 to-gray-600'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {(() => {
                    const Icon = aspectConfig[selectedAspect]?.icon || ClipboardList
                    return <Icon className="w-6 h-6 text-white" />
                  })()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{aspectConfig[selectedAspect]?.label || selectedAspect}</p>
                  <p className="text-sm text-muted-foreground">
                    Total {filteredAspects[selectedAspect].totalAssessments}x penilaian
                  </p>
                </div>
                {filteredAspects[selectedAspect].latestScore && (
                  <Badge className={`bg-gradient-to-r ${aspectConfig[selectedAspect]?.gradient || ''} text-white border-0 text-lg px-3 py-1`}>
                    {filteredAspects[selectedAspect].latestScore}
                  </Badge>
                )}
              </div>

              {/* Daftar Penilaian */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Riwayat Penilaian
                </h4>
                {filteredAspects[selectedAspect].assessments.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredAspects[selectedAspect].assessments.map((item, idx) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </div>
                            <span className="font-medium text-sm">{formatDate(item.date)}</span>
                            <ChevronRight className="w-3 h-3 text-muted-foreground" />
                            <Badge variant="outline" className="text-xs">
                              {item.score} — {scoreLabels[item.score] || item.score}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{item.teacherName}</span>
                        </div>

                        {/* Catatan / Notes */}
                        {item.notes && (
                          <div className="mt-2 ml-8">
                            <p className="text-sm text-gray-700">{item.notes}</p>
                          </div>
                        )}

                        {/* Observasi / Catatan Anekdot */}
                        {item.observation && (
                          <div className="mt-2 ml-8 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                            <span className="font-medium">Catatan Observasi:</span> {item.observation}
                          </div>
                        )}

                        {/* Dokumentasi */}
                        {item.documentation && (
                          <div className="mt-2 ml-8">
                            <Badge variant="secondary" className="text-xs">
                              📎 Dokumentasi tersedia
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Belum ada riwayat penilaian</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
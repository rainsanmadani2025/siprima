"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Loader2, Download, Edit, Printer } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface RPPRaw {
  id: string
  tema: string
  subtema: string
  temaProjek: string
  judulKegiatan: string
  pokokBahasan?: string
  fase: string
  kelompokUsia: string
  semester: string
  tahunAjaran: string
  hari?: string
  jumlahPertemuan: string
  kelas?: string
  guru?: string
  namaSekolah: string
  alamatSekolah?: string
  topikKBC?: string
  profilLulusan?: string
  tujuanKBC?: string
  tujuanProfilLulusan?: any
  tujuanPembelajaranMendalam?: string
  materiIntegrasiKBC?: string
  tujuanPembelajaran?: string
  kerangkaPembelajaran?: any
  kegiatanPembelajaran?: any
  rubrikPenilaian?: any
  createdAt: string
  updatedAt: string
}

interface NilaiCinta {
  cintaAllah?: string
  cintaRasulullah?: string
  cintaDiriSendiri?: string
  cintaSesama?: string
  cintaLingkungan?: string
  cintaBangsaNegara?: string
}

interface DimensiKelulusan {
  keimananKetakwaan?: string
  kewargaan?: string
  penalaranKritis?: string
  kreativitas?: string
  kolaborasi?: string
  kemandirian?: string
  kesehatan?: string
  komunikasi?: string
}

interface SaranaMediaBahan {
  sarana?: string
  media?: string
  bahan?: string
}

interface KegiatanInti {
  eksplorasi?: string
  bermain?: string
  berkarya?: string
  refleksi?: string
}

interface LangkahPembelajaran {
  penyambutan?: string
  pembukaan?: string
  kegiatanInti?: KegiatanInti
  penutup?: string
}

const NILAI_CINTA_LABELS: Record<string, string> = {
  cintaAllah: 'Cinta kepada Allah SWT',
  cintaRasulullah: 'Cinta kepada Rasulullah SAW',
  cintaDiriSendiri: 'Cinta kepada Diri Sendiri',
  cintaSesama: 'Cinta kepada Sesama',
  cintaLingkungan: 'Cinta kepada Lingkungan',
  cintaBangsaNegara: 'Cinta kepada Bangsa dan Negara',
}

const DIMENSI_LABELS: Record<string, string> = {
  keimananKetakwaan: 'Keimanan dan Ketakwaan',
  kewargaan: 'Kewargaan',
  penalaranKritis: 'Penalaran Kritis',
  kreativitas: 'Kreativitas',
  kolaborasi: 'Kolaborasi',
  kemandirian: 'Kemandirian',
  kesehatan: 'Kesehatan',
  komunikasi: 'Komunikasi',
}

function parseJsonSafe(raw: any): any {
  if (raw === null || raw === undefined) return undefined
  if (typeof raw === 'object') return raw
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

function extractAsesmen(rubrikPenilaian: any): string {
  const parsed = parseJsonSafe(rubrikPenilaian)
  if (!parsed) return typeof rubrikPenilaian === 'string' ? rubrikPenilaian : '-'
  if (typeof parsed === 'string') return parsed
  if (parsed.asesmen) return parsed.asesmen
  return JSON.stringify(parsed, null, 2)
}

export default function ViewRPPPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const [rpp, setRpp] = useState<RPPRaw | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchRPPDetail(params.id as string)
    }
  }, [params.id])

  const fetchRPPDetail = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/rpp/detail?id=${id}`)
      const data = await response.json()

      if (data.success) {
        setRpp(data.rpp)
      } else {
        throw new Error(data.error || 'Gagal mengambil detail RPP')
      }
    } catch (error: any) {
      console.error('Error fetching RPP detail:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengambil detail RPP"
      })
      router.push('/dashboard/guru/perencanaan')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!rpp) return

    try {
      setLoadingPDF(true)
      const response = await fetch('/api/rpp/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rppId: rpp.id })
      })

      if (!response.ok) {
        throw new Error('Gagal mengunduh PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${rpp.tema}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Berhasil",
        description: "PDF berhasil diunduh"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengunduh PDF"
      })
    } finally {
      setLoadingPDF(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatText = (text?: string) => {
    if (!text) return <span className="text-muted-foreground">-</span>
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2">{line}</p>
    ))
  }

  // --- Derived / mapped data (DB kolom lama → KBC field baru) ---
  const nilaiCinta: NilaiCinta = parseJsonSafe(rpp?.tujuanKBC) || {}
  const dimensiKelulusan: DimensiKelulusan = parseJsonSafe(rpp?.tujuanProfilLulusan) || {}
  const saranaMediaBahan: SaranaMediaBahan = parseJsonSafe(rpp?.kerangkaPembelajaran) || {}
  const langkahPembelajaran: LangkahPembelajaran = parseJsonSafe(rpp?.kegiatanPembelajaran) || {}
  const capaianPembelajaran = rpp?.temaProjek || '-'
  const pemahamanBermakna = rpp?.tujuanPembelajaranMendalam || '-'
  const pertanyaanPemantik = rpp?.materiIntegrasiKBC || '-'
  const tindakLanjut = rpp?.pokokBahasan || '-'
  const refleksiGuru = rpp?.judulKegiatan || '-'
  const asesmenText = rpp ? extractAsesmen(rpp.rubrikPenilaian) : '-'

  if (loading) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!rpp) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">RPP tidak ditemukan</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6 print:p-0">
        {/* Header */}
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Detail RPP KBC</h1>
              <p className="text-muted-foreground mt-1">
                {rpp.tema} - {rpp.semester} {rpp.tahunAjaran}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/guru/perencanaan/edit/${rpp.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={loadingPDF}
            >
              {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* RPP Content */}
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6 print:space-y-4">
            {/* School Header */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold">{rpp.namaSekolah}</h2>
                  {rpp.alamatSekolah && (
                    <p className="text-sm text-muted-foreground">{rpp.alamatSekolah}</p>
                  )}
                  <h3 className="text-lg font-semibold">Rencana Pelaksanaan Pembelajaran</h3>
                  <p className="text-sm">Kurikulum Berbasis Cinta (KBC)</p>
                </div>
              </CardHeader>
            </Card>

            {/* A. Identitas Pembelajaran */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>A. Identitas Pembelajaran</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Fase:</strong> {rpp.fase}</div>
                <div><strong>Kelompok Usia:</strong> {rpp.kelompokUsia}</div>
                <div><strong>Semester:</strong> {rpp.semester}</div>
                <div><strong>Tahun Ajaran:</strong> {rpp.tahunAjaran}</div>
                <div><strong>Hari:</strong> {rpp.hari || '-'}</div>
                <div><strong>Jumlah Pertemuan:</strong> {rpp.jumlahPertemuan}</div>
                <div><strong>Kelas:</strong> {rpp.kelas || '-'}</div>
                <div><strong>Guru:</strong> {rpp.guru || '-'}</div>
              </CardContent>
            </Card>

            {/* B. Capaian Pembelajaran */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>B. Capaian Pembelajaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Tema:</strong> {rpp.tema}</div>
                <div><strong>Subtema:</strong> {rpp.subtema}</div>
                <div><strong>Capaian Pembelajaran:</strong></div>
                <div className="ml-4">{formatText(capaianPembelajaran)}</div>
              </CardContent>
            </Card>

            {/* C. Tujuan Pembelajaran */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>C. Tujuan Pembelajaran</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(rpp.tujuanPembelajaran)}
              </CardContent>
            </Card>

            {/* D. Nilai Cinta */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>D. Nilai Cinta</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(NILAI_CINTA_LABELS).map(([key, label]) => (
                  <div key={key}>
                    <strong>{label}:</strong>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                      {nilaiCinta[key as keyof NilaiCinta] || '-'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* E. Dimensi Kelulusan */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>E. Dimensi Kelulusan</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(DIMENSI_LABELS).map(([key, label]) => (
                  <div key={key}>
                    <strong>{label}:</strong>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                      {dimensiKelulusan[key as keyof DimensiKelulusan] || '-'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* F. Pemahaman Bermakna */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>F. Pemahaman Bermakna</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(pemahamanBermakna)}
              </CardContent>
            </Card>

            {/* G. Pertanyaan Pemantik */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>G. Pertanyaan Pemantik</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(pertanyaanPemantik)}
              </CardContent>
            </Card>

            {/* H. Sarana, Media, Bahan */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>H. Sarana, Media, Bahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Sarana:</strong>
                  <div className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                    {saranaMediaBahan.sarana || '-'}
                  </div>
                </div>
                <div>
                  <strong>Media:</strong>
                  <div className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                    {saranaMediaBahan.media || '-'}
                  </div>
                </div>
                <div>
                  <strong>Bahan:</strong>
                  <div className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                    {saranaMediaBahan.bahan || '-'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* I. Langkah Pembelajaran */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>I. Langkah Pembelajaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <strong>1. Penyambutan</strong>
                  <div className="ml-4 mt-1">{formatText(langkahPembelajaran.penyambutan)}</div>
                </div>
                <div>
                  <strong>2. Pembukaan</strong>
                  <div className="ml-4 mt-1">{formatText(langkahPembelajaran.pembukaan)}</div>
                </div>
                <div>
                  <strong>3. Kegiatan Inti</strong>
                  <div className="ml-4 mt-2 space-y-4">
                    <div>
                      <strong>a. Eksplorasi</strong>
                      <div className="ml-4 mt-1">{formatText(langkahPembelajaran.kegiatanInti?.eksplorasi)}</div>
                    </div>
                    <div>
                      <strong>b. Bermain</strong>
                      <div className="ml-4 mt-1">{formatText(langkahPembelajaran.kegiatanInti?.bermain)}</div>
                    </div>
                    <div>
                      <strong>c. Berkarya</strong>
                      <div className="ml-4 mt-1">{formatText(langkahPembelajaran.kegiatanInti?.berkarya)}</div>
                    </div>
                    <div>
                      <strong>d. Refleksi</strong>
                      <div className="ml-4 mt-1">{formatText(langkahPembelajaran.kegiatanInti?.refleksi)}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <strong>4. Penutup</strong>
                  <div className="ml-4 mt-1">{formatText(langkahPembelajaran.penutup)}</div>
                </div>
              </CardContent>
            </Card>

            {/* J. Asesmen */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>J. Asesmen</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(asesmenText)}
              </CardContent>
            </Card>

            {/* K. Tindak Lanjut */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>K. Tindak Lanjut</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(tindakLanjut)}
              </CardContent>
            </Card>

            {/* L. Refleksi Guru */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>L. Refleksi Guru</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(refleksiGuru)}
              </CardContent>
            </Card>

            {/* Footer Info */}
            <div className="text-center text-sm text-muted-foreground print:hidden">
              <p>Dibuat: {new Date(rpp.createdAt).toLocaleDateString('id-ID')}</p>
              <p>Terakhir diupdate: {new Date(rpp.updatedAt).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </DashboardLayout>
  )
}
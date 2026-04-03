"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Loader2, Download, Edit, Printer } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface RPPData {
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

export default function ViewRPPPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const [rpp, setRpp] = useState<RPPData | null>(null)

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
    if (!text) return '-'
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2">{line}</p>
    ))
  }

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
            {/* Header Info */}
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

            {/* B. Tema Projek */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>B. Tema Projek</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Tema:</strong> {rpp.tema}</div>
                <div><strong>Subtema:</strong> {rpp.subtema}</div>
                <div><strong>Tema Projek:</strong> {rpp.temaProjek}</div>
                <div><strong>Judul Kegiatan:</strong> {rpp.judulKegiatan}</div>
                <div><strong>Pokok Bahasan:</strong> {rpp.pokokBahasan || '-'}</div>
              </CardContent>
            </Card>

            {/* C. Topik KBC */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>C. Topik KBC</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(rpp.topikKBC)}
              </CardContent>
            </Card>

            {/* D. Profil Lulusan */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>D. Profil Lulusan</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(rpp.profilLulusan)}
              </CardContent>
            </Card>

            {/* E. Tujuan KBC */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>E. Tujuan KBC</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(rpp.tujuanKBC)}
              </CardContent>
            </Card>

            {/* F. Tujuan Profil Lulusan */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>F. Tujuan Profil Lulusan</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rpp.tujuanProfilLulusan && Object.entries(rpp.tujuanProfilLulusan).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{value as string || '-'}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* G. Tujuan Pembelajaran Mendalam */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>G. Tujuan Pembelajaran Mendalam (KD)</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(rpp.tujuanPembelajaranMendalam)}
              </CardContent>
            </Card>

            {/* H. Materi Integrasi KBC */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>H. Materi Integrasi KBC</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(rpp.materiIntegrasiKBC)}
              </CardContent>
            </Card>

            {/* I. Tujuan Pembelajaran */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>I. Tujuan Pembelajaran</CardTitle>
              </CardHeader>
              <CardContent>
                {formatText(rpp.tujuanPembelajaran)}
              </CardContent>
            </Card>

            {/* J. Kerangka Pembelajaran */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>J. Kerangka Pembelajaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rpp.kerangkaPembelajaran && (
                  <>
                    <div>
                      <strong>Praktek Pedagogik:</strong>
                      {formatText(rpp.kerangkaPembelajaran.praktekPedagogik)}
                    </div>
                    {rpp.kerangkaPembelajaran.lingkunganPembelajaran && (
                      <div className="space-y-2">
                        <strong>Lingkungan Pembelajaran:</strong>
                        {Object.entries(rpp.kerangkaPembelajaran.lingkunganPembelajaran).map(([key, value]) => (
                          <div key={key} className="ml-4">
                            <strong>{key}:</strong>
                            {formatText(value as string)}
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      <strong>Kemitraan Pembelajaran:</strong>
                      {formatText(rpp.kerangkaPembelajaran.kemitraanPembelajaran)}
                    </div>
                    <div>
                      <strong>Pemanfaatan Digital:</strong>
                      {formatText(rpp.kerangkaPembelajaran.pemanfaatanDigital)}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* K. Kegiatan Pembelajaran */}
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle>K. Kegiatan Pembelajaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {rpp.kegiatanPembelajaran && (
                  <>
                    <div className="space-y-3">
                      <h4 className="font-semibold">1. Tahap Persiapan</h4>
                      <div className="ml-4 space-y-2">
                        <div><strong>a. Pemahaman Konsep:</strong>{formatText(rpp.kegiatanPembelajaran.persiapan?.pemahamanKonsep)}</div>
                        <div><strong>b. Penyiapan Alat:</strong>{formatText(rpp.kegiatanPembelajaran.persiapan?.penyiapanAlat)}</div>
                        <div><strong>c. Alat & Bahan:</strong>{formatText(rpp.kegiatanPembelajaran.persiapan?.alatBahan)}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">2. Tahap Pelaksanaan</h4>
                      <div className="ml-4 space-y-2">
                        <div><strong>a. Orientasi:</strong>{formatText(rpp.kegiatanPembelajaran.pelaksanaan?.orientasi)}</div>
                        <div><strong>b. Eksplorasi:</strong>{formatText(rpp.kegiatanPembelajaran.pelaksanaan?.eksplorasi)}</div>
                        <div><strong>c. Diskusi:</strong>{formatText(rpp.kegiatanPembelajaran.pelaksanaan?.diskusi)}</div>
                        <div><strong>d. Kolaborasi:</strong>{formatText(rpp.kegiatanPembelajaran.pelaksanaan?.kolaborasi)}</div>
                        <div><strong>e. Refleksi:</strong>{formatText(rpp.kegiatanPembelajaran.pelaksanaan?.refleksi)}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">3. Tahap Pembuatan Karya</h4>
                      <div className="ml-4 space-y-2">
                        <div><strong>a. Proses:</strong>{formatText(rpp.kegiatanPembelajaran.pembuatanKarya?.proses)}</div>
                        <div><strong>b. Hasil:</strong>{formatText(rpp.kegiatanPembelajaran.pembuatanKarya?.hasil)}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">4. Tahap Presentasi</h4>
                      <div className="ml-4 space-y-2">
                        <div><strong>a. Persiapan:</strong>{formatText(rpp.kegiatanPembelajaran.presentasi?.persiapan)}</div>
                        <div><strong>b. Pelaksanaan:</strong>{formatText(rpp.kegiatanPembelajaran.presentasi?.pelaksanaan)}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">5. Tahap Refleksi Akhir</h4>
                      <div className="ml-4 space-y-2">
                        <div><strong>a. Refleksi Guru:</strong>{formatText(rpp.kegiatanPembelajaran.refleksiAkhir?.refleksiGuru)}</div>
                        <div><strong>b. Refleksi Anak:</strong>{formatText(rpp.kegiatanPembelajaran.refleksiAkhir?.refleksiAnak)}</div>
                      </div>
                    </div>
                  </>
                )}
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

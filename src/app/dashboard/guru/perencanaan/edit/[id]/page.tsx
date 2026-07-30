"use client"
// RPP KBC Edit - New 12-section layout (A-L) for Kurikulum Berbasis Cinta

import { useState, useEffect } from "react"
import { getCurrentAcademicYear } from '@/lib/semester-utils'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Download, Save, FileDown, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from "next/navigation"

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
}

interface SchoolProfile {
  name: string
  address: string
}

// Default empty structures matching the new KBC format
const emptyNilaiCinta = {
  cintaAllah: "",
  cintaRasulullah: "",
  cintaDiriSendiri: "",
  cintaSesama: "",
  cintaLingkungan: "",
  cintaBangsaNegara: ""
}

const emptyDimensiKelulusan = {
  keimananKetakwaan: "",
  kewargaan: "",
  penalaranKritis: "",
  kreativitas: "",
  kolaborasi: "",
  kemandirian: "",
  kesehatan: "",
  komunikasi: ""
}

const emptySaranaMediaBahan = {
  sarana: "",
  media: "",
  bahan: ""
}

const emptyLangkahPembelajaran = {
  penyambutan: "",
  pembukaan: "",
  kegiatanInti: {
    eksplorasi: "",
    bermain: "",
    berkarya: "",
    refleksi: ""
  },
  penutup: ""
}

/**
 * Safely parse a JSON string, returning the fallback on failure.
 */
function safeJsonParse(str: string | null | undefined, fallback: any): any {
  if (!str) return fallback
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

export default function EditRPPPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const [saving, setSaving] = useState(false)
  const [rppData, setRppData] = useState<RPPData | null>(null)
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null)

  // formData uses NEW KBC field names (same as buat/page.tsx)
  const [formData, setFormData] = useState({
    // A. Identitas Pembelajaran
    fase: "Fase Fondasi",
    kelompokUsia: "Kelompok A (4-5 Tahun)",
    semester: "Ganjil",
    tahunAjaran: getCurrentAcademicYear(),
    hari: "",
    jumlahPertemuan: "8 JP",
    kelas: "",
    guru: "",
    // B. Capaian Pembelajaran
    tema: "",
    subtema: "",
    capaianPembelajaran: "",
    // C. Tujuan Pembelajaran
    tujuanPembelajaran: "",
    // D. 6 Nilai Cinta KBC
    nilaiCinta: { ...emptyNilaiCinta },
    // E. 8 Dimensi Kelulusan KBC Kemenag
    dimensiKelulusan: { ...emptyDimensiKelulusan },
    // F. Pemahaman Bermakna
    pemahamanBermakna: "",
    // G. Pertanyaan Pemantik
    pertanyaanPemantik: "",
    // H. Sarana, Media, Bahan
    saranaMediaBahan: { ...emptySaranaMediaBahan },
    // I. Langkah Pembelajaran
    langkahPembelajaran: { ...emptyLangkahPembelajaran, kegiatanInti: { ...emptyLangkahPembelajaran.kegiatanInti } },
    // J. Asesmen
    asesmen: "",
    // K. Tindak Lanjut
    tindakLanjut: "",
    // L. Refleksi Guru
    refleksiGuru: ""
  })

  useEffect(() => {
    fetchSchoolProfile()
    if (params.id) {
      fetchRPPDetail(params.id as string)
    }
  }, [params.id])

  const fetchSchoolProfile = async () => {
    try {
      const response = await fetch('/api/school/profile')
      const data = await response.json()
      if (data.success) {
        setSchoolProfile(data.school)
      }
    } catch (error) {
      console.error('Error fetching school profile:', error)
    }
  }

  const fetchRPPDetail = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/rpp/detail?id=${id}`)
      const data = await response.json()

      if (data.success) {
        const rpp = data.rpp
        setRppData(rpp)

        // Reverse-map old DB columns to new KBC field names
        const parsedNilaiCinta = safeJsonParse(rpp.tujuanKBC, emptyNilaiCinta)
        const parsedDimensiKelulusan = rpp.tujuanProfilLulusan || emptyDimensiKelulusan
        const parsedSaranaMediaBahan = rpp.kerangkaPembelajaran || emptySaranaMediaBahan
        const parsedLangkahPembelajaran = rpp.kegiatanPembelajaran || { ...emptyLangkahPembelajaran, kegiatanInti: { ...emptyLangkahPembelajaran.kegiatanInti } }

        // Extract asesmen from rubrikPenilaian
        const rubrikPenilaian = rpp.rubrikPenilaian || {}
        const parsedAsesmen = typeof rubrikPenilaian === 'object' && rubrikPenilaian.asesmen
          ? rubrikPenilaian.asesmen
          : typeof rubrikPenilaian === 'string'
            ? rubrikPenilaian
            : ""

        setFormData({
          // A. Identitas
          fase: rpp.fase || "Fase Fondasi",
          kelompokUsia: rpp.kelompokUsia || "Kelompok A (4-5 Tahun)",
          semester: rpp.semester || "Ganjil",
          tahunAjaran: rpp.tahunAjaran || getCurrentAcademicYear(),
          hari: rpp.hari || "",
          jumlahPertemuan: rpp.jumlahPertemuan || "8 JP",
          kelas: rpp.kelas || "",
          guru: rpp.guru || "",
          // B. Capaian Pembelajaran
          tema: rpp.tema || "",
          subtema: rpp.subtema || "",
          capaianPembelajaran: rpp.temaProjek || "",
          // C. Tujuan Pembelajaran
          tujuanPembelajaran: rpp.tujuanPembelajaran || "",
          // D. Nilai Cinta
          nilaiCinta: { ...emptyNilaiCinta, ...parsedNilaiCinta },
          // E. Dimensi Kelulusan
          dimensiKelulusan: { ...emptyDimensiKelulusan, ...parsedDimensiKelulusan },
          // F. Pemahaman Bermakna
          pemahamanBermakna: rpp.tujuanPembelajaranMendalam || "",
          // G. Pertanyaan Pemantik
          pertanyaanPemantik: rpp.materiIntegrasiKBC || "",
          // H. Sarana/Media/Bahan
          saranaMediaBahan: { ...emptySaranaMediaBahan, ...parsedSaranaMediaBahan },
          // I. Langkah Pembelajaran
          langkahPembelajaran: {
            ...emptyLangkahPembelajaran,
            ...parsedLangkahPembelajaran,
            kegiatanInti: {
              ...emptyLangkahPembelajaran.kegiatanInti,
              ...(parsedLangkahPembelajaran.kegiatanInti || {})
            }
          },
          // J. Asesmen
          asesmen: parsedAsesmen,
          // K. Tindak Lanjut
          tindakLanjut: rpp.pokokBahasan || "",
          // L. Refleksi Guru
          refleksiGuru: rpp.judulKegiatan || ""
        })
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

  // Build body for export endpoints (new KBC field names)
  const buildExportBody = () => ({
    tema: formData.tema,
    subtema: formData.subtema,
    capaianPembelajaran: formData.capaianPembelajaran,
    refleksiGuru: formData.refleksiGuru,
    tindakLanjut: formData.tindakLanjut,
    fase: formData.fase,
    kelompokUsia: formData.kelompokUsia,
    semester: formData.semester,
    tahunAjaran: formData.tahunAjaran,
    hari: formData.hari,
    jumlahPertemuan: formData.jumlahPertemuan,
    kelas: formData.kelas,
    guru: formData.guru,
    nilaiCinta: formData.nilaiCinta,
    dimensiKelulusan: formData.dimensiKelulusan,
    pemahamanBermakna: formData.pemahamanBermakna,
    pertanyaanPemantik: formData.pertanyaanPemantik,
    tujuanPembelajaran: formData.tujuanPembelajaran,
    saranaMediaBahan: formData.saranaMediaBahan,
    langkahPembelajaran: formData.langkahPembelajaran,
    asesmen: formData.asesmen,
    namaSekolah: schoolProfile?.name || "RA INSAN MADANI",
    alamatSekolah: schoolProfile?.address || ""
  })

  // Build body for UPDATE API (reverse-map new KBC fields back to old DB column names)
  const buildUpdateBody = () => ({
    tema: formData.tema,
    subtema: formData.subtema,
    temaProjek: formData.capaianPembelajaran,
    judulKegiatan: formData.refleksiGuru,
    pokokBahasan: formData.tindakLanjut,
    fase: formData.fase,
    kelompokUsia: formData.kelompokUsia,
    semester: formData.semester,
    tahunAjaran: formData.tahunAjaran,
    hari: formData.hari,
    jumlahPertemuan: formData.jumlahPertemuan,
    kelas: formData.kelas,
    guru: formData.guru,
    topikKBC: "",
    profilLulusan: "",
    tujuanKBC: JSON.stringify(formData.nilaiCinta),
    tujuanProfilLulusan: formData.dimensiKelulusan,
    tujuanPembelajaranMendalam: formData.pemahamanBermakna,
    materiIntegrasiKBC: formData.pertanyaanPemantik,
    tujuanPembelajaran: formData.tujuanPembelajaran,
    kerangkaPembelajaran: formData.saranaMediaBahan,
    kegiatanPembelajaran: formData.langkahPembelajaran,
    rubrikPenilaian: { asesmen: formData.asesmen },
    namaSekolah: schoolProfile?.name || "RA INSAN MADANI",
    alamatSekolah: schoolProfile?.address || ""
  })

  const handleUpdate = async () => {
    if (!formData.tema || !formData.subtema) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Mohon lengkapi field yang diperlukan: Tema dan Subtema"
      })
      return
    }

    if (!rppData) return

    try {
      setSaving(true)

      const response = await fetch(`/api/rpp/update?id=${rppData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildUpdateBody())
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "RPP berhasil diupdate"
        })
        router.push('/dashboard/guru/perencanaan')
      } else {
        throw new Error(data.error || 'Gagal mengupdate RPP')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengupdate RPP"
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreviewPDF = async () => {
    try {
      setLoadingPDF(true)

      const response = await fetch('/api/rpp/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildExportBody()),
      })

      if (!response.ok) {
        throw new Error('Gagal membuat preview PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')

      toast({
        title: "Berhasil",
        description: "PDF dibuka di tab baru"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal membuat preview PDF"
      })
    } finally {
      setLoadingPDF(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setLoadingPDF(true)
      const response = await fetch('/api/rpp/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildExportBody()),
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${formData.tema || 'Edit'}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast({
        title: "Berhasil",
        description: "RPP berhasil diekspor ke PDF"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengekspor RPP ke PDF"
      })
    } finally {
      setLoadingPDF(false)
    }
  }

  const handleExport = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/rpp/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildExportBody()),
      })

      if (!response.ok) {
        throw new Error('Gagal mengekspor RPP')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${formData.tema || 'Edit'}-${new Date().toISOString().split('T')[0]}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Berhasil",
        description: "RPP berhasil diekspor ke Word"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengekspor RPP"
      })
    } finally {
      setLoading(false)
    }
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

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit RPP KBC</h1>
              <p className="text-muted-foreground mt-1">
                {formData.tema} - {formData.semester} {formData.tahunAjaran}
                {schoolProfile && (
                  <span className="ml-2 text-sm text-primary">• {schoolProfile.name}</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handlePreviewPDF} disabled={loadingPDF} variant="outline" size="sm">
              {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Eye className="mr-2 h-4 w-4" />
              Preview PDF
            </Button>
            <Button onClick={handleUpdate} disabled={saving} variant="outline" size="sm">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Update
            </Button>
            <Button onClick={handleExportPDF} disabled={loadingPDF} variant="outline" size="sm">
              {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={handleExport} disabled={loading} variant="outline" size="sm">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Download className="mr-2 h-4 w-4" />
              Export Word
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 dark:text-yellow-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Format RPP KBC Baru (12 Bagian A-L)</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  RPP ini menggunakan format KBC Kemenag dengan 12 bagian (A-L). Edit sesuai kebutuhan lalu klik Update untuk menyimpan perubahan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Sections A-L */}
        <div className="space-y-6">

          {/* A. Identitas Pembelajaran */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">A</span>
                Identitas Pembelajaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Kelompok Usia</Label>
                  <Select value={formData.kelompokUsia} onValueChange={(v) => {
                    setFormData(prev => ({
                      ...prev,
                      kelompokUsia: v
                    }))
                  }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kelompok A (4-5 Tahun)">Kelompok A (4-5 Tahun)</SelectItem>
                      <SelectItem value="Kelompok B (5-6 Tahun)">Kelompok B (5-6 Tahun)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={formData.semester} onValueChange={(v) => setFormData(prev => ({...prev, semester: v}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ganjil">Ganjil</SelectItem>
                      <SelectItem value="Genap">Genap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tahun Ajaran</Label>
                  <Input value={formData.tahunAjaran} onChange={(e) => setFormData(prev => ({...prev, tahunAjaran: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <Label>Hari</Label>
                  <Select value={formData.hari} onValueChange={(value) => setFormData(prev => ({...prev, hari: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih hari" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Senin">Senin</SelectItem>
                      <SelectItem value="Selasa">Selasa</SelectItem>
                      <SelectItem value="Rabu">Rabu</SelectItem>
                      <SelectItem value="Kamis">Kamis</SelectItem>
                      <SelectItem value="Jumat">Jumat</SelectItem>
                      <SelectItem value="Sabtu">Sabtu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Jumlah Pertemuan</Label>
                  <Input value={formData.jumlahPertemuan} onChange={(e) => setFormData(prev => ({...prev, jumlahPertemuan: e.target.value}))} placeholder="Contoh: 8 JP" />
                </div>
                <div className="space-y-2">
                  <Label>Kelas</Label>
                  <Input value={formData.kelas} onChange={(e) => setFormData(prev => ({...prev, kelas: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <Label>Guru</Label>
                  <Input value={formData.guru} onChange={(e) => setFormData(prev => ({...prev, guru: e.target.value}))} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* B. Capaian Pembelajaran */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">B</span>
                Capaian Pembelajaran
              </CardTitle>
              <CardDescription>Tema dan Capaian Pembelajaran</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tema *</Label>
                  <Input value={formData.tema} onChange={(e) => setFormData(prev => ({...prev, tema: e.target.value}))} placeholder="Contoh: Lingkungan Sekitarku" />
                </div>
                <div className="space-y-2">
                  <Label>Subtema *</Label>
                  <Input value={formData.subtema} onChange={(e) => setFormData(prev => ({...prev, subtema: e.target.value}))} placeholder="Contoh: Mesjid tempat ibadah" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Capaian Pembelajaran</Label>
                <Textarea
                  value={formData.capaianPembelajaran}
                  onChange={(e) => setFormData(prev => ({...prev, capaianPembelajaran: e.target.value}))}
                  rows={4}
                  placeholder="Tuliskan capaian pembelajaran yang diharapkan..."
                />
              </div>
            </CardContent>
          </Card>

          {/* C. Tujuan Pembelajaran */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">C</span>
                Tujuan Pembelajaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Tujuan Pembelajaran</Label>
                <Textarea
                  value={formData.tujuanPembelajaran}
                  onChange={(e) => setFormData(prev => ({...prev, tujuanPembelajaran: e.target.value}))}
                  rows={6}
                  placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai..."
                />
              </div>
            </CardContent>
          </Card>

          {/* D. Nilai Kurikulum Berbasis Cinta (6 Nilai Cinta) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">D</span>
                Nilai Kurikulum Berbasis Cinta
              </CardTitle>
              <CardDescription>6 Nilai Cinta dalam Pembelajaran</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cinta kepada Allah SWT</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaAllah}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaAllah: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Nilai cinta kepada Allah SWT..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Rasulullah SAW</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaRasulullah}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaRasulullah: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Nilai cinta kepada Rasulullah SAW..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Diri Sendiri</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaDiriSendiri}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaDiriSendiri: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Nilai cinta kepada diri sendiri..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Sesama</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaSesama}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaSesama: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Nilai cinta kepada sesama..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Lingkungan</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaLingkungan}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaLingkungan: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Nilai cinta kepada lingkungan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Bangsa & Negara</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaBangsaNegara}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaBangsaNegara: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Nilai cinta kepada bangsa & negara..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* E. Dimensi Kelulusan KBC Kemenag (8 Dimensi) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">E</span>
                Dimensi Kelulusan KBC Kemenag
              </CardTitle>
              <CardDescription>8 Dimensi Kelulusan Kurikulum Berbasis Cinta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Keimanan & Ketakwaan</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.keimananKetakwaan}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, keimananKetakwaan: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Dimensi keimanan & ketakwaan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kewargaan</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kewargaan}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, kewargaan: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Dimensi kewargaan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Penalaran Kritis</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.penalaranKritis}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, penalaranKritis: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Dimensi penalaran kritis..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kreativitas</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kreativitas}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, kreativitas: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Dimensi kreativitas..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kolaborasi</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kolaborasi}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, kolaborasi: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Dimensi kolaborasi..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kemandirian</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kemandirian}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, kemandirian: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Dimensi kemandirian..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kesehatan</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kesehatan}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, kesehatan: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Dimensi kesehatan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Komunikasi</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.komunikasi}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, komunikasi: e.target.value}}))
                  }}
                    rows={3}
                    placeholder="Dimensi komunikasi..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* F. Pemahaman Bermakna */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">F</span>
                Pemahaman Bermakna
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Pemahaman Bermakna</Label>
                <Textarea
                  value={formData.pemahamanBermakna}
                  onChange={(e) => setFormData(prev => ({...prev, pemahamanBermakna: e.target.value}))}
                  rows={6}
                  placeholder="Tuliskan pemahaman bermakna yang ingin dicapai..."
                />
              </div>
            </CardContent>
          </Card>

          {/* G. Pertanyaan Pemantik */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">G</span>
                Pertanyaan Pemantik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Pertanyaan Pemantik</Label>
                <Textarea
                  value={formData.pertanyaanPemantik}
                  onChange={(e) => setFormData(prev => ({...prev, pertanyaanPemantik: e.target.value}))}
                  rows={6}
                  placeholder="Tuliskan pertanyaan pemantik untuk memulai pembelajaran..."
                />
              </div>
            </CardContent>
          </Card>

          {/* H. Sarana, Media, dan Bahan Pembelajaran */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">H</span>
                Sarana, Media, dan Bahan Pembelajaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sarana</Label>
                <Textarea
                  value={formData.saranaMediaBahan.sarana}
                  onChange={(e) => {
                  setFormData(prev => ({...prev, saranaMediaBahan: {...prev.saranaMediaBahan, sarana: e.target.value}}))
                }}
                  rows={3}
                  placeholder="Tuliskan sarana yang digunakan..."
                />
              </div>
              <div className="space-y-2">
                <Label>Media Pembelajaran</Label>
                <Textarea
                  value={formData.saranaMediaBahan.media}
                  onChange={(e) => {
                  setFormData(prev => ({...prev, saranaMediaBahan: {...prev.saranaMediaBahan, media: e.target.value}}))
                }}
                  rows={3}
                  placeholder="Tuliskan media pembelajaran yang digunakan..."
                />
              </div>
              <div className="space-y-2">
                <Label>Bahan Pembelajaran</Label>
                <Textarea
                  value={formData.saranaMediaBahan.bahan}
                  onChange={(e) => {
                  setFormData(prev => ({...prev, saranaMediaBahan: {...prev.saranaMediaBahan, bahan: e.target.value}}))
                }}
                  rows={3}
                  placeholder="Tuliskan bahan pembelajaran yang digunakan..."
                />
              </div>
            </CardContent>
          </Card>

          {/* I. Langkah Pembelajaran */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">I</span>
                Langkah Pembelajaran
              </CardTitle>
              <CardDescription>Tahapan kegiatan pembelajaran</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Penyambutan */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">Penyambutan</h4>
                <div className="space-y-2">
                  <Textarea
                    value={formData.langkahPembelajaran.penyambutan}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, langkahPembelajaran: {...prev.langkahPembelajaran, penyambutan: e.target.value}}))
                  }}
                    rows={4}
                    placeholder="Kegiatan penyambutan anak..."
                  />
                </div>
              </div>

              {/* Pembukaan */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">Pembukaan</h4>
                <div className="space-y-2">
                  <Textarea
                    value={formData.langkahPembelajaran.pembukaan}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, langkahPembelajaran: {...prev.langkahPembelajaran, pembukaan: e.target.value}}))
                  }}
                    rows={4}
                    placeholder="Kegiatan pembukaan..."
                  />
                </div>
              </div>

              {/* Kegiatan Inti */}
              <div className="space-y-4 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">Kegiatan Inti</h4>
                
                <div className="space-y-2 pl-4">
                  <Label className="font-medium">Eksplorasi</Label>
                  <Textarea
                    value={formData.langkahPembelajaran.kegiatanInti.eksplorasi}
                    onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      langkahPembelajaran: {
                        ...prev.langkahPembelajaran,
                        kegiatanInti: {
                          ...prev.langkahPembelajaran.kegiatanInti,
                          eksplorasi: e.target.value
                        }
                      }
                    }))
                  }}
                    rows={4}
                    placeholder="Kegiatan eksplorasi..."
                  />
                </div>

                <div className="space-y-2 pl-4">
                  <Label className="font-medium">Bermain</Label>
                  <Textarea
                    value={formData.langkahPembelajaran.kegiatanInti.bermain}
                    onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      langkahPembelajaran: {
                        ...prev.langkahPembelajaran,
                        kegiatanInti: {
                          ...prev.langkahPembelajaran.kegiatanInti,
                          bermain: e.target.value
                        }
                      }
                    }))
                  }}
                    rows={4}
                    placeholder="Kegiatan bermain..."
                  />
                </div>

                <div className="space-y-2 pl-4">
                  <Label className="font-medium">Berkarya</Label>
                  <Textarea
                    value={formData.langkahPembelajaran.kegiatanInti.berkarya}
                    onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      langkahPembelajaran: {
                        ...prev.langkahPembelajaran,
                        kegiatanInti: {
                          ...prev.langkahPembelajaran.kegiatanInti,
                          berkarya: e.target.value
                        }
                      }
                    }))
                  }}
                    rows={4}
                    placeholder="Kegiatan berkarya..."
                  />
                </div>

                <div className="space-y-2 pl-4">
                  <Label className="font-medium">Refleksi</Label>
                  <Textarea
                    value={formData.langkahPembelajaran.kegiatanInti.refleksi}
                    onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      langkahPembelajaran: {
                        ...prev.langkahPembelajaran,
                        kegiatanInti: {
                          ...prev.langkahPembelajaran.kegiatanInti,
                          refleksi: e.target.value
                        }
                      }
                    }))
                  }}
                    rows={4}
                    placeholder="Kegiatan refleksi..."
                  />
                </div>
              </div>

              {/* Penutup */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">Penutup</h4>
                <div className="space-y-2">
                  <Textarea
                    value={formData.langkahPembelajaran.penutup}
                    onChange={(e) => {
                    setFormData(prev => ({...prev, langkahPembelajaran: {...prev.langkahPembelajaran, penutup: e.target.value}}))
                  }}
                    rows={4}
                    placeholder="Kegiatan penutup..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* J. Asesmen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">J</span>
                Asesmen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Asesmen</Label>
                <Textarea
                  value={formData.asesmen}
                  onChange={(e) => setFormData(prev => ({...prev, asesmen: e.target.value}))}
                  rows={6}
                  placeholder="Tuliskan instrumen dan teknik asesmen..."
                />
              </div>
            </CardContent>
          </Card>

          {/* K. Tindak Lanjut */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">K</span>
                Tindak Lanjut
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Tindak Lanjut</Label>
                <Textarea
                  value={formData.tindakLanjut}
                  onChange={(e) => setFormData(prev => ({...prev, tindakLanjut: e.target.value}))}
                  rows={4}
                  placeholder="Tuliskan tindak lanjut pembelajaran..."
                />
              </div>
            </CardContent>
          </Card>

          {/* L. Refleksi Guru */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">L</span>
                Refleksi Guru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Refleksi Guru</Label>
                <Textarea
                  value={formData.refleksiGuru}
                  onChange={(e) => setFormData(prev => ({...prev, refleksiGuru: e.target.value}))}
                  rows={4}
                  placeholder="Tuliskan refleksi guru setelah pembelajaran..."
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  )
}
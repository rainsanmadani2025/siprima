"use client"
// RPP KBC - New 12-section layout (A-L) for Kurikulum Berbasis Cinta

import { useState, useEffect } from "react"
import { getCurrentSemester, getCurrentAcademicYear } from '@/lib/semester-utils'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, ArrowLeft, Loader2, Plus, RefreshCw, Eye, FileDown, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

interface TemplateKBC {
  id: string
  nama: string
  tema: string
  subtema: string
  kelompokUsia: string
  status: string
  fase: string
  semester: string
  capaianPembelajaran: string
  tujuanPembelajaran: string
  nilaiCinta: {
    cintaAllah: string
    cintaRasulullah: string
    cintaDiriSendiri: string
    cintaSesama: string
    cintaLingkungan: string
    cintaBangsaNegara: string
  }
  dimensiKelulusan: {
    keimananKetakwaan: string
    kewargaan: string
    penalaranKritis: string
    kreativitas: string
    kolaborasi: string
    kemandirian: string
    kesehatan: string
    komunikasi: string
  }
  pemahamanBermakna: string
  pertanyaanPemantik: string
  saranaMediaBahan: {
    sarana: string
    media: string
    bahan: string
  }
  langkahPembelajaran: {
    penyambutan: string
    pembukaan: string
    kegiatanInti: {
      eksplorasi: string
      bermain: string
      berkarya: string
      refleksi: string
    }
    penutup: string
  }
  asesmen: string
  tindakLanjut: string
  refleksiGuru: string
}

interface SchoolProfile {
  name: string
  address: string
}

export default function BuatRPPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlTemplateId = searchParams.get('templateId')
  const [loading, setLoading] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fetchingTemplates, setFetchingTemplates] = useState(true)

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)

  const { toast } = useToast()

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null)
  const [templates, setTemplates] = useState<TemplateKBC[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKBC | null>(null)
  const [kelompokUsiaFilter, setKelompokUsiaFilter] = useState("Kelompok A (4-5 Tahun)")

  const [formData, setFormData] = useState({
    // A. Identitas Pembelajaran
    fase: "Fase Fondasi",
    kelompokUsia: "Kelompok A (4-5 Tahun)",
    semester: getCurrentSemester(),
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
    nilaiCinta: {
      cintaAllah: "",
      cintaRasulullah: "",
      cintaDiriSendiri: "",
      cintaSesama: "",
      cintaLingkungan: "",
      cintaBangsaNegara: ""
    },
    // E. 8 Dimensi Kelulusan KBC Kemenag
    dimensiKelulusan: {
      keimananKetakwaan: "",
      kewargaan: "",
      penalaranKritis: "",
      kreativitas: "",
      kolaborasi: "",
      kemandirian: "",
      kesehatan: "",
      komunikasi: ""
    },
    // F. Pemahaman Bermakna
    pemahamanBermakna: "",
    // G. Pertanyaan Pemantik
    pertanyaanPemantik: "",
    // H. Sarana, Media, Bahan
    saranaMediaBahan: {
      sarana: "",
      media: "",
      bahan: ""
    },
    // I. Langkah Pembelajaran
    langkahPembelajaran: {
      penyambutan: "",
      pembukaan: "",
      kegiatanInti: {
        eksplorasi: "",
        bermain: "",
        berkarya: "",
        refleksi: ""
      },
      penutup: ""
    },
    // J. Asesmen
    asesmen: "",
    // K. Tindak Lanjut
    tindakLanjut: "",
    // L. Refleksi Guru
    refleksiGuru: ""
  })

  // Fetch school profile, user data, and templates on mount
  useEffect(() => {
    fetchSchoolProfile()
    fetchUserAndClasses()
    fetchTemplates()
  }, [])

  const fetchUserAndClasses = async () => {
    try {
      const localName = localStorage.getItem('userName')
      if (localName) {
        setFormData(prev => ({
          ...prev,
          guru: localName
        }))
      }
    } catch (error) {
      console.error('Error fetching user data from localStorage:', error)
    }
  }

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

  const fetchTemplates = async (overrideKu?: string) => {
    try {
      setFetchingTemplates(true)
      const ku = overrideKu || kelompokUsiaFilter
      const response = await fetch(`/api/template-kbc/list?kelompokUsia=${encodeURIComponent(ku)}&status=published`)
      const data = await response.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setFetchingTemplates(false)
    }
  }


  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplateId(templateId)

    if (!templateId) {
      setSelectedTemplate(null)
      return
    }

    try {
      const response = await fetch(`/api/template-kbc/detail?id=${templateId}`)
      const data = await response.json()

      if (data.success && data.template) {
        const t = data.template
        setSelectedTemplate(t)

        // Parse JSON fields with safe defaults
        const nilaiCinta = t.nilaiCinta || {
          cintaAllah: "",
          cintaRasulullah: "",
          cintaDiriSendiri: "",
          cintaSesama: "",
          cintaLingkungan: "",
          cintaBangsaNegara: ""
        }
        const dimensiKelulusan = t.dimensiKelulusan || {
          keimananKetakwaan: "",
          kewargaan: "",
          penalaranKritis: "",
          kreativitas: "",
          kolaborasi: "",
          kemandirian: "",
          kesehatan: "",
          komunikasi: ""
        }
        const saranaMediaBahan = t.saranaMediaBahan || {
          sarana: "",
          media: "",
          bahan: ""
        }
        const langkahPembelajaran = t.langkahPembelajaran || {
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

        // Auto-fill ALL 12 sections from KBC template
        setFormData(prev => ({
          ...prev,
          // A. Identitas
          fase: t.fase || prev.fase,
          kelompokUsia: t.kelompokUsia || prev.kelompokUsia,
          semester: t.semester || prev.semester,
          // B. Capaian Pembelajaran
          tema: t.tema || "",
          subtema: t.subtema || "",
          capaianPembelajaran: t.capaianPembelajaran || "",
          // C. Tujuan Pembelajaran
          tujuanPembelajaran: t.tujuanPembelajaran || "",
          // D. 6 Nilai Cinta
          nilaiCinta,
          // E. 8 Dimensi Kelulusan KBC Kemenag
          dimensiKelulusan,
          // F. Pemahaman Bermakna
          pemahamanBermakna: t.pemahamanBermakna || "",
          // G. Pertanyaan Pemantik
          pertanyaanPemantik: t.pertanyaanPemantik || "",
          // H. Sarana, Media, Bahan
          saranaMediaBahan,
          // I. Langkah Pembelajaran
          langkahPembelajaran,
          // J. Asesmen
          asesmen: t.asesmen || "",
          // K. Tindak Lanjut
          tindakLanjut: t.tindakLanjut || "",
          // L. Refleksi Guru
          refleksiGuru: t.refleksiGuru || ""
        }))

        toast({
          title: "Template dimuat",
          description: `Template "${t.nama || t.tema}" berhasil dimuat. Periksa dan sesuaikan isian jika perlu.`
        })
      }
    } catch (error) {
      console.error('Error fetching template:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat template"
      })
    }
  }


  // Build the body for API calls (save, export)
  const buildApiBody = () => ({
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

  const handleExport = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/rpp/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildApiBody()),
      })

      if (!response.ok) {
        throw new Error('Gagal mengekspor RPP')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${formData.tema || 'Baru'}-${new Date().toISOString().split('T')[0]}.docx`
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

  // Auto-load template from URL param (when coming from Bank Template page)
  useEffect(() => {
    if (!urlTemplateId) return
    let cancelled = false
    const loadFromUrl = async () => {
      try {
        // Fetch template detail to get its kelompok usia
        const res = await fetch(`/api/template-kbc/detail?id=${urlTemplateId}`)
        const data = await res.json()
        if (cancelled || !data.success || !data.template) return
        // Set filter to match the template's kelompok usia
        setKelompokUsiaFilter(data.template.kelompokUsia)
        // Re-fetch templates for the correct kelompok usia
        const ku = data.template.kelompokUsia
        const listRes = await fetch(`/api/template-kbc/list?kelompokUsia=${encodeURIComponent(ku)}&status=published`)
        const listData = await listRes.json()
        if (cancelled || !listData.success) return
        setTemplates(listData.templates)
        // Now select the template and fill the form
        setSelectedTemplateId(urlTemplateId)
        handleTemplateChange(urlTemplateId)
      } catch (error) {
        console.error('Error auto-loading template from URL:', error)
      }
    }
    // Wait a moment for initial load, then override
    const timer = setTimeout(loadFromUrl, 100)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [urlTemplateId])

  const handlePreviewPDF = async () => {
    try {
      setLoadingPDF(true)

      const response = await fetch('/api/rpp/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildApiBody()),
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
        body: JSON.stringify(buildApiBody()),
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${formData.tema || 'Baru'}-${new Date().toISOString().split('T')[0]}.pdf`
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

  const handleSave = async () => {
    if (!formData.tema || !formData.subtema) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Mohon lengkapi field yang diperlukan: Tema dan Subtema"
      })
      return
    }

    try {
      setSaving(true)
      
      const response = await fetch('/api/rpp/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildApiBody())
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "RPP berhasil disimpan"
        })
        router.push('/dashboard/guru/perencanaan')
      } else {
        throw new Error(data.error || 'Gagal menyimpan RPP')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan RPP"
      })
    } finally {
      setSaving(false)
    }
  }

  const formatPreviewText = (text: string) => {
    if (!text) return '-'
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2">{line}</p>
    ))
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Buat RPP KBC Baru</h1>
            <p className="text-muted-foreground mt-1">
              Rencana Pelaksanaan Pembelajaran Kurikulum Berbasis Cinta
              {schoolProfile && (
                <span className="ml-2 text-sm text-primary">• {schoolProfile.name}</span>
              )}
            </p>
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
                  RPP ini menggunakan format KBC Kemenag dengan 12 bagian (A-L). Pilih template dari Bank Template KBC untuk mengisi otomatis semua bagian, lalu sesuaikan isian yang diperlukan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pilih Template KBC</CardTitle>
                <CardDescription>Pilih template dari Bank Template KBC untuk mengisi semua bagian otomatis</CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <Button onClick={handlePreviewPDF} disabled={loadingPDF} variant="outline" size="sm">
                  {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Eye className="mr-2 h-4 w-4" />
                  Preview PDF
                </Button>
                <Button onClick={handleSave} disabled={saving} variant="outline" size="sm">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
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
          </CardHeader>
          <CardContent className="space-y-4">
            {fetchingTemplates ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memuat template...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-48 shrink-0">
                  <Select value={kelompokUsiaFilter} onValueChange={(v) => {
                    setKelompokUsiaFilter(v)
                    setSelectedTemplateId("")
                    setSelectedTemplate(null)
                    fetchTemplates(v)
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kelompok A (4-5 Tahun)">Kelompok A</SelectItem>
                      <SelectItem value="Kelompok B (5-6 Tahun)">Kelompok B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={templates.length === 0 ? "Belum ada template untuk kelompok usia ini." : "Pilih template untuk mengisi otomatis..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.nama || `${t.tema}: ${t.subtema}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => router.push('/dashboard/guru/perencanaan/bank-template')} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Bank Template
                </Button>
                <Button onClick={() => fetchTemplates()} variant="outline" size="icon" title="Refresh template">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Preview Dialog - KBC Full 12 Sections */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Preview: {selectedTemplate?.nama || selectedTemplate?.tema}</DialogTitle>
              <DialogDescription>
                Lihat isi template KBC sebelum mengisi form RPP
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium">Tema:</span> {selectedTemplate?.tema || '-'}</div>
                  <div><span className="font-medium">Subtema:</span> {selectedTemplate?.subtema || '-'}</div>
                  <div><span className="font-medium">Kelompok Usia:</span> {selectedTemplate?.kelompokUsia || '-'}</div>
                </div>
                {/* B */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">B. Capaian Pembelajaran</h3>
                  <Card><CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground whitespace-pre-line">{formatPreviewText(selectedTemplate?.capaianPembelajaran || '')}</div>
                  </CardContent></Card>
                </div>
                {/* C */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">C. Tujuan Pembelajaran</h3>
                  <Card><CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground whitespace-pre-line">{formatPreviewText(selectedTemplate?.tujuanPembelajaran || '')}</div>
                  </CardContent></Card>
                </div>
                {/* D */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">D. Nilai Kurikulum Berbasis Cinta</h3>
                  <Card><CardContent className="pt-4 space-y-2">
                    {selectedTemplate?.nilaiCinta ? Object.entries(selectedTemplate.nilaiCinta).map(([key, val]: [string, any]) => (
                      val && <div key={key}><span className="text-xs font-medium text-muted-foreground uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}:</span><p className="text-sm mt-0.5 whitespace-pre-line">{val}</p></div>
                    )) : <p className="text-sm text-muted-foreground italic">Belum ada data</p>}
                  </CardContent></Card>
                </div>
                {/* E */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">E. Dimensi Kelulusan KBC Kemenag</h3>
                  <Card><CardContent className="pt-4 space-y-2">
                    {selectedTemplate?.dimensiKelulusan ? Object.entries(selectedTemplate.dimensiKelulusan).map(([key, val]: [string, any]) => (
                      val && <div key={key}><span className="text-xs font-medium text-muted-foreground uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}:</span><p className="text-sm mt-0.5 whitespace-pre-line">{val}</p></div>
                    )) : <p className="text-sm text-muted-foreground italic">Belum ada data</p>}
                  </CardContent></Card>
                </div>
                {/* F */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">F. Pemahaman Bermakna</h3>
                  <Card><CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground whitespace-pre-line">{formatPreviewText(selectedTemplate?.pemahamanBermakna || '')}</div>
                  </CardContent></Card>
                </div>
                {/* G */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">G. Pertanyaan Pemantik</h3>
                  <Card><CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground whitespace-pre-line">{formatPreviewText(selectedTemplate?.pertanyaanPemantik || '')}</div>
                  </CardContent></Card>
                </div>
                {/* H */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">H. Sarana, Media, dan Bahan</h3>
                  <Card><CardContent className="pt-4 space-y-2">
                    {selectedTemplate?.saranaMediaBahan ? (selectedTemplate.saranaMediaBahan.sarana || selectedTemplate.saranaMediaBahan.media || selectedTemplate.saranaMediaBahan.bahan) ? (
                      <>
                        {selectedTemplate.saranaMediaBahan.sarana && <div><span className="text-xs font-medium">Sarana:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.saranaMediaBahan.sarana}</p></div>}
                        {selectedTemplate.saranaMediaBahan.media && <div><span className="text-xs font-medium">Media:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.saranaMediaBahan.media}</p></div>}
                        {selectedTemplate.saranaMediaBahan.bahan && <div><span className="text-xs font-medium">Bahan:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.saranaMediaBahan.bahan}</p></div>}
                      </>
                    ) : <p className="text-sm text-muted-foreground italic">Belum ada data</p> : <p className="text-sm text-muted-foreground italic">Belum ada data</p>}
                  </CardContent></Card>
                </div>
                {/* I */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">I. Langkah Pembelajaran</h3>
                  <Card><CardContent className="pt-4 space-y-2">
                    {selectedTemplate?.langkahPembelajaran ? (
                      <>
                        {selectedTemplate.langkahPembelajaran.penyambutan && <div><span className="text-xs font-medium">Penyambutan:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.penyambutan}</p></div>}
                        {selectedTemplate.langkahPembelajaran.pembukaan && <div><span className="text-xs font-medium">Pembukaan:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.pembukaan}</p></div>}
                        {selectedTemplate.langkahPembelajaran.kegiatanInti && (
                          <div className="space-y-2">
                            <span className="text-xs font-medium">Kegiatan Inti:</span>
                            {selectedTemplate.langkahPembelajaran.kegiatanInti.eksplorasi && <div><span className="text-xs text-muted-foreground">Eksplorasi:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.kegiatanInti.eksplorasi}</p></div>}
                            {selectedTemplate.langkahPembelajaran.kegiatanInti.bermain && <div><span className="text-xs text-muted-foreground">Bermain:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.kegiatanInti.bermain}</p></div>}
                            {selectedTemplate.langkahPembelajaran.kegiatanInti.berkarya && <div><span className="text-xs text-muted-foreground">Berkarya:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.kegiatanInti.berkarya}</p></div>}
                            {selectedTemplate.langkahPembelajaran.kegiatanInti.refleksi && <div><span className="text-xs text-muted-foreground">Refleksi:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.kegiatanInti.refleksi}</p></div>}
                          </div>
                        )}
                        {selectedTemplate.langkahPembelajaran.penutup && <div><span className="text-xs font-medium">Penutup:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.penutup}</p></div>}
                      </>
                    ) : <p className="text-sm text-muted-foreground italic">Belum ada data</p>}
                  </CardContent></Card>
                </div>
                {/* J */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">J. Asesmen</h3>
                  <Card><CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground whitespace-pre-line">{formatPreviewText(selectedTemplate?.asesmen || '')}</div>
                  </CardContent></Card>
                </div>
                {/* K & L */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">K & L. Tindak Lanjut & Refleksi Guru</h3>
                  <Card><CardContent className="pt-4 space-y-3">
                    <div><span className="text-xs font-medium">Tindak Lanjut:</span><p className="text-sm mt-0.5 whitespace-pre-line">{formatPreviewText(selectedTemplate?.tindakLanjut || '-')}</p></div>
                    <div><span className="text-xs font-medium">Refleksi Guru:</span><p className="text-sm mt-0.5 whitespace-pre-line">{formatPreviewText(selectedTemplate?.refleksiGuru || '-')}</p></div>
                  </CardContent></Card>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

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
                  <Select value={formData.semester} onValueChange={(v) => setFormData({...formData, semester: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ganjil">Ganjil</SelectItem>
                      <SelectItem value="Genap">Genap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tahun Ajaran</Label>
                  <Input value={formData.tahunAjaran} onChange={(e) => setFormData({...formData, tahunAjaran: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Hari</Label>
                  <Input value={formData.hari} onChange={(e) => setFormData({...formData, hari: e.target.value})} placeholder="Contoh: Selasa" />
                </div>
                <div className="space-y-2">
                  <Label>Jumlah Pertemuan</Label>
                  <Input value={formData.jumlahPertemuan} onChange={(e) => setFormData({...formData, jumlahPertemuan: e.target.value})} placeholder="Contoh: 8 JP" />
                </div>
                <div className="space-y-2">
                  <Label>Kelas</Label>
                  <Input value={formData.kelas} onChange={(e) => setFormData({...formData, kelas: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Guru</Label>
                  <Input value={formData.guru} onChange={(e) => setFormData({...formData, guru: e.target.value})} />
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
                  <Input value={formData.tema} onChange={(e) => setFormData({...formData, tema: e.target.value})} placeholder="Contoh: Lingkungan Sekitarku" />
                </div>
                <div className="space-y-2">
                  <Label>Subtema *</Label>
                  <Input value={formData.subtema} onChange={(e) => setFormData({...formData, subtema: e.target.value})} placeholder="Contoh: Mesjid tempat ibadah" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Capaian Pembelajaran</Label>
                <Textarea
                  value={formData.capaianPembelajaran}
                  onChange={(e) => setFormData({...formData, capaianPembelajaran: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, tujuanPembelajaran: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, nilaiCinta: {...formData.nilaiCinta, cintaAllah: e.target.value}})}
                    rows={3}
                    placeholder="Nilai cinta kepada Allah SWT..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Rasulullah SAW</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaRasulullah}
                    onChange={(e) => setFormData({...formData, nilaiCinta: {...formData.nilaiCinta, cintaRasulullah: e.target.value}})}
                    rows={3}
                    placeholder="Nilai cinta kepada Rasulullah SAW..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Diri Sendiri</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaDiriSendiri}
                    onChange={(e) => setFormData({...formData, nilaiCinta: {...formData.nilaiCinta, cintaDiriSendiri: e.target.value}})}
                    rows={3}
                    placeholder="Nilai cinta kepada diri sendiri..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Sesama</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaSesama}
                    onChange={(e) => setFormData({...formData, nilaiCinta: {...formData.nilaiCinta, cintaSesama: e.target.value}})}
                    rows={3}
                    placeholder="Nilai cinta kepada sesama..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Lingkungan</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaLingkungan}
                    onChange={(e) => setFormData({...formData, nilaiCinta: {...formData.nilaiCinta, cintaLingkungan: e.target.value}})}
                    rows={3}
                    placeholder="Nilai cinta kepada lingkungan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Bangsa & Negara</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaBangsaNegara}
                    onChange={(e) => setFormData({...formData, nilaiCinta: {...formData.nilaiCinta, cintaBangsaNegara: e.target.value}})}
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
                    onChange={(e) => setFormData({...formData, dimensiKelulusan: {...formData.dimensiKelulusan, keimananKetakwaan: e.target.value}})}
                    rows={3}
                    placeholder="Dimensi keimanan & ketakwaan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kewargaan</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kewargaan}
                    onChange={(e) => setFormData({...formData, dimensiKelulusan: {...formData.dimensiKelulusan, kewargaan: e.target.value}})}
                    rows={3}
                    placeholder="Dimensi kewargaan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Penalaran Kritis</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.penalaranKritis}
                    onChange={(e) => setFormData({...formData, dimensiKelulusan: {...formData.dimensiKelulusan, penalaranKritis: e.target.value}})}
                    rows={3}
                    placeholder="Dimensi penalaran kritis..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kreativitas</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kreativitas}
                    onChange={(e) => setFormData({...formData, dimensiKelulusan: {...formData.dimensiKelulusan, kreativitas: e.target.value}})}
                    rows={3}
                    placeholder="Dimensi kreativitas..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kolaborasi</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kolaborasi}
                    onChange={(e) => setFormData({...formData, dimensiKelulusan: {...formData.dimensiKelulusan, kolaborasi: e.target.value}})}
                    rows={3}
                    placeholder="Dimensi kolaborasi..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kemandirian</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kemandirian}
                    onChange={(e) => setFormData({...formData, dimensiKelulusan: {...formData.dimensiKelulusan, kemandirian: e.target.value}})}
                    rows={3}
                    placeholder="Dimensi kemandirian..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kesehatan</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kesehatan}
                    onChange={(e) => setFormData({...formData, dimensiKelulusan: {...formData.dimensiKelulusan, kesehatan: e.target.value}})}
                    rows={3}
                    placeholder="Dimensi kesehatan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Komunikasi</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.komunikasi}
                    onChange={(e) => setFormData({...formData, dimensiKelulusan: {...formData.dimensiKelulusan, komunikasi: e.target.value}})}
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
                  onChange={(e) => setFormData({...formData, pemahamanBermakna: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, pertanyaanPemantik: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, saranaMediaBahan: {...formData.saranaMediaBahan, sarana: e.target.value}})}
                  rows={3}
                  placeholder="Tuliskan sarana yang digunakan..."
                />
              </div>
              <div className="space-y-2">
                <Label>Media Pembelajaran</Label>
                <Textarea
                  value={formData.saranaMediaBahan.media}
                  onChange={(e) => setFormData({...formData, saranaMediaBahan: {...formData.saranaMediaBahan, media: e.target.value}})}
                  rows={3}
                  placeholder="Tuliskan media pembelajaran yang digunakan..."
                />
              </div>
              <div className="space-y-2">
                <Label>Bahan Pembelajaran</Label>
                <Textarea
                  value={formData.saranaMediaBahan.bahan}
                  onChange={(e) => setFormData({...formData, saranaMediaBahan: {...formData.saranaMediaBahan, bahan: e.target.value}})}
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
                    onChange={(e) => setFormData({...formData, langkahPembelajaran: {...formData.langkahPembelajaran, penyambutan: e.target.value}})}
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
                    onChange={(e) => setFormData({...formData, langkahPembelajaran: {...formData.langkahPembelajaran, pembukaan: e.target.value}})}
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
                    onChange={(e) => setFormData({...formData, langkahPembelajaran: {...formData.langkahPembelajaran, kegiatanInti: {...formData.langkahPembelajaran.kegiatanInti, eksplorasi: e.target.value}}})}
                    rows={4}
                    placeholder="Kegiatan eksplorasi..."
                  />
                </div>

                <div className="space-y-2 pl-4">
                  <Label className="font-medium">Bermain</Label>
                  <Textarea
                    value={formData.langkahPembelajaran.kegiatanInti.bermain}
                    onChange={(e) => setFormData({...formData, langkahPembelajaran: {...formData.langkahPembelajaran, kegiatanInti: {...formData.langkahPembelajaran.kegiatanInti, bermain: e.target.value}}})}
                    rows={4}
                    placeholder="Kegiatan bermain..."
                  />
                </div>

                <div className="space-y-2 pl-4">
                  <Label className="font-medium">Berkarya</Label>
                  <Textarea
                    value={formData.langkahPembelajaran.kegiatanInti.berkarya}
                    onChange={(e) => setFormData({...formData, langkahPembelajaran: {...formData.langkahPembelajaran, kegiatanInti: {...formData.langkahPembelajaran.kegiatanInti, berkarya: e.target.value}}})}
                    rows={4}
                    placeholder="Kegiatan berkarya..."
                  />
                </div>

                <div className="space-y-2 pl-4">
                  <Label className="font-medium">Refleksi</Label>
                  <Textarea
                    value={formData.langkahPembelajaran.kegiatanInti.refleksi}
                    onChange={(e) => setFormData({...formData, langkahPembelajaran: {...formData.langkahPembelajaran, kegiatanInti: {...formData.langkahPembelajaran.kegiatanInti, refleksi: e.target.value}}})}
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
                    onChange={(e) => setFormData({...formData, langkahPembelajaran: {...formData.langkahPembelajaran, penutup: e.target.value}})}
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
                  onChange={(e) => setFormData({...formData, asesmen: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, tindakLanjut: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, refleksiGuru: e.target.value})}
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
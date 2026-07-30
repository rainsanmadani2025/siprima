"use client"

// === BAGIAN 4.1: Import, Interface, dan State ===

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
  nilaiCinta: any
  dimensiKelulusan: any
  pemahamanBermakna: string
  pertanyaanPemantik: string
  saranaMediaBahan: any
  langkahPembelajaran: any
  asesmen: string
  tindakLanjut: string
  refleksiGuru: string
}

interface SchoolProfile {
  name: string
  address: string
  phone?: string
  email?: string
  npsn?: string
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
    kelompokUsia: "Kelompok A (4-5 Tahun)",
    semester: getCurrentSemester(),
    tahunAjaran: getCurrentAcademicYear(),
    hari: "",
    jumlahPertemuan: "8 JP",
    kelas: "",
    guru: "",
    tema: "",
    subtema: "",
    capaianPembelajaran: "",
    tujuanPembelajaran: "",
    nilaiCinta: {
      cintaAllah: "", cintaRasulullah: "", cintaDiriSendiri: "",
      cintaSesama: "", cintaLingkungan: "", cintaBangsaNegara: ""
    },
    dimensiKelulusan: {
      keimananKetakwaan: "", kewargaan: "", penalaranKritis: "",
      kreativitas: "", kolaborasi: "", kemandirian: "", kesehatan: "", komunikasi: ""
    },
    pemahamanBermakna: "",
    pertanyaanPemantik: "",
    saranaMediaBahan: { sarana: "", media: "", bahan: "" },
    langkahPembelajaran: {
      penyambutan: "", pembukaan: "",
      kegiatanInti: { eksplorasi: "", bermain: "", berkarya: "", refleksi: "" },
      penutup: ""
    },
    asesmen: "",
    tindakLanjut: "",
    refleksiGuru: "",
  })

    // === BAGIAN 4.2: Functions ===

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

        const nilaiCinta = t.nilaiCinta || {
          cintaAllah: "", cintaRasulullah: "", cintaDiriSendiri: "",
          cintaSesama: "", cintaLingkungan: "", cintaBangsaNegara: ""
        }
        const dimensiKelulusan = t.dimensiKelulusan || {
          keimananKetakwaan: "", kewargaan: "", penalaranKritis: "",
          kreativitas: "", kolaborasi: "", kemandirian: "", kesehatan: "", komunikasi: ""
        }
        const saranaMediaBahan = t.saranaMediaBahan || {
          sarana: "", media: "", bahan: ""
        }
        const langkahPembelajaran = t.langkahPembelajaran || {
          penyambutan: "", pembukaan: "",
          kegiatanInti: { eksplorasi: "", bermain: "", berkarya: "", refleksi: "" },
          penutup: ""
        }

        setFormData(prev => ({
          ...prev,
          kelompokUsia: t.kelompokUsia || prev.kelompokUsia,
          semester: t.semester || prev.semester,
          tema: t.tema || "",
          subtema: t.subtema || "",
          capaianPembelajaran: t.capaianPembelajaran || "",
          tujuanPembelajaran: t.tujuanPembelajaran || "",
          nilaiCinta,
          dimensiKelulusan,
          pemahamanBermakna: t.pemahamanBermakna || "",
          pertanyaanPemantik: t.pertanyaanPemantik || "",
          saranaMediaBahan,
          langkahPembelajaran,
          asesmen: t.asesmen || "",
          tindakLanjut: t.tindakLanjut || "",
          refleksiGuru: t.refleksiGuru || "",
        }))

        toast({ title: "Template dimuat", description: `Template "${t.nama}" berhasil diisi ke form` })
      }
    } catch (error) {
      console.error('Error loading template:', error)
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat template" })
    }
  }

  const buildApiBody = () => ({
    tema: formData.tema,
    subtema: formData.subtema,
    capaianPembelajaran: formData.capaianPembelajaran,
    refleksiGuru: formData.refleksiGuru,
    tindakLanjut: formData.tindakLanjut,
    fase: "Fase Fondasi",
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

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/rpp/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildApiBody()),
      })
      if (!response.ok) throw new Error('Gagal menyimpan RPP')
      toast({ title: "Berhasil", description: "RPP berhasil disimpan" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal menyimpan RPP" })
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/rpp/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildApiBody()),
      })
      if (!response.ok) throw new Error('Gagal mengekspor RPP')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${formData.tema || 'Baru'}-${new Date().toISOString().split('T')[0]}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast({ title: "Berhasil", description: "RPP berhasil diekspor ke Word" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal mengekspor RPP" })
    } finally {
      setLoading(false)
    }
  }

  const handlePreviewPDF = async () => {
    try {
      setLoadingPDF(true)
      const response = await fetch('/api/rpp/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildApiBody()),
      })
      if (!response.ok) throw new Error('Gagal membuat preview PDF')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
      toast({ title: "Berhasil", description: "PDF dibuka di tab baru" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal membuat preview PDF" })
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
      toast({ title: "Berhasil", description: "PDF berhasil diunduh" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal mengekspor PDF" })
    } finally {
      setLoadingPDF(false)
    }
  }

  // === BAGIAN 4.3: useEffects ===

  useEffect(() => {
    fetchSchoolProfile()
    fetchUserAndClasses()
    fetchTemplates()
  }, [])

  useEffect(() => {
    if (!urlTemplateId) return
    let cancelled = false
    const loadFromUrl = async () => {
      try {
        const res = await fetch(`/api/template-kbc/detail?id=${urlTemplateId}`)
        const data = await res.json()
        if (cancelled || !data.success || !data.template) return
        setKelompokUsiaFilter(data.template.kelompokUsia)
        const ku = data.template.kelompokUsia
        const listRes = await fetch(`/api/template-kbc/list?kelompokUsia=${encodeURIComponent(ku)}&status=published`)
        const listData = await listRes.json()
        if (cancelled || !listData.success) return
        setTemplates(listData.templates)
        setSelectedTemplateId(urlTemplateId)
        handleTemplateChange(urlTemplateId)
      } catch (error) {
        console.error('Error auto-loading template from URL:', error)
      }
    }
    const timer = setTimeout(loadFromUrl, 100)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [urlTemplateId])

  const formatPreviewText = (text: string) => {
    if (!text) return ''
    return text.length > 200 ? text.substring(0, 200) + '...' : text
  }

  // === BAGIAN 4.4: JSX Return ===

  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
            <h1 className="text-2xl font-bold">Buat RPP KBC Baru</h1>
            <p className="text-sm text-muted-foreground">
              Format RPP KBC Baru (12 Bagian A-L)
            </p>
            <p className="text-xs text-muted-foreground">
              RPP ini menggunakan format KBC Kemenag dengan 12 bagian (A-L). Pilih template dari Bank Template KBC untuk mengisi otomatis semua bagian, lalu sesuaikan isian yang diperlukan.
            </p>
          </div>
        </div>

        {/* Template Preview Dialog */}
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
                  <h3 className="text-lg font-semibold text-primary">D. Nilai Cinta KBC</h3>
                  <Card><CardContent className="pt-4 space-y-2">
                    {selectedTemplate?.nilaiCinta ? Object.entries(selectedTemplate.nilaiCinta).map(([key, val]: [string, any]) => (
                      <div key={key} className="text-sm"><span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> <span className="text-muted-foreground">{val || '-'}</span></div>
                    )) : <p className="text-sm text-muted-foreground italic">Belum ada data</p>}
                  </CardContent></Card>
                </div>
                {/* E */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">E. Dimensi Kelulusan KBC</h3>
                  <Card><CardContent className="pt-4 space-y-2">
                    {selectedTemplate?.dimensiKelulusan ? Object.entries(selectedTemplate.dimensiKelulusan).map(([key, val]: [string, any]) => (
                      <div key={key} className="text-sm"><span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> <span className="text-muted-foreground">{val || '-'}</span></div>
                    )) : <p className="text-sm text-muted-foreground italic">Belum ada data</p>}
                  </CardContent></Card>
                </div>
                {/* F & G */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-primary">F. Pemahaman Bermakna</h3>
                    <Card><CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground whitespace-pre-line">{formatPreviewText(selectedTemplate?.pemahamanBermakna || '')}</div>
                    </CardContent></Card>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-primary">G. Pertanyaan Pemantik</h3>
                    <Card><CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground whitespace-pre-line">{formatPreviewText(selectedTemplate?.pertanyaanPemantik || '')}</div>
                    </CardContent></Card>
                  </div>
                </div>
                {/* H */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">H. Sarana, Media, Bahan</h3>
                  <Card><CardContent className="pt-4 space-y-2">
                    {selectedTemplate?.saranaMediaBahan ? (
                      <>
                        {selectedTemplate.saranaMediaBahan.sarana && <div><span className="text-xs font-medium">Sarana:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.saranaMediaBahan.sarana}</p></div>}
                        {selectedTemplate.saranaMediaBahan.media && <div><span className="text-xs font-medium">Media:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.saranaMediaBahan.media}</p></div>}
                        {selectedTemplate.saranaMediaBahan.bahan && <div><span className="text-xs font-medium">Bahan:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.saranaMediaBahan.bahan}</p></div>}
                      </>
                    ) : <p className="text-sm text-muted-foreground italic">Belum ada data</p>}
                  </CardContent></Card>
                </div>
                {/* I */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">I. Langkah Pembelajaran</h3>
                  <Card><CardContent className="pt-4 space-y-3">
                    {selectedTemplate?.langkahPembelajaran ? (
                      <>
                        {selectedTemplate.langkahPembelajaran.penyambutan && <div><span className="text-xs font-medium">Penyambutan:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.penyambutan}</p></div>}
                        {selectedTemplate.langkahPembelajaran.pembukaan && <div><span className="text-xs font-medium">Pembukaan:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.pembukaan}</p></div>}
                        {selectedTemplate.langkahPembelajaran.kegiatanInti && (
                          <div className="space-y-2">
                            <span className="text-xs font-medium">Kegiatan Inti:</span>
                            {selectedTemplate.langkahPembelajaran.kegiatanInti.eksplorasi && <div className="ml-2"><span className="text-xs text-muted-foreground">Eksplorasi:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.kegiatanInti.eksplorasi}</p></div>}
                            {selectedTemplate.langkahPembelajaran.kegiatanInti.bermain && <div className="ml-2"><span className="text-xs text-muted-foreground">Bermain:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.kegiatanInti.bermain}</p></div>}
                            {selectedTemplate.langkahPembelajaran.kegiatanInti.berkarya && <div className="ml-2"><span className="text-xs text-muted-foreground">Berkarya:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.kegiatanInti.berkarya}</p></div>}
                            {selectedTemplate.langkahPembelajaran.kegiatanInti.refleksi && <div className="ml-2"><span className="text-xs text-muted-foreground">Refleksi:</span><p className="text-sm mt-0.5 whitespace-pre-line">{selectedTemplate.langkahPembelajaran.kegiatanInti.refleksi}</p></div>}
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

        {/* Template Selection Card */}
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

        {/* === BAGIAN 4.6: Form Sections A-L === */}
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Input value={formData.tema} onChange={(e) => setFormData({...formData, tema: e.target.value})} placeholder="Contoh: Lingkungan Sekitarku" />
              </div>
              <div className="space-y-2">
                <Label>Subtema</Label>
                <Input value={formData.subtema} onChange={(e) => setFormData({...formData, subtema: e.target.value})} placeholder="Contoh: Mesjid tempat ibadah" />
              </div>
              <div className="space-y-2">
                <Label>Capaian Pembelajaran</Label>
                <Textarea value={formData.capaianPembelajaran} onChange={(e) => setFormData({...formData, capaianPembelajaran: e.target.value})} rows={3} placeholder="Tuliskan capaian pembelajaran yang diharapkan..." />
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
              <Textarea value={formData.tujuanPembelajaran} onChange={(e) => setFormData({...formData, tujuanPembelajaran: e.target.value})} rows={4} placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai..." />
            </CardContent>
          </Card>

          {/* D. 6 Nilai Cinta KBC */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">D</span>
                Nilai Cinta KBC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cinta Kepada Allah SWT</Label>
                  <Textarea value={formData.nilaiCinta.cintaAllah} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      nilaiCinta: { ...prev.nilaiCinta, cintaAllah: e.target.value }
                    }))
                  }} rows={2} placeholder="Nilai cinta kepada Allah SWT..." />
                </div>
                <div className="space-y-2">
                  <Label>Cinta Kepada Rasulullah SAW</Label>
                  <Textarea value={formData.nilaiCinta.cintaRasulullah} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      nilaiCinta: { ...prev.nilaiCinta, cintaRasulullah: e.target.value }
                    }))
                  }} rows={2} placeholder="Nilai cinta kepada Rasulullah SAW..." />
                </div>
                <div className="space-y-2">
                  <Label>Cinta Kepada Diri Sendiri</Label>
                  <Textarea value={formData.nilaiCinta.cintaDiriSendiri} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      nilaiCinta: { ...prev.nilaiCinta, cintaDiriSendiri: e.target.value }
                    }))
                  }} rows={2} placeholder="Nilai cinta kepada diri sendiri..." />
                </div>
                <div className="space-y-2">
                  <Label>Cinta Kepada Sesama</Label>
                  <Textarea value={formData.nilaiCinta.cintaSesama} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      nilaiCinta: { ...prev.nilaiCinta, cintaSesama: e.target.value }
                    }))
                  }} rows={2} placeholder="Nilai cinta kepada sesama..." />
                </div>
                <div className="space-y-2">
                  <Label>Cinta Kepada Lingkungan</Label>
                  <Textarea value={formData.nilaiCinta.cintaLingkungan} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      nilaiCinta: { ...prev.nilaiCinta, cintaLingkungan: e.target.value }
                    }))
                  }} rows={2} placeholder="Nilai cinta kepada lingkungan..." />
                </div>
                <div className="space-y-2">
                  <Label>Cinta Kepada Bangsa & Negara</Label>
                  <Textarea value={formData.nilaiCinta.cintaBangsaNegara} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      nilaiCinta: { ...prev.nilaiCinta, cintaBangsaNegara: e.target.value }
                    }))
                  }} rows={2} placeholder="Nilai cinta kepada bangsa & negara..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* E. 8 Dimensi Kelulusan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">E</span>
                Dimensi Kelulusan KBC Kemenag
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Keimanan & Ketakwaan</Label>
                  <Textarea value={formData.dimensiKelulusan.keimananKetakwaan} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      dimensiKelulusan: { ...prev.dimensiKelulusan, keimananKetakwaan: e.target.value }
                    }))
                  }} rows={2} placeholder="Dimensi keimanan & ketakwaan..." />
                </div>
                <div className="space-y-2">
                  <Label>Kewargaan</Label>
                  <Textarea value={formData.dimensiKelulusan.kewargaan} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      dimensiKelulusan: { ...prev.dimensiKelulusan, kewargaan: e.target.value }
                    }))
                  }} rows={2} placeholder="Dimensi kewargaan..." />
                </div>
                <div className="space-y-2">
                  <Label>Penalaran Kritis</Label>
                  <Textarea value={formData.dimensiKelulusan.penalaranKritis} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      dimensiKelulusan: { ...prev.dimensiKelulusan, penalaranKritis: e.target.value }
                    }))
                  }} rows={2} placeholder="Dimensi penalaran kritis..." />
                </div>
                <div className="space-y-2">
                  <Label>Kreativitas</Label>
                  <Textarea value={formData.dimensiKelulusan.kreativitas} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      dimensiKelulusan: { ...prev.dimensiKelulusan, kreativitas: e.target.value }
                    }))
                  }} rows={2} placeholder="Dimensi kreativitas..." />
                </div>
                <div className="space-y-2">
                  <Label>Kolaborasi</Label>
                  <Textarea value={formData.dimensiKelulusan.kolaborasi} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      dimensiKelulusan: { ...prev.dimensiKelulusan, kolaborasi: e.target.value }
                    }))
                  }} rows={2} placeholder="Dimensi kolaborasi..." />
                </div>
                <div className="space-y-2">
                  <Label>Kemandirian</Label>
                  <Textarea value={formData.dimensiKelulusan.kemandirian} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      dimensiKelulusan: { ...prev.dimensiKelulusan, kemandirian: e.target.value }
                    }))
                  }} rows={2} placeholder="Dimensi kemandirian..." />
                </div>
                <div className="space-y-2">
                  <Label>Kesehatan</Label>
                  <Textarea value={formData.dimensiKelulusan.kesehatan} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      dimensiKelulusan: { ...prev.dimensiKelulusan, kesehatan: e.target.value }
                    }))
                  }} rows={2} placeholder="Dimensi kesehatan..." />
                </div>
                <div className="space-y-2">
                  <Label>Komunikasi</Label>
                  <Textarea value={formData.dimensiKelulusan.komunikasi} onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      dimensiKelulusan: { ...prev.dimensiKelulusan, komunikasi: e.target.value }
                    }))
                  }} rows={2} placeholder="Dimensi komunikasi..." />
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
              <Textarea value={formData.pemahamanBermakna} onChange={(e) => setFormData({...formData, pemahamanBermakna: e.target.value})} rows={3} placeholder="Tuliskan pemahaman bermakna yang ingin dicapai..." />
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
              <Textarea value={formData.pertanyaanPemantik} onChange={(e) => setFormData({...formData, pertanyaanPemantik: e.target.value})} rows={3} placeholder="Tuliskan pertanyaan pemantik untuk memulai pembelajaran..." />
            </CardContent>
          </Card>

          {/* H. Sarana, Media, Bahan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">H</span>
                Sarana, Media, dan Bahan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sarana</Label>
                <Textarea value={formData.saranaMediaBahan.sarana} onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    saranaMediaBahan: { ...prev.saranaMediaBahan, sarana: e.target.value }
                  }))
                }} rows={2} placeholder="Tuliskan sarana yang digunakan..." />
              </div>
              <div className="space-y-2">
                <Label>Media Pembelajaran</Label>
                <Textarea value={formData.saranaMediaBahan.media} onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    saranaMediaBahan: { ...prev.saranaMediaBahan, media: e.target.value }
                  }))
                }} rows={2} placeholder="Tuliskan media pembelajaran yang digunakan..." />
              </div>
              <div className="space-y-2">
                <Label>Bahan Pembelajaran</Label>
                <Textarea value={formData.saranaMediaBahan.bahan} onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    saranaMediaBahan: { ...prev.saranaMediaBahan, bahan: e.target.value }
                  }))
                }} rows={2} placeholder="Tuliskan bahan pembelajaran yang digunakan..." />
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
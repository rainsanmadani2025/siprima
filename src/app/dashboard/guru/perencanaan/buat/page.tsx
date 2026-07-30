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
import { Download, ArrowLeft, Loader2, Plus, RefreshCw, Eye, Sparkles, FileDown, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Template {
  id: string
  tema: string
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

export default function BuatRPPPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fetchingTemplates, setFetchingTemplates] = useState(true)
  const [generatingTemplate, setGeneratingTemplate] = useState(false)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [newTema, setNewTema] = useState("")
  const { toast } = useToast()

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const [formData, setFormData] = useState({
    fase: "Fase Fondasi",
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
      cintaAllah: "",
      cintaRasulullah: "",
      cintaDiriSendiri: "",
      cintaSesama: "",
      cintaLingkungan: "",
      cintaBangsaNegara: ""
    },
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
    pemahamanBermakna: "",
    pertanyaanPemantik: "",
    saranaMediaBahan: {
      sarana: "",
      media: "",
      bahan: ""
    },
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
    asesmen: "",
    tindakLanjut: "",
    refleksiGuru: ""
  })

  useEffect(() => {
    fetchSchoolProfile()
    fetchUserAndClasses()
    fetchTemplates()
  }, [])

  const fetchUserAndClasses = async () => {
    try {
      const localName = localStorage.getItem('userName')
      if (localName) {
        setFormData(prev => ({ ...prev, guru: localName }))
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

  const fetchTemplates = async () => {
    try {
      setFetchingTemplates(true)
      const response = await fetch('/api/rpp-template-list')
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

  const handleGenerateTemplate = async () => {
    if (!newTema.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Tema harus diisi" })
      return
    }
    let isRequestActive = true
    const controller = new AbortController()
    const timeoutId = setTimeout(() => { if (isRequestActive) controller.abort() }, 65000)
    try {
      setGeneratingTemplate(true)
      const response = await fetch('/api/rpp/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema: newTema.trim(), kelompokUsia: formData.kelompokUsia, topikKBC: "" }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      isRequestActive = false
      if (!response.ok) {
        if (response.status === 401) throw new Error('401: API Key belum dikonfigurasi. Fitur AI tidak tersedia.')
        throw new Error(`Gagal membuat template. Server error: ${response.status}`)
      }
      try {
        const responseText = await response.text()
        if (!responseText.trim()) throw new Error('Response kosong dari server')
        const data = JSON.parse(responseText)
        if (data.success) {
          const message = data.updated ? `Template "${newTema}" berhasil diperbarui` : `Template "${newTema}" berhasil dibuat dan tersedia untuk dipilih`
          toast({ title: data.updated ? "Template Diperbarui" : "Template Berhasil Dibuat", description: message })
          setNewTema("")
          setGenerateDialogOpen(false)
          await fetchTemplates()
        } else {
          throw new Error(data.error || 'Gagal membuat template')
        }
      } catch (parseError) {
        console.error('[Generate Template] Parse error:', parseError)
        throw new Error(`Gagal membuat template. Server error: ${response.status}`)
      }
    } catch (error: any) {
      const isTimeout = error.name === 'AbortError' && isRequestActive
      isRequestActive = false
      console.error('Error generating template:', error)
      if (error.message.includes('502')) {
        toast({ variant: "destructive", title: "Server Sibuk", description: "Server sedang sibuk memproses permintaan. Silakan coba lagi." })
      } else if (isTimeout) {
        toast({ variant: "destructive", title: "Timeout", description: "Server tidak merespon dalam waktu 65 detik." })
      } else if (error.message && error.message.includes('401')) {
        toast({ variant: "destructive", title: "Fitur AI Tidak Tersedia", description: "Fitur generate template memerlukan konfigurasi API Key." })
      } else if (error.name !== 'AbortError') {
        let errorMessage = error.message || "Gagal membuat template"
        if (errorMessage.includes('<') && errorMessage.includes('>')) errorMessage = "Gagal membuat template. Silakan coba lagi."
        toast({ variant: "destructive", title: "Error", description: errorMessage })
      }
    } finally {
      clearTimeout(timeoutId)
      setGeneratingTemplate(false)
    }
  }

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplateId(templateId)
    if (!templateId) { setSelectedTemplate(null); return }
    try {
      const response = await fetch(`/api/rpp-template-detail?id=${templateId}`)
      const data = await response.json()
      if (data.success && data.template) {
        const template = data.template
        setSelectedTemplate(template)
        setFormData(prev => ({
          ...prev,
          tema: template.tema || "",
          subtema: prev.subtema,
          capaianPembelajaran: template.profilLulusan || "",
          tujuanPembelajaran: template.tujuanPembelajaran || "",
          pemahamanBermakna: template.tujuanPembelajaranMendalam || "",
          pertanyaanPemantik: template.materiIntegrasiKBC || "",
          nilaiCinta: { cintaAllah: "", cintaRasulullah: "", cintaDiriSendiri: "", cintaSesama: "", cintaLingkungan: "", cintaBangsaNegara: "" },
          dimensiKelulusan: { keimananKetakwaan: "", kewargaan: "", penalaranKritis: "", kreativitas: "", kolaborasi: "", kemandirian: "", kesehatan: "", komunikasi: "" },
          saranaMediaBahan: { sarana: "", media: "", bahan: "" },
          langkahPembelajaran: { penyambutan: "", pembukaan: "", kegiatanInti: { eksplorasi: "", bermain: "", berkarya: "", refleksi: "" }, penutup: "" },
          asesmen: "",
          tindakLanjut: "",
          refleksiGuru: ""
        }))
        toast({ title: "Template dimuat", description: `Template "${template.tema}" berhasil dimuat. Beberapa bagian perlu diisi manual karena format baru.` })
      }
    } catch (error) {
      console.error('Error fetching template:', error)
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat template" })
    }
  }

  const handleGenerateVariation = async () => {
    if (!selectedTemplate) return
    const tema = selectedTemplate.tema
    let isRequestActive = true
    const controller = new AbortController()
    const timeoutId = setTimeout(() => { if (isRequestActive) controller.abort() }, 65000)
    try {
      setGeneratingTemplate(true)
      const response = await fetch('/api/rpp/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, kelompokUsia: formData.kelompokUsia, topikKBC: "" }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      isRequestActive = false
      if (!response.ok) {
        try {
          const responseText = await response.text()
          const errorData = JSON.parse(responseText)
          throw new Error(errorData.error || `Gagal membuat variasi template. Server error: ${response.status}`)
        } catch (parseError) {
          if (response.status === 503) throw new Error('Fitur AI tidak tersedia.')
          else if (response.status === 429) throw new Error('Rate limit tercapai.')
          throw new Error(`Gagal membuat variasi template. Server error: ${response.status}`)
        }
      }
      let data
      try { data = JSON.parse(await response.text()) } catch { throw new Error('Gagal membuat variasi template.') }
      if (data.success) {
        toast({ title: "Variasi template berhasil dibuat", description: `Variasi baru untuk tema "${tema}" telah dibuat.` })
        await fetchTemplates()
        const newTemplates = await (await fetch('/api/rpp-template-list')).json()
        if (newTemplates.success && newTemplates.templates.length > 0) {
          handleTemplateChange(newTemplates.templates[newTemplates.templates.length - 1].id)
        }
      } else { throw new Error(data.error || 'Gagal membuat variasi template') }
    } catch (error: any) {
      const isTimeout = error.name === 'AbortError' && isRequestActive
      isRequestActive = false
      console.error('Error generating variation:', error)
      if (isTimeout) {
        toast({ variant: "destructive", title: "Timeout", description: "Server tidak merespon dalam waktu 65 detik." })
      } else if (error.name !== 'AbortError') {
        let errorMessage = error.message || "Gagal membuat variasi template"
        if (errorMessage.includes('<') && errorMessage.includes('>')) errorMessage = "Gagal membuat variasi template. Server error."
        toast({ variant: "destructive", title: "Error", description: errorMessage })
      }
    } finally {
      clearTimeout(timeoutId)
      setGeneratingTemplate(false)
    }
  }

  const buildApiBody = () => ({
    tema: formData.tema, subtema: formData.subtema, capaianPembelajaran: formData.capaianPembelajaran,
    refleksiGuru: formData.refleksiGuru, tindakLanjut: formData.tindakLanjut, fase: formData.fase,
    kelompokUsia: formData.kelompokUsia, semester: formData.semester, tahunAjaran: formData.tahunAjaran,
    hari: formData.hari, jumlahPertemuan: formData.jumlahPertemuan, kelas: formData.kelas, guru: formData.guru,
    nilaiCinta: formData.nilaiCinta, dimensiKelulusan: formData.dimensiKelulusan,
    pemahamanBermakna: formData.pemahamanBermakna, pertanyaanPemantik: formData.pertanyaanPemantik,
    tujuanPembelajaran: formData.tujuanPembelajaran, saranaMediaBahan: formData.saranaMediaBahan,
    langkahPembelajaran: formData.langkahPembelajaran, asesmen: formData.asesmen,
    namaSekolah: schoolProfile?.name || "RA INSAN MADANI", alamatSekolah: schoolProfile?.address || ""
  })

  const handleExport = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/rpp/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildApiBody()) })
      if (!response.ok) throw new Error('Gagal mengekspor RPP')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${formData.tema || 'Baru'}-${new Date().toISOString().split('T')[0]}.docx`
      document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(url)
      toast({ title: "Berhasil", description: "RPP berhasil diekspor ke Word" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal mengekspor RPP" })
    } finally { setLoading(false) }
  }

  const handlePreviewPDF = async () => {
    try {
      setLoadingPDF(true)
      const response = await fetch('/api/rpp/export-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildApiBody()) })
      if (!response.ok) throw new Error('Gagal membuat preview PDF')
      const blob = await response.blob()
      window.open(window.URL.createObjectURL(blob), '_blank')
      toast({ title: "Berhasil", description: "PDF dibuka di tab baru" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal membuat preview PDF" })
    } finally { setLoadingPDF(false) }
  }

  const handleExportPDF = async () => {
    try {
      setLoadingPDF(true)
      const response = await fetch('/api/rpp/export-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildApiBody()) })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${formData.tema || 'Baru'}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(url)
      toast({ title: "Berhasil", description: "RPP berhasil diekspor ke PDF" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal mengekspor RPP ke PDF" })
    } finally { setLoadingPDF(false) }
  }

  const handleSave = async () => {
    if (!formData.tema || !formData.subtema) {
      toast({ variant: "destructive", title: "Error", description: "Mohon lengkapi: Tema dan Subtema" }); return
    }
    try {
      setSaving(true)
      const response = await fetch('/api/rpp/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildApiBody()) })
      const data = await response.json()
      if (data.success) { toast({ title: "Berhasil", description: "RPP berhasil disimpan" }); router.push('/dashboard/guru/perencanaan') }
      else { throw new Error(data.error || 'Gagal menyimpan RPP') }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal menyimpan RPP" })
    } finally { setSaving(false) }
  }

  const formatPreviewText = (text: string) => {
    if (!text) return '-'
    return text.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)
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
                  RPP ini menggunakan format baru KBC Kemenag dengan 12 bagian (A-L). Template lama akan mengisi bagian B, C, F, dan G secara otomatis. Bagian D, E, H, I, J perlu diisi manual oleh guru.
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
                <CardTitle>Pilih Template Tema</CardTitle>
                <CardDescription>Pilih template atau buat template baru untuk mengisi form RPP</CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                {selectedTemplate && (
                  <>
                    <Button onClick={handleGenerateVariation} variant="outline" size="sm" disabled={generatingTemplate}>
                      {generatingTemplate ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memuat...</>) : (<><Sparkles className="mr-2 h-4 w-4" />Generate Variasi Baru</>)}
                    </Button>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">⚠️ Fitur AI belum tersedia</span>
                  </>
                )}
                <Button onClick={handlePreviewPDF} disabled={loadingPDF} variant="outline" size="sm">
                  {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Eye className="mr-2 h-4 w-4" />Preview PDF
                </Button>
                <Button onClick={handleSave} disabled={saving} variant="outline" size="sm">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />Simpan
                </Button>
                <Button onClick={handleExportPDF} disabled={loadingPDF} variant="outline" size="sm">
                  {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <FileDown className="mr-2 h-4 w-4" />Export PDF
                </Button>
                <Button onClick={handleExport} disabled={loading} variant="outline" size="sm">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Download className="mr-2 h-4 w-4" />Export Word
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fetchingTemplates ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /><span>Memuat template...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={templates.length === 0 ? "Belum ada template. Buat template baru dulu." : "Pilih template untuk mengisi otomatis..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>{template.tema}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setGenerateDialogOpen(true)} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />Buat Template Baru
                </Button>
                <Button onClick={fetchTemplates} variant="outline" size="icon" title="Refresh template">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Template Dialog */}
        <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Template Baru</DialogTitle>
              <DialogDescription>Masukkan nama tema untuk membuat template RPP KBC baru secara otomatis</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tema *</Label>
                <Input value={newTema} onChange={(e) => setNewTema(e.target.value)} placeholder="Contoh: Alam Semesta, Pahlawanku, dll." disabled={generatingTemplate} />
              </div>
              <div className="bg-muted/50 p-3 rounded text-sm text-muted-foreground">
                <p><strong>Info:</strong> Template akan dibuat otomatis oleh AI dengan konten lengkap sesuai format RPP KBC.</p>
                <p className="mt-2 text-amber-600 dark:text-amber-400"><strong>⏱️ Perhatian:</strong> Proses ini memerlukan waktu sekitar 30-60 detik.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setGenerateDialogOpen(false)} disabled={generatingTemplate}>Batal</Button>
              <Button onClick={handleGenerateTemplate} disabled={generatingTemplate}>
                {generatingTemplate ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memproses (AI bekerja)...</>) : "Buat Template"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Template Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Preview Template: {selectedTemplate?.tema}</DialogTitle>
              <DialogDescription>Lihat isi template sebelum mengisi form RPP</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">B. Capaian Pembelajaran</h3>
                  <Card><CardContent className="pt-4 space-y-3">
                    <div><Label className="font-medium">Tema</Label><p className="text-sm text-muted-foreground mt-1">{selectedTemplate?.tema || '-'}</p></div>
                    <div><Label className="font-medium">Profil Lulusan / Capaian Pembelajaran</Label><p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{formatPreviewText(selectedTemplate?.profilLulusan || '')}</p></div>
                  </CardContent></Card>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">C. Tujuan Pembelajaran</h3>
                  <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground whitespace-pre-line">{formatPreviewText(selectedTemplate?.tujuanPembelajaran || '')}</div></CardContent></Card>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">D. Nilai Kurikulum Berbasis Cinta</h3>
                  <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground italic">Belum tersedia dari template. Nilai Cinta KBC merupakan konsep baru yang perlu diisi manual.</p></CardContent></Card>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">E. Dimensi Kelulusan KBC Kemenag</h3>
                  <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground italic">Belum tersedia dari template. Dimensi Kelulusan KBC merupakan format baru yang perlu diisi manual.</p></CardContent></Card>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">F. Pemahaman Bermakna</h3>
                  <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground whitespace-pre-line">{formatPreviewText(selectedTemplate?.tujuanPembelajaranMendalam || '')}</div></CardContent></Card>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">G. Pertanyaan Pemantik</h3>
                  <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground whitespace-pre-line">{formatPreviewText(selectedTemplate?.materiIntegrasiKBC || '')}</div></CardContent></Card>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">H. Sarana, Media, dan Bahan Pembelajaran</h3>
                  <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground italic">Belum tersedia dari template. Perlu diisi manual oleh guru.</p></CardContent></Card>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">I. Langkah Pembelajaran</h3>
                  <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground italic">Belum tersedia dari template. Langkah pembelajaran format baru perlu diisi manual.</p></CardContent></Card>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">J. Asesmen</h3>
                  <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground italic">Belum tersedia dari template. Perlu diisi manual oleh guru.</p></CardContent></Card>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">K & L. Tindak Lanjut & Refleksi Guru</h3>
                  <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground italic">Selalu diisi manual oleh guru setelah pembelajaran.</p></CardContent></Card>
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
                  <Label>Fase</Label>
                  <Select value={formData.fase} onValueChange={(v) => setFormData({...formData, fase: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Fase Fondasi">Fase Fondasi</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kelompok Usia</Label>
                  <Select value={formData.kelompokUsia} onValueChange={(v) => setFormData({...formData, kelompokUsia: v})}>
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
                    onChange={(e) => setFormData({
                      ...formData,
                      nilaiCinta: { ...formData.nilaiCinta, cintaAllah: e.target.value }
                    })}
                    rows={3}
                    placeholder="Nilai cinta kepada Allah SWT..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Rasulullah SAW</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaRasulullah}
                    onChange={(e) => setFormData({
                      ...formData,
                      nilaiCinta: { ...formData.nilaiCinta, cintaRasulullah: e.target.value }
                    })}
                    rows={3}
                    placeholder="Nilai cinta kepada Rasulullah SAW..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Diri Sendiri</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaDiriSendiri}
                    onChange={(e) => setFormData({
                      ...formData,
                      nilaiCinta: { ...formData.nilaiCinta, cintaDiriSendiri: e.target.value }
                    })}
                    rows={3}
                    placeholder="Nilai cinta kepada diri sendiri..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Sesama</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaSesama}
                    onChange={(e) => setFormData({
                      ...formData,
                      nilaiCinta: { ...formData.nilaiCinta, cintaSesama: e.target.value }
                    })}
                    rows={3}
                    placeholder="Nilai cinta kepada sesama..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Lingkungan</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaLingkungan}
                    onChange={(e) => setFormData({
                      ...formData,
                      nilaiCinta: { ...formData.nilaiCinta, cintaLingkungan: e.target.value }
                    })}
                    rows={3}
                    placeholder="Nilai cinta kepada lingkungan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cinta kepada Bangsa & Negara</Label>
                  <Textarea
                    value={formData.nilaiCinta.cintaBangsaNegara}
                    onChange={(e) => setFormData({
                      ...formData,
                      nilaiCinta: { ...formData.nilaiCinta, cintaBangsaNegara: e.target.value }
                    })}
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
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensiKelulusan: { ...formData.dimensiKelulusan, keimananKetakwaan: e.target.value }
                    })}
                    rows={3} placeholder="Dimensi keimanan & ketakwaan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kewargaan</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kewargaan}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensiKelulusan: { ...formData.dimensiKelulusan, kewargaan: e.target.value }
                    })}
                    rows={3} placeholder="Dimensi kewargaan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Penalaran Kritis</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.penalaranKritis}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensiKelulusan: { ...formData.dimensiKelulusan, penalaranKritis: e.target.value }
                    })}
                    rows={3} placeholder="Dimensi penalaran kritis..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kreativitas</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kreativitas}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensiKelulusan: { ...formData.dimensiKelulusan, kreativitas: e.target.value }
                    })}
                    rows={3} placeholder="Dimensi kreativitas..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kolaborasi</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kolaborasi}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensiKelulusan: { ...formData.dimensiKelulusan, kolaborasi: e.target.value }
                    })}
                    rows={3} placeholder="Dimensi kolaborasi..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kemandirian</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kemandirian}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensiKelulusan: { ...formData.dimensiKelulusan, kemandirian: e.target.value }
                    })}
                    rows={3} placeholder="Dimensi kemandirian..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kesehatan</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.kesehatan}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensiKelulusan: { ...formData.dimensiKelulusan, kesehatan: e.target.value }
                    })}
                    rows={3} placeholder="Dimensi kesehatan..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Komunikasi</Label>
                  <Textarea
                    value={formData.dimensiKelulusan.komunikasi}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensiKelulusan: { ...formData.dimensiKelulusan, komunikasi: e.target.value }
                    })}
                    rows={3} placeholder="Dimensi komunikasi..."
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
                  onChange={(e) => setFormData({
                    ...formData,
                    saranaMediaBahan: { ...formData.saranaMediaBahan, sarana: e.target.value }
                  })}
                  rows={3} placeholder="Tuliskan sarana yang digunakan..."
                />
              </div>
              <div className="space-y-2">
                <Label>Media Pembelajaran</Label>
                <Textarea
                  value={formData.saranaMediaBahan.media}
                  onChange={(e) => setFormData({
                    ...formData,
                    saranaMediaBahan: { ...formData.saranaMediaBahan, media: e.target.value }
                  })}
                  rows={3} placeholder="Tuliskan media pembelajaran yang digunakan..."
                />
              </div>
              <div className="space-y-2">
                <Label>Bahan Pembelajaran</Label>
                <Textarea
                  value={formData.saranaMediaBahan.bahan}
                  onChange={(e) => setFormData({
                    ...formData,
                    saranaMediaBahan: { ...formData.saranaMediaBahan, bahan: e.target.value }
                  })}
                  rows={3} placeholder="Tuliskan bahan pembelajaran yang digunakan..."
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
                    onChange={(e) => setFormData({
                      ...formData,
                      langkahPembelajaran: { ...formData.langkahPembelajaran, penyambutan: e.target.value }
                    })}
                    rows={4} placeholder="Kegiatan penyambutan anak..."
                  />
                </div>
              </div>

              {/* Pembukaan */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">Pembukaan</h4>
                <div className="space-y-2">
                  <Textarea
                    value={formData.langkahPembelajaran.pembukaan}
                    onChange={(e) => setFormData({
                      ...formData,
                      langkahPembelajaran: { ...formData.langkahPembelajaran, pembukaan: e.target.value }
                    })}
                    rows={4} placeholder="Kegiatan pembukaan..."
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
                    onChange={(e) => setFormData({
                      ...formData,
                      langkahPembelajaran: {
                        ...formData.langkahPembelajaran,
                        kegiatanInti: { ...formData.langkahPembelajaran.kegiatanInti, eksplorasi: e.target.value }
                      }
                    })}
                    rows={4} placeholder="Kegiatan eksplorasi..."
                  />
                </div>

                <div className="space-y-2 pl-4">
                  <Label className="font-medium">Bermain</Label>
                  <Textarea
                    value={formData.langkahPembelajaran.kegiatanInti.bermain}
                    onChange={(e) => setFormData({
                      ...formData,
                      langkahPembelajaran: {
                        ...formData.langkahPembelajaran,
                        kegiatanInti: { ...formData.langkahPembelajaran.kegiatanInti, bermain: e.target.value }
                      }
                    })}
                    rows={4} placeholder="Kegiatan bermain..."
                  />
                </div>

                <div className="space-y-2 pl-4">
                  <Label className="font-medium">Berkarya</Label>
                  <Textarea
                    value={formData.langkahPembelajaran.kegiatanInti.berkarya}
                    onChange={(e) => setFormData({
                      ...formData,
                      langkahPembelajaran: {
                        ...formData.langkahPembelajaran,
                        kegiatanInti: { ...formData.langkahPembelajaran.kegiatanInti, berkarya: e.target.value }
                      }
                    })}
                    rows={4} placeholder="Kegiatan berkarya..."
                  />
                </div>

                <div className="space-y-2 pl-4">
                  <Label className="font-medium">Refleksi</Label>
                  <Textarea
                    value={formData.langkahPembelajaran.kegiatanInti.refleksi}
                    onChange={(e) => setFormData({
                      ...formData,
                      langkahPembelajaran: {
                        ...formData.langkahPembelajaran,
                        kegiatanInti: { ...formData.langkahPembelajaran.kegiatanInti, refleksi: e.target.value }
                      }
                    })}
                    rows={4} placeholder="Kegiatan refleksi..."
                  />
                </div>
              </div>

              {/* Penutup */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">Penutup</h4>
                <div className="space-y-2">
                  <Textarea
                    value={formData.langkahPembelajaran.penutup}
                    onChange={(e) => setFormData({
                      ...formData,
                      langkahPembelajaran: { ...formData.langkahPembelajaran, penutup: e.target.value }
                    })}
                    rows={4} placeholder="Kegiatan penutup..."
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
                  rows={6} placeholder="Tuliskan instrumen dan teknik asesmen..."
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
                  rows={4} placeholder="Tuliskan tindak lanjut pembelajaran..."
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
                  rows={4} placeholder="Tuliskan refleksi guru setelah pembelajaran..."
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  )
}
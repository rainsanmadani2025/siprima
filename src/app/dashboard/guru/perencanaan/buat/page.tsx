"use client"

import { useState, useEffect, Suspense } from "react"
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
import { Download, ArrowLeft, Loader2, Plus, RefreshCw, Eye, FileDown, Save, FileText } from "lucide-react"
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

function BuatRPPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [kelompokUsiaFilter, setKelompokUsiaFilter] = useState("all")
  const [templates, setTemplates] = useState<TemplateKBC[]>([])
  const [loading, setLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKBC | null>(null)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")

  const [formData, setFormData] = useState({
    namaSekolah: "RA INSAN MADANI",
    alamatSekolah: "Jl. Apel RT.06 RW. 01 Rancakendal Kel. Cigadung Cibeunying Kaler Kota Bandung",
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
      cintaBangsaNegara: "",
    },
    dimensiKelulusan: {
      keimananKetakwaan: "",
      kewargaan: "",
      penalaranKritis: "",
      kreativitas: "",
      kolaborasi: "",
      kemandirian: "",
      kesehatan: "",
      komunikasi: "",
    },
    pemahamanBermakna: "",
    pertanyaanPemantik: "",
    saranaMediaBahan: {
      sarana: "",
      media: "",
      bahan: "",
    },
    langkahPembelajaran: {
      penyambutan: "",
      pembukaan: "",
      kegiatanInti: {
        eksplorasi: "",
        bermain: "",
        berkarya: "",
        refleksi: "",
      },
      penutup: "",
    },
    asesmen: "",
    tindakLanjut: "",
    refleksiGuru: "",
  })

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (kelompokUsiaFilter && kelompokUsiaFilter !== "all") {
        params.append("kelompokUsia", kelompokUsiaFilter)
      }
      const res = await fetch(`/api/template-kbc/list?${params.toString()}`)
      const data = await res.json()
      if (data.success) setTemplates(data.templates)
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Gagal mengambil template" })
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateChange = async (templateId: string) => {
    if (!templateId || templateId === "empty") return
    setSelectedTemplateId(templateId)
    try {
      const res = await fetch(`/api/template-kbc/detail?id=${templateId}`)
      const data = await res.json()
      if (data.success && data.template) {
        const t = data.template
        setFormData(prev => ({
          ...prev,
          tema: t.tema,
          subtema: t.subtema,
          capaianPembelajaran: t.capaianPembelajaran || "",
          tujuanPembelajaran: t.tujuanPembelajaran || "",
          nilaiCinta: t.nilaiCinta || prev.nilaiCinta,
          dimensiKelulusan: t.dimensiKelulusan || prev.dimensiKelulusan,
          pemahamanBermakna: t.pemahamanBermakna || "",
          pertanyaanPemantik: t.pertanyaanPemantik || "",
          saranaMediaBahan: t.saranaMediaBahan || prev.saranaMediaBahan,
          langkahPembelajaran: t.langkahPembelajaran || prev.langkahPembelajaran,
          asesmen: t.asesmen || "",
          tindakLanjut: t.tindakLanjut || "",
          refleksiGuru: t.refleksiGuru || "",
        }))
        toast({ title: "Template dimuat", description: `Template "${t.nama}" berhasil diterapkan` })
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat detail template" })
    }
  }

  const buildApiBody = () => ({
    ...formData,
    nilaiCinta: JSON.stringify(formData.nilaiCinta),
    dimensiKelulusan: JSON.stringify(formData.dimensiKelulusan),
    saranaMediaBahan: JSON.stringify(formData.saranaMediaBahan),
    langkahPembelajaran: JSON.stringify(formData.langkahPembelajaran),
  })

  const handleSave = async () => {
    try {
      setSaving(true)
      const body = buildApiBody()
      const res = await fetch("/api/rpp/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Berhasil", description: "RPP berhasil disimpan" })
      } else {
        throw new Error(data.error || "Gagal menyimpan")
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message })
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      const body = buildApiBody()
      const res = await fetch("/api/rpp/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await res.json()
      if (data.success && data.fileUrl) {
        window.open(data.fileUrl, "_blank")
      } else {
        throw new Error(data.error || "Gagal mengekspor")
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message })
    } finally {
      setExporting(false)
    }
  }

  const handlePreviewPDF = async () => {
    try {
      const body = buildApiBody()
      const res = await fetch("/api/rpp/export-pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        window.open(url, "_blank")
      } else {
        throw new Error("Gagal generate preview")
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message })
    }
  }

  const handleExportPDF = async () => {
    try {
      setExporting(true)
      const body = buildApiBody()
      const res = await fetch("/api/rpp/export-pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `RPP-KBC-${formData.tema}-${formData.subtema}.pdf`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Berhasil", description: "PDF berhasil diunduh" })
      } else {
        throw new Error("Gagal export PDF")
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message })
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [kelompokUsiaFilter])

  useEffect(() => {
    const templateId = searchParams.get("templateId")
    if (templateId) handleTemplateChange(templateId)
  }, [searchParams])

  // Auto-fill data profil guru & sekolah saat halaman dimuat
  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
    if (!userId) return

    const loadProfileData = async () => {
      try {
        // Panggil semua API secara paralel
        const [schoolRes, teacherRes, classRes] = await Promise.all([
          fetch('/api/school/profile'),
          fetch(`/api/guru/profile?userId=${userId}`),
          fetch(`/api/classes/teacher?userId=${userId}`),
        ])

        const [schoolData, teacherData, classData] = await Promise.all([
          schoolRes.json(),
          teacherRes.json(),
          classRes.json(),
        ])

        // Update semua field sekali gus
        setFormData(prev => ({
          ...prev,
          alamatSekolah: schoolData.success ? (schoolData.school.address || prev.alamatSekolah) : prev.alamatSekolah,
          guru: teacherData.success ? (teacherData.teacher.name || prev.guru) : prev.guru,
          kelas: classData.success && classData.teacherClasses && classData.teacherClasses.length > 0
            ? (classData.teacherClasses[0].name || prev.kelas)
            : prev.kelas,
          hari: new Date().toLocaleDateString("id-ID", { weekday: "long" }),
        }))
      } catch (error) {
        console.error('Error loading profile data:', error)
      }
    }

    loadProfileData()
  }, [])

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/guru/perencanaan")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Buat RPP KBC</h1>
            <p className="text-muted-foreground mt-1">Rencana Pelaksanaan Pembelajaran Kurikulum Berbasis Cinta</p>
          </div>
          <div className="flex gap-2 shrink-0">
 	    <Button variant="outline" onClick={() => router.push("/dashboard/guru/perencanaan/bank-template")}><FileText className="mr-2 h-4 w-4" />Bank 	    Template</Button>
            <Button variant="outline" onClick={handlePreviewPDF}><Eye className="mr-2 h-4 w-4" />Preview PDF</Button>
            <Button variant="outline" onClick={handleExportPDF} disabled={exporting}>
              {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              Export PDF
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Simpan
            </Button>
          </div>
        </div>

        {/* Template Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Preview Template KBC</DialogTitle>
              <DialogDescription>{selectedTemplate?.nama}</DialogDescription>
            </DialogHeader>
            {selectedTemplate && (
              <ScrollArea className="h-[calc(90vh-100px)]">
                <div className="px-6 pb-6 pt-2 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 p-3 rounded-lg"><p className="text-xs text-muted-foreground">Tema</p><p className="text-sm font-medium">{selectedTemplate.tema}</p></div>
                    <div className="bg-muted/50 p-3 rounded-lg"><p className="text-xs text-muted-foreground">Subtema</p><p className="text-sm font-medium">{selectedTemplate.subtema}</p></div>
                    <div className="bg-muted/50 p-3 rounded-lg"><p className="text-xs text-muted-foreground">Kelompok</p><p className="text-sm font-medium">{selectedTemplate.kelompokUsia}</p></div>
                    <div className="bg-muted/50 p-3 rounded-lg"><p className="text-xs text-muted-foreground">Semester</p><p className="text-sm font-medium">{selectedTemplate.semester}</p></div>
                  </div>
                  <div><h4 className="text-sm font-semibold text-primary mb-2">B. Capaian Pembelajaran</h4><p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{selectedTemplate.capaianPembelajaran}</p></div>
                  <div><h4 className="text-sm font-semibold text-primary mb-2">C. Tujuan Pembelajaran</h4><p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{selectedTemplate.tujuanPembelajaran}</p></div>
                  <div>
                    <h4 className="text-sm font-semibold text-primary mb-2">D. 6 Nilai Cinta</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedTemplate.nilaiCinta).map(([k, v]) => (
                        <div key={k} className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground">{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</p>
                          <p className="text-sm whitespace-pre-wrap">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-primary mb-2">E. 8 Dimensi Kelulusan</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedTemplate.dimensiKelulusan).map(([k, v]) => (
                        <div key={k} className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground">{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</p>
                          <p className="text-sm whitespace-pre-wrap">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div><h4 className="text-sm font-semibold text-primary mb-2">F. Pemahaman Bermakna</h4><p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{selectedTemplate.pemahamanBermakna}</p></div>
                  <div><h4 className="text-sm font-semibold text-primary mb-2">G. Pertanyaan Pemantik</h4><p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{selectedTemplate.pertanyaanPemantik}</p></div>
                  <div><h4 className="text-sm font-semibold text-primary mb-2">H. Sarana, Media, Bahan</h4><p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{JSON.stringify(selectedTemplate.saranaMediaBahan, null, 2)}</p></div>
                  <div><h4 className="text-sm font-semibold text-primary mb-2">I. Langkah Pembelajaran</h4><p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{JSON.stringify(selectedTemplate.langkahPembelajaran, null, 2)}</p></div>
                  <div><h4 className="text-sm font-semibold text-primary mb-2">J. Asesmen</h4><p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{selectedTemplate.asesmen}</p></div>
                  <div><h4 className="text-sm font-semibold text-primary mb-2">K. Tindak Lanjut</h4><p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{selectedTemplate.tindakLanjut}</p></div>
                  <div><h4 className="text-sm font-semibold text-primary mb-2">L. Refleksi Guru</h4><p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{selectedTemplate.refleksiGuru}</p></div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>

        {/* Template Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" />Pilih Template</CardTitle>
            <CardDescription>Pilih template KBC untuk mengisi RPP secara otomatis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:w-48">
                <Select value={kelompokUsiaFilter} 
		onValueChange={(v) => {
		  setKelompokUsiaFilter(v)
		  setSelectedTemplateId("")
		}}>
                  <SelectTrigger><SelectValue placeholder="Kelompok Usia" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelompok</SelectItem>
                    <SelectItem value="Kelompok A (4-5 Tahun)">Kelompok A (4-5 Thn)</SelectItem>
                    <SelectItem value="Kelompok B (5-6 Tahun)">Kelompok B (5-6 Thn)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                  <SelectTrigger><SelectValue placeholder="Pilih Template..." /></SelectTrigger>
                  <SelectContent>
                    {templates.length === 0 && <SelectItem value="empty" disabled>Belum ada template</SelectItem>}
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={fetchTemplates} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* A. Identitas Pembelajaran */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">A</span>
              Identitas Pembelajaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Sekolah</Label><Input value={formData.namaSekolah} onChange={(e) => setFormData(prev => ({...prev, namaSekolah: e.target.value}))} /></div>
              <div className="space-y-2"><Label>Alamat Sekolah</Label><Input value={formData.alamatSekolah} onChange={(e) => setFormData(prev => ({...prev, alamatSekolah: e.target.value}))} /></div>
              <div className="space-y-2"><Label>Kelompok Usia</Label>
                <Select value={formData.kelompokUsia} onValueChange={(v) => setFormData(prev => ({...prev, kelompokUsia: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kelompok A (4-5 Tahun)">Kelompok A (4-5 Tahun)</SelectItem>
                    <SelectItem value="Kelompok B (5-6 Tahun)">Kelompok B (5-6 Tahun)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Semester</Label>
                <Select value={formData.semester} onValueChange={(v) => setFormData(prev => ({...prev, semester: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                    <SelectItem value="Genap">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Tahun Ajaran</Label><Input value={formData.tahunAjaran} onChange={(e) => setFormData(prev => ({...prev, tahunAjaran: e.target.value}))} /></div>
              <div className="space-y-2"><Label>Hari</Label><Input value={formData.hari} onChange={(e) => setFormData(prev => ({...prev, hari: e.target.value}))} placeholder="Contoh: Selasa" /></div>
              <div className="space-y-2"><Label>Jumlah Pertemuan</Label><Input value={formData.jumlahPertemuan} onChange={(e) => setFormData(prev => ({...prev, jumlahPertemuan: e.target.value}))} placeholder="Contoh: 8 JP" /></div>
              <div className="space-y-2"><Label>Kelas</Label><Input value={formData.kelas} onChange={(e) => setFormData(prev => ({...prev, kelas: e.target.value}))} placeholder="Contoh: A1" /></div>
              <div className="space-y-2"><Label>Guru / Pengajar</Label><Input value={formData.guru} onChange={(e) => setFormData(prev => ({...prev, guru: e.target.value}))} placeholder="Nama guru" /></div>
              <div className="space-y-2"><Label>Tema</Label><Input value={formData.tema} onChange={(e) => setFormData(prev => ({...prev, tema: e.target.value}))} /></div>
              <div className="space-y-2"><Label>Subtema</Label><Input value={formData.subtema} onChange={(e) => setFormData(prev => ({...prev, subtema: e.target.value}))} /></div>
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
          <CardContent>
            <Textarea value={formData.capaianPembelajaran} onChange={(e) => setFormData(prev => ({...prev, capaianPembelajaran: e.target.value}))} rows={4} placeholder="Tuliskan capaian pembelajaran yang diharapkan..." />
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
            <Textarea value={formData.tujuanPembelajaran} onChange={(e) => setFormData(prev => ({...prev, tujuanPembelajaran: e.target.value}))} rows={6} placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai..." />
          </CardContent>
        </Card>

        {/* D. 6 Nilai Cinta */}
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
              <div className="space-y-2"><Label>Cinta kepada Allah SWT</Label><Textarea value={formData.nilaiCinta.cintaAllah} onChange={(e) => setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaAllah: e.target.value}}))} rows={3} /></div>
              <div className="space-y-2"><Label>Cinta kepada Rasulullah SAW</Label><Textarea value={formData.nilaiCinta.cintaRasulullah} onChange={(e) => setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaRasulullah: e.target.value}}))} rows={3} /></div>
              <div className="space-y-2"><Label>Cinta kepada Diri Sendiri</Label><Textarea value={formData.nilaiCinta.cintaDiriSendiri} onChange={(e) => setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaDiriSendiri: e.target.value}}))} rows={3} /></div>
              <div className="space-y-2"><Label>Cinta kepada Sesama</Label><Textarea value={formData.nilaiCinta.cintaSesama} onChange={(e) => setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaSesama: e.target.value}}))} rows={3} /></div>
              <div className="space-y-2"><Label>Cinta kepada Lingkungan</Label><Textarea value={formData.nilaiCinta.cintaLingkungan} onChange={(e) => setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaLingkungan: e.target.value}}))} rows={3} /></div>
              <div className="space-y-2"><Label>Cinta kepada Bangsa & Negara</Label><Textarea value={formData.nilaiCinta.cintaBangsaNegara} onChange={(e) => setFormData(prev => ({...prev, nilaiCinta: {...prev.nilaiCinta, cintaBangsaNegara: e.target.value}}))} rows={3} /></div>
            </div>
          </CardContent>
        </Card>

        {/* E. 8 Dimensi Kelulusan KBC Kemenag */}
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
              <div className="space-y-2"><Label>Keimanan & Ketakwaan</Label><Textarea value={formData.dimensiKelulusan.keimananKetakwaan} onChange={(e) => setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, keimananKetakwaan: e.target.value}}))} rows={2} /></div>
              <div className="space-y-2"><Label>Kewargaan</Label><Textarea value={formData.dimensiKelulusan.kewargaan} onChange={(e) => setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, kewargaan: e.target.value}}))} rows={2} /></div>
              <div className="space-y-2"><Label>Penalaran Kritis</Label><Textarea value={formData.dimensiKelulusan.penalaranKritis} onChange={(e) => setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, penalaranKritis: e.target.value}}))} rows={2} /></div>
              <div className="space-y-2"><Label>Kreativitas</Label><Textarea value={formData.dimensiKelulusan.kreativitas} onChange={(e) => setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, kreativitas: e.target.value}}))} rows={2} /></div>
              <div className="space-y-2"><Label>Kolaborasi</Label><Textarea value={formData.dimensiKelulusan.kolaborasi} onChange={(e) => setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, kolaborasi: e.target.value}}))} rows={2} /></div>
              <div className="space-y-2"><Label>Kemandirian</Label><Textarea value={formData.dimensiKelulusan.kemandirian} onChange={(e) => setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, kemandirian: e.target.value}}))} rows={2} /></div>
              <div className="space-y-2"><Label>Kesehatan</Label><Textarea value={formData.dimensiKelulusan.kesehatan} onChange={(e) => setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, kesehatan: e.target.value}}))} rows={2} /></div>
              <div className="space-y-2"><Label>Komunikasi</Label><Textarea value={formData.dimensiKelulusan.komunikasi} onChange={(e) => setFormData(prev => ({...prev, dimensiKelulusan: {...prev.dimensiKelulusan, komunikasi: e.target.value}}))} rows={2} /></div>
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
            <Textarea value={formData.pemahamanBermakna} onChange={(e) => setFormData(prev => ({...prev, pemahamanBermakna: e.target.value}))} rows={6} placeholder="Tuliskan pemahaman bermakna yang ingin dicapai..." />
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
            <Textarea value={formData.pertanyaanPemantik} onChange={(e) => setFormData(prev => ({...prev, pertanyaanPemantik: e.target.value}))} rows={6} placeholder="Tuliskan pertanyaan pemantik untuk memulai pembelajaran..." />
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
            <div className="space-y-2"><Label>Sarana</Label><Textarea value={formData.saranaMediaBahan.sarana} onChange={(e) => setFormData(prev => ({...prev, saranaMediaBahan: {...prev.saranaMediaBahan, sarana: e.target.value}}))} rows={2} placeholder="Tuliskan sarana yang digunakan..." /></div>
            <div className="space-y-2"><Label>Media Pembelajaran</Label><Textarea value={formData.saranaMediaBahan.media} onChange={(e) => setFormData(prev => ({...prev, saranaMediaBahan: {...prev.saranaMediaBahan, media: e.target.value}}))} rows={2} placeholder="Tuliskan media pembelajaran yang digunakan..." /></div>
            <div className="space-y-2"><Label>Bahan Pembelajaran</Label><Textarea value={formData.saranaMediaBahan.bahan} onChange={(e) => setFormData(prev => ({...prev, saranaMediaBahan: {...prev.saranaMediaBahan, bahan: e.target.value}}))} rows={2} placeholder="Tuliskan bahan pembelajaran yang digunakan..." /></div>
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
            <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold">Penyambutan</h4>
              <Textarea
                value={formData.langkahPembelajaran.penyambutan}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  langkahPembelajaran: { ...prev.langkahPembelajaran, penyambutan: e.target.value }
                }))}
                rows={4}
                placeholder="Kegiatan penyambutan anak..."
              />
            </div>

            <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold">Pembukaan</h4>
              <Textarea
                value={formData.langkahPembelajaran.pembukaan}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  langkahPembelajaran: { ...prev.langkahPembelajaran, pembukaan: e.target.value }
                }))}
                rows={4}
                placeholder="Kegiatan pembukaan..."
              />
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold">Kegiatan Inti</h4>

              <div className="space-y-2 pl-4">
                <Label className="font-medium">Eksplorasi</Label>
                <Textarea
                  value={formData.langkahPembelajaran.kegiatanInti.eksplorasi}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    langkahPembelajaran: {
                      ...prev.langkahPembelajaran,
                      kegiatanInti: { ...prev.langkahPembelajaran.kegiatanInti, eksplorasi: e.target.value }
                    }
                  }))}
                  rows={4}
                  placeholder="Kegiatan eksplorasi..."
                />
              </div>

              <div className="space-y-2 pl-4">
                <Label className="font-medium">Bermain</Label>
                <Textarea
                  value={formData.langkahPembelajaran.kegiatanInti.bermain}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    langkahPembelajaran: {
                      ...prev.langkahPembelajaran,
                      kegiatanInti: { ...prev.langkahPembelajaran.kegiatanInti, bermain: e.target.value }
                    }
                  }))}
                  rows={4}
                  placeholder="Kegiatan bermain..."
                />
              </div>

              <div className="space-y-2 pl-4">
                <Label className="font-medium">Berkarya</Label>
                <Textarea
                  value={formData.langkahPembelajaran.kegiatanInti.berkarya}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    langkahPembelajaran: {
                      ...prev.langkahPembelajaran,
                      kegiatanInti: { ...prev.langkahPembelajaran.kegiatanInti, berkarya: e.target.value }
                    }
                  }))}
                  rows={4}
                  placeholder="Kegiatan berkarya..."
                />
              </div>

              <div className="space-y-2 pl-4">
                <Label className="font-medium">Refleksi</Label>
                <Textarea
                  value={formData.langkahPembelajaran.kegiatanInti.refleksi}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    langkahPembelajaran: {
                      ...prev.langkahPembelajaran,
                      kegiatanInti: { ...prev.langkahPembelajaran.kegiatanInti, refleksi: e.target.value }
                    }
                  }))}
                  rows={4}
                  placeholder="Kegiatan refleksi..."
                />
              </div>
            </div>

            <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold">Penutup</h4>
              <Textarea
                value={formData.langkahPembelajaran.penutup}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  langkahPembelajaran: { ...prev.langkahPembelajaran, penutup: e.target.value }
                }))}
                rows={4}
                placeholder="Kegiatan penutup..."
              />
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
            <Textarea value={formData.asesmen} onChange={(e) => setFormData(prev => ({...prev, asesmen: e.target.value}))} rows={6} placeholder="Tuliskan instrumen dan teknik asesmen..." />
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
            <Textarea value={formData.tindakLanjut} onChange={(e) => setFormData(prev => ({...prev, tindakLanjut: e.target.value}))} rows={4} placeholder="Tuliskan tindak lanjut pembelajaran..." />
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
            <Textarea value={formData.refleksiGuru} onChange={(e) => setFormData(prev => ({...prev, refleksiGuru: e.target.value}))} rows={4} placeholder="Tuliskan refleksi guru setelah pembelajaran..." />
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}

export default function BuatRPPPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p>Memuat...</p>
      </div>
    }>
      <BuatRPPContent />
    </Suspense>
  )
}
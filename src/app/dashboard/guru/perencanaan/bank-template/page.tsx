"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Eye, Trash2, BookOpen, RefreshCw, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// ============================================================
// Interfaces
// ============================================================

interface TemplateListItem {
  id: string
  nama: string
  tema: string
  subtema: string
  kelompokUsia: string
  status: string
  createdAt: string
  updatedAt: string
}

interface TemplateDetail {
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
  nilaiCinta: Record<string, string>
  dimensiKelulusan: Record<string, string>
  pemahamanBermakna: string
  pertanyaanPemantik: string
  saranaMediaBahan: Record<string, string>
  langkahPembelajaran: Record<string, any>
  asesmen: string
  tindakLanjut: string
  refleksiGuru: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// Label maps for JSON fields
// ============================================================

const NILAI_CINTA_LABELS: Record<string, string> = {
  cintaAllah: "Cinta Allah SWT",
  cintaRasulullah: "Cinta Rasulullah SAW",
  cintaDiriSendiri: "Cinta Diri Sendiri",
  cintaSesama: "Cinta Sesama",
  cintaLingkungan: "Cinta Lingkungan",
  cintaBangsaNegara: "Cinta Bangsa dan Negara",
}

const DIMENSI_LABELS: Record<string, string> = {
  keimananKetakwaan: "Keimanan dan Ketakwaan",
  kewargaan: "Kewargaan",
  penalaranKritis: "Penalaran Kritis",
  kreativitas: "Kreativitas",
  kolaborasi: "Kolaborasi",
  kemandirian: "Kemandirian",
  kesehatan: "Kesehatan",
  komunikasi: "Komunikasi",
}

const SARANA_LABELS: Record<string, string> = {
  sarana: "Sarana",
  media: "Media",
  bahan: "Bahan",
}

const LANGKAH_LABELS: Record<string, string> = {
  penyambutan: "Penyambutan",
  pembukaan: "Pembukaan",
  kegiatanInti: "Kegiatan Inti",
  penutup: "Penutup",
}

const KEGIATAN_INTI_LABELS: Record<string, string> = {
  eksplorasi: "Eksplorasi",
  bermain: "Bermain",
  berkarya: "Berkarya",
  refleksi: "Refleksi Siswa",
}

// ============================================================
// Helpers
// ============================================================

function formatDateIndo(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// ============================================================
// Component
// ============================================================

export default function BankTemplateKBCPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Filter states
  const [filterTema, setFilterTema] = useState("")
  const [filterKelompokUsia, setFilterKelompokUsia] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Data states
  const [templates, setTemplates] = useState<TemplateListItem[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog states
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateListItem | null>(null)
  const [templateDetail, setTemplateDetail] = useState<TemplateDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // ============================================================
  // Fetch templates
  // ============================================================

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterTema) {
        params.append("tema", filterTema)
      }
      if (filterKelompokUsia && filterKelompokUsia !== "all") {
        params.append("kelompokUsia", filterKelompokUsia)
      }
      if (filterStatus && filterStatus !== "all") {
        params.append("status", filterStatus)
      }

      const response = await fetch(`/api/template-kbc/list?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil daftar template",
      })
    } finally {
      setLoading(false)
    }
  }, [filterTema, filterKelompokUsia, filterStatus, toast])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // ============================================================
  // Handlers (separate named functions, NO inline nested spreads)
  // ============================================================

  const handleTemaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTema(e.target.value)
  }

  const handleKelompokUsiaChange = (value: string) => {
    setFilterKelompokUsia(value)
  }

  const handleStatusChange = (value: string) => {
    setFilterStatus(value)
  }

  const handleSearch = () => {
    fetchTemplates()
  }

  const handleRefresh = () => {
    fetchTemplates()
  }

  const handleViewDetail = async (template: TemplateListItem) => {
    setSelectedTemplate(template)
    setDetailOpen(true)
    setDetailLoading(true)
    setTemplateDetail(null)

    try {
      const response = await fetch(`/api/template-kbc/detail?id=${template.id}`)
      const data = await response.json()

      if (data.success) {
        setTemplateDetail(data.template)
      } else {
        throw new Error(data.error || "Gagal memuat detail")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal memuat detail template",
      })
      setDetailOpen(false)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDeleteClick = (template: TemplateListItem) => {
    setSelectedTemplate(template)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedTemplate) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/template-kbc/delete?id=${selectedTemplate.id}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: data.message || "Template berhasil dihapus",
        })
        setDeleteOpen(false)
        setSelectedTemplate(null)
        fetchTemplates()
      } else {
        throw new Error(data.error || "Gagal menghapus template")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menghapus template",
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleGunakan = (templateId: string) => {
    router.push(`/dashboard/guru/perencanaan/buat?templateId=${templateId}`)
  }

  // ============================================================
  // Render helpers
  // ============================================================

  const renderStatusBadge = (status: string) => {
    if (status === "published") {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          Published
        </Badge>
      )
    }
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        Draft
      </Badge>
    )
  }

  const renderKelompokBadge = (kelompokUsia: string) => {
    const isA = kelompokUsia.includes("A")
    const color = isA
      ? "bg-sky-100 text-sky-800 hover:bg-sky-100"
      : "bg-violet-100 text-violet-800 hover:bg-violet-100"
    const label = isA ? "Kelompok A (4-5 Thn)" : "Kelompok B (5-6 Thn)"
    return <Badge className={color}>{label}</Badge>
  }

  const renderSectionTitle = (label: string, sectionLetter: string) => (
    <h4 className="text-sm font-semibold text-primary mt-6 mb-3 flex items-center gap-2">
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {sectionLetter}
      </span>
      {label}
    </h4>
  )

  const renderTextContent = (text: string) => {
    if (!text) {
      return <p className="text-muted-foreground text-sm italic">Tidak ada data</p>
    }
    return (
      <div className="text-sm whitespace-pre-wrap leading-relaxed bg-muted/50 p-3 rounded-lg">
        {text}
      </div>
    )
  }

  const renderJsonEntries = (
    obj: Record<string, string>,
    labelMap: Record<string, string>
  ) => {
    const entries = Object.entries(obj).filter(([, v]) => v && v.trim() !== "")
    if (entries.length === 0) {
      return <p className="text-muted-foreground text-sm italic">Tidak ada data</p>
    }
    return (
      <div className="space-y-2">
        {entries.map(([key, value]) => (
          <div key={key} className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {labelMap[key] || key}
            </p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderLangkahPembelajaran = (langkah: Record<string, any>) => {
    if (!langkah || Object.keys(langkah).length === 0) {
      return <p className="text-muted-foreground text-sm italic">Tidak ada data</p>
    }

    const entries = Object.entries(langkah).filter(
      ([, v]) => v && (typeof v === "string" ? v.trim() !== "" : typeof v === "object")
    )

    if (entries.length === 0) {
      return <p className="text-muted-foreground text-sm italic">Tidak ada data</p>
    }

    return (
      <div className="space-y-3">
        {entries.map(([key, value]) => {
          if (key === "kegiatanInti" && typeof value === "object" && value !== null) {
            const subEntries = Object.entries(value).filter(
              ([, sv]) => sv && String(sv).trim() !== ""
            )
            return (
              <div key={key} className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {LANGKAH_LABELS[key] || key}
                </p>
                <div className="space-y-2 ml-2">
                  {subEntries.map(([sk, sv]) => (
                    <div key={sk} className="bg-background p-2 rounded border">
                      <p className="text-xs font-medium text-primary mb-1">
                        {KEGIATAN_INTI_LABELS[sk] || sk}
                      </p>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {String(sv)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
          return (
            <div key={key} className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {LANGKAH_LABELS[key] || key}
              </p>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {String(value)}
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  const renderDetailContent = () => {
    if (detailLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }

    if (!templateDetail) {
      return (
        <p className="text-center text-muted-foreground py-8">
          Gagal memuat detail template
        </p>
      )
    }

    const t = templateDetail

    return (
      <div className="space-y-1">
        {/* A. Info / Identitas */}
        {renderSectionTitle("Identitas Template", "A")}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Nama</p>
            <p className="text-sm font-medium">{t.nama}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Tema</p>
            <p className="text-sm font-medium">{t.tema}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Subtema</p>
            <p className="text-sm font-medium">{t.subtema}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Kelompok Usia</p>
            <p className="text-sm font-medium">{t.kelompokUsia}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Fase</p>
            <p className="text-sm font-medium">{t.fase}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Semester</p>
            <p className="text-sm font-medium">{t.semester}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg col-span-2">
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="mt-1">{renderStatusBadge(t.status)}</div>
          </div>
        </div>

        {/* B. Capaian Pembelajaran */}
        {renderSectionTitle("Capaian Pembelajaran", "B")}
        {renderTextContent(t.capaianPembelajaran)}

        {/* C. Tujuan Pembelajaran */}
        {renderSectionTitle("Tujuan Pembelajaran", "C")}
        {renderTextContent(t.tujuanPembelajaran)}

        {/* D. 6 Nilai Cinta */}
        {renderSectionTitle("6 Nilai Cinta", "D")}
        {renderJsonEntries(t.nilaiCinta, NILAI_CINTA_LABELS)}

        {/* E. 8 Dimensi Kelulusan KBC Kemenag */}
        {renderSectionTitle("8 Dimensi Kelulusan KBC Kemenag", "E")}
        {renderJsonEntries(t.dimensiKelulusan, DIMENSI_LABELS)}

        {/* F. Pemahaman Bermakna */}
        {renderSectionTitle("Pemahaman Bermakna", "F")}
        {renderTextContent(t.pemahamanBermakna)}

        {/* G. Pertanyaan Pemantik */}
        {renderSectionTitle("Pertanyaan Pemantik", "G")}
        {renderTextContent(t.pertanyaanPemantik)}

        {/* H. Sarana, Media, Bahan */}
        {renderSectionTitle("Sarana, Media, Bahan", "H")}
        {renderJsonEntries(t.saranaMediaBahan, SARANA_LABELS)}

        {/* I. Langkah Pembelajaran */}
        {renderSectionTitle("Langkah Pembelajaran", "I")}
        {renderLangkahPembelajaran(t.langkahPembelajaran)}

        {/* J. Asesmen */}
        {renderSectionTitle("Asesmen", "J")}
        {renderTextContent(t.asesmen)}

        {/* K. Tindak Lanjut */}
        {renderSectionTitle("Tindak Lanjut", "K")}
        {renderTextContent(t.tindakLanjut)}

        {/* L. Refleksi Guru */}
        {renderSectionTitle("Refleksi Guru", "L")}
        {renderTextContent(t.refleksiGuru)}
      </div>
    )
  }

  // ============================================================
  // Main render
  // ============================================================

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/guru/perencanaan/buat")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bank Template KBC
            </h1>
            <p className="text-muted-foreground mt-1">
              Koleksi template RPP KBC yang siap digunakan untuk pembelajaran
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="shrink-0"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Filter Bar */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Filter Pencarian</CardTitle>
            <CardDescription>
              Gunakan filter di bawah untuk menemukan template yang sesuai
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Cari berdasarkan tema..."
                  value={filterTema}
                  onChange={handleTemaChange}
                />
              </div>
              <div className="w-full sm:w-56">
                <Select
                  value={filterKelompokUsia}
                  onValueChange={handleKelompokUsiaChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kelompok Usia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelompok Usia</SelectItem>
                    <SelectItem value="Kelompok A (4-5 Tahun)">
                      Kelompok A (4-5 Tahun)
                    </SelectItem>
                    <SelectItem value="Kelompok B (5-6 Tahun)">
                      Kelompok B (5-6 Tahun)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-40">
                <Select value={filterStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} disabled={loading} className="shrink-0">
                <Search className="mr-2 h-4 w-4" />
                Cari
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Template List */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground mt-4">Memuat daftar template...</p>
            </CardContent>
          </Card>
        ) : templates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/40" />
              <p className="text-muted-foreground mt-4 text-lg font-medium">
                Belum ada template
              </p>
              <p className="text-muted-foreground/70 mt-1 text-sm">
                Silakan tambahkan template melalui seed script atau buat manual.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-2 flex-1">
                      {template.nama}
                    </CardTitle>
                    {renderStatusBadge(template.status)}
                  </div>
                  <CardDescription className="line-clamp-1">
                    {template.tema} : {template.subtema}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {renderKelompokBadge(template.kelompokUsia)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dibuat: {formatDateIndo(template.createdAt)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewDetail(template)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat Detail
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleGunakan(template.id)}
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Gunakan
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(template)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* Detail Dialog */}
      {/* ============================================================ */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Detail Template KBC
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate?.nama || "Detail Template"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-100px)]">
            <div className="px-6 pb-6 pt-2">{renderDetailContent()}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/* Delete Confirmation Dialog */}
      {/* ============================================================ */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Hapus Template
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus template{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{selectedTemplate?.nama}&rdquo;
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, Sparkles, Eye, FileDown, Printer } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Minggu {
  minggu: number
  tema: string
  subTema: string
  lingkupPerkembangan: string
  kegiatanPembelajaran: string
  indikator: string
}

export default function PROSEMBuatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prosemId = searchParams.get('id')
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>("")

  const [formData, setFormData] = useState({
    tahunAjaran: "2025/2026",
    semester: "Ganjil",
    mingguan: [] as Minggu[]
  })

  useEffect(() => {
    if (prosemId) {
      fetchPROSEM()
    }
  }, [prosemId])

  const fetchPROSEM = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/prosem/detail?id=${prosemId}`)
      const data = await response.json()

      if (data.success && data.prosem) {
        const mingguan = typeof data.prosem.mingguan === 'string'
          ? JSON.parse(data.prosem.mingguan)
          : data.prosem.mingguan

        setFormData({
          tahunAjaran: data.prosem.tahunAjaran,
          semester: data.prosem.semester,
          mingguan
        })
      }
    } catch (error) {
      console.error('Error fetching PROSEM:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data PROSEM"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    try {
      setGenerating(true)

      const response = await fetch('/api/prosem/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semester: formData.semester,
          tahunAjaran: formData.tahunAjaran
        })
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          mingguan: data.mingguan
        }))

        toast({
          title: "Berhasil",
          description: "PROSEM berhasil di-generate"
        })
      } else {
        throw new Error(data.error || 'Gagal generate PROSEM')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal generate PROSEM"
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    // Validate
    if (!formData.tahunAjaran || !formData.semester || formData.mingguan.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Mohon isi semua field yang diperlukan"
      })
      return
    }

    // Validate each minggu
    for (let i = 0; i < formData.mingguan.length; i++) {
      const m = formData.mingguan[i]
      if (!m.tema || !m.subTema || !m.lingkupPerkembangan || !m.kegiatanPembelajaran || !m.indikator) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Mohon lengkapi data minggu ke-${m.minggu}`
        })
        return
      }
    }

    try {
      setSaving(true)

      const response = await fetch('/api/prosem/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: prosemId,
          ...formData
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: prosemId ? "PROSEM berhasil diperbarui" : "PROSEM berhasil disimpan"
        })
        router.push('/dashboard/guru/perencanaan/prosem')
      } else {
        throw new Error(data.error || 'Gagal menyimpan PROSEM')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan PROSEM"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleMingguChange = (index: number, field: keyof Minggu, value: string) => {
    const newMingguan = [...formData.mingguan]
    newMingguan[index][field] = value
    setFormData(prev => ({ ...prev, mingguan: newMingguan }))
  }

  const handlePreviewPDF = async () => {
    try {
      setLoadingPDF(true)
      
      const response = await fetch('/api/prosem/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Gagal membuat preview PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      setPdfPreviewUrl(url)
      setShowPdfPreview(true)

      toast({
        title: "Berhasil",
        description: "Preview PDF berhasil dibuat"
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
      const response = await fetch('/api/prosem/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `PROSEM-${formData.semester}-${formData.tahunAjaran}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast({
        title: "Berhasil",
        description: "PROSEM berhasil diekspor ke PDF"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengekspor PROSEM ke PDF"
      })
    } finally {
      setLoadingPDF(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
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
            <h1 className="text-3xl font-bold tracking-tight">
              {prosemId ? 'Edit PROSEM' : 'Buat PROSEM Baru'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Program Semester (PROSEM) - {formData.semester} {formData.tahunAjaran}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={generating}
              variant="outline"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Otomatis
                </>
              )}
            </Button>
            <Button onClick={handlePreviewPDF} disabled={loadingPDF} variant="outline">
              {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Eye className="mr-2 h-4 w-4" />
              Preview PDF
            </Button>
            <Button onClick={handleExportPDF} disabled={loadingPDF} variant="outline">
              {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Form Identitas */}
        <Card>
          <CardHeader>
            <CardTitle>Identitas PROSEM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tahun Ajaran</Label>
                <Input
                  value={formData.tahunAjaran}
                  onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                  placeholder="Contoh: 2025/2026"
                />
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) => setFormData({ ...formData, semester: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                    <SelectItem value="Genap">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mingguan */}
        <Card>
          <CardHeader>
            <CardTitle>Rencana Mingguan (20 Minggu)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.mingguan.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Belum ada data mingguan.</p>
                <p className="text-sm mt-2">Klik tombol "Generate Otomatis" untuk mengisi data mingguan.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.mingguan.map((minggu, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Minggu ke-{minggu.minggu}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tema</Label>
                          <Input
                            value={minggu.tema}
                            onChange={(e) => handleMingguChange(index, 'tema', e.target.value)}
                            placeholder="Masukkan tema"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Sub Tema</Label>
                          <Input
                            value={minggu.subTema}
                            onChange={(e) => handleMingguChange(index, 'subTema', e.target.value)}
                            placeholder="Masukkan sub tema"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Lingkup Perkembangan</Label>
                          <Input
                            value={minggu.lingkupPerkembangan}
                            onChange={(e) => handleMingguChange(index, 'lingkupPerkembangan', e.target.value)}
                            placeholder="Masukkan lingkup perkembangan"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Kegiatan Pembelajaran</Label>
                          <Textarea
                            value={minggu.kegiatanPembelajaran}
                            onChange={(e) => handleMingguChange(index, 'kegiatanPembelajaran', e.target.value)}
                            placeholder="Masukkan kegiatan pembelajaran"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Indikator</Label>
                          <Textarea
                            value={minggu.indikator}
                            onChange={(e) => handleMingguChange(index, 'indikator', e.target.value)}
                            placeholder="Masukkan indikator pencapaian"
                            rows={2}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PDF Preview Full Screen */}
      {showPdfPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
          {/* Header Toolbar */}
          <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Preview PDF PROSEM</h2>
              <p className="text-sm text-muted-foreground">{formData.semester} {formData.tahunAjaran}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExportPDF} variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={handleSave} variant="outline" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Simpan
              </Button>
              <Button onClick={() => {
                setShowPdfPreview(false)
                if (pdfPreviewUrl) {
                  window.URL.revokeObjectURL(pdfPreviewUrl)
                  setPdfPreviewUrl("")
                }
              }} variant="default" size="sm">
                Tutup
              </Button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 bg-gray-100">
            {pdfPreviewUrl ? (
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-full"
                title="PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

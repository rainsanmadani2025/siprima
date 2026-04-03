"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Loader2, Save, FileDown, Eye, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from "next/navigation"

interface ProsemWeek {
  minggu: number
  tema: string
  subTema: string
  lingkupPerkembangan: string
  kegiatanPembelajaran: string
  indikator: string
}

interface ProsemData {
  id: string
  teacherId: string
  tahunAjaran: string
  semester: string
  mingguan: ProsemWeek[]
  createdAt: string
  updatedAt: string
}

export default function EditProsemPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const [prosem, setProsem] = useState<ProsemData | null>(null)
  const [mingguan, setMingguan] = useState<ProsemWeek[]>([])

  useEffect(() => {
    if (params.id) {
      fetchProsemDetail(params.id as string)
    }
  }, [params.id])

  const fetchProsemDetail = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/prosem/detail?id=${id}`)
      const data = await response.json()

      if (data.success) {
        let mingguanData = data.prosem.mingguan || []
        if (typeof mingguanData === 'string') {
          mingguanData = JSON.parse(mingguanData)
        }

        const prosemData = {
          ...data.prosem,
          mingguan: mingguanData
        }
        setProsem(prosemData)
        setMingguan(mingguanData)
      } else {
        throw new Error(data.error || 'Gagal mengambil detail PROSEM')
      }
    } catch (error: any) {
      console.error('Error fetching PROSEM detail:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengambil detail PROSEM"
      })
      router.push('/dashboard/guru/perencanaan')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!prosem) return

    try {
      setSaving(true)

      const response = await fetch(`/api/prosem/update?id=${prosem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tahunAjaran: prosem.tahunAjaran,
          semester: prosem.semester,
          mingguan
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "PROSEM berhasil diupdate"
        })
        router.push('/dashboard/guru/perencanaan')
      } else {
        throw new Error(data.error || 'Gagal mengupdate PROSEM')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengupdate PROSEM"
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreviewPDF = async () => {
    if (!prosem) return

    try {
      setLoadingPDF(true)

      const response = await fetch('/api/prosem/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prosemId: prosem.id })
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
    if (!prosem) return

    try {
      setLoadingPDF(true)
      const response = await fetch('/api/prosem/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prosemId: prosem.id })
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `PROSEM-${prosem.semester}-${prosem.tahunAjaran}.pdf`
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

  const handleWeekChange = (index: number, field: keyof ProsemWeek, value: string | number) => {
    const updatedMingguan = [...mingguan]
    updatedMingguan[index][field] = value as never
    setMingguan(updatedMingguan)
  }

  const addWeek = () => {
    const newWeek: ProsemWeek = {
      minggu: mingguan.length + 1,
      tema: '',
      subTema: '',
      lingkupPerkembangan: '',
      kegiatanPembelajaran: '',
      indikator: ''
    }
    setMingguan([...mingguan, newWeek])
  }

  const deleteWeek = (index: number) => {
    const updatedMingguan = mingguan.filter((_, i) => i !== index)
    // Update minggu numbers
    updatedMingguan.forEach((week, i) => {
      week.minggu = i + 1
    })
    setMingguan(updatedMingguan)
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
              <h1 className="text-3xl font-bold tracking-tight">Edit PROSEM</h1>
              <p className="text-muted-foreground mt-1">
                Semester {prosem?.semester} - Tahun Ajaran {prosem?.tahunAjaran}
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
          </div>
        </div>

        {/* PROSEM Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edit Mingguan PROSEM</CardTitle>
                <CardDescription>Ubah dan perbarui data mingguan PROSEM</CardDescription>
              </div>
              <Button onClick={addWeek} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Minggu
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-4 pr-4">
                {mingguan.map((minggu, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {minggu.minggu}
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Tema</Label>
                            <Input
                              value={minggu.tema}
                              onChange={(e) => handleWeekChange(index, 'tema', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Sub Tema</Label>
                            <Input
                              value={minggu.subTema}
                              onChange={(e) => handleWeekChange(index, 'subTema', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Lingkup Perkembangan</Label>
                            <Input
                              value={minggu.lingkupPerkembangan}
                              onChange={(e) => handleWeekChange(index, 'lingkupPerkembangan', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Kegiatan Pembelajaran</Label>
                            <Input
                              value={minggu.kegiatanPembelajaran}
                              onChange={(e) => handleWeekChange(index, 'kegiatanPembelajaran', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Indikator</Label>
                          <Textarea
                            value={minggu.indikator}
                            onChange={(e) => handleWeekChange(index, 'indikator', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteWeek(index)}
                        className="flex-shrink-0 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}

                {mingguan.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada mingguan. Klik tombol "Tambah Minggu" untuk menambahkan.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

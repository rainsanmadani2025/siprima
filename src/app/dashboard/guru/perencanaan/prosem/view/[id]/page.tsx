"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Loader2, Download, Edit, Printer } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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

export default function ViewProsemPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const [prosem, setProsem] = useState<ProsemData | null>(null)

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
        let mingguan = data.prosem.mingguan || []
        if (typeof mingguan === 'string') {
          mingguan = JSON.parse(mingguan)
        }
        setProsem({
          ...data.prosem,
          mingguan
        })
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

  const handleDownloadPDF = async () => {
    if (!prosem) return

    try {
      setLoadingPDF(true)
      const response = await fetch('/api/prosem/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prosemId: prosem.id })
      })

      if (!response.ok) {
        throw new Error('Gagal mengunduh PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `PROSEM-${prosem.semester}-${prosem.tahunAjaran}.pdf`
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

  if (loading) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!prosem) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">PROSEM tidak ditemukan</p>
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
              <h1 className="text-3xl font-bold tracking-tight">Detail PROSEM</h1>
              <p className="text-muted-foreground mt-1">
                Semester {prosem.semester} - Tahun Ajaran {prosem.tahunAjaran}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/guru/perencanaan/prosem/edit/${prosem.id}`)}
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

        {/* PROSEM Content */}
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <Card className="print:border print:shadow-none">
            <CardHeader>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold">RA INSAN MADANI</h2>
                <h3 className="text-lg font-semibold">PROGRAM SEMESTER (PROMES)</h3>
                <p className="text-sm text-muted-foreground">
                  Semester {prosem.semester} - Tahun Ajaran {prosem.tahunAjaran}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-2 text-sm">Minggu</th>
                      <th className="border border-slate-300 p-2 text-sm">Tema</th>
                      <th className="border border-slate-300 p-2 text-sm">Sub Tema</th>
                      <th className="border border-slate-300 p-2 text-sm">Lingkup</th>
                      <th className="border border-slate-300 p-2 text-sm">Kegiatan</th>
                      <th className="border border-slate-300 p-2 text-sm">Indikator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prosem.mingguan.map((minggu, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="border border-slate-300 p-2 text-sm text-center">{minggu.minggu}</td>
                        <td className="border border-slate-300 p-2 text-sm">{minggu.tema}</td>
                        <td className="border border-slate-300 p-2 text-sm">{minggu.subTema}</td>
                        <td className="border border-slate-300 p-2 text-sm">{minggu.lingkupPerkembangan}</td>
                        <td className="border border-slate-300 p-2 text-sm">{minggu.kegiatanPembelajaran}</td>
                        <td className="border border-slate-300 p-2 text-sm">{minggu.indikator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground mt-4 print:hidden">
            <p>Dibuat: {new Date(prosem.createdAt).toLocaleDateString('id-ID')}</p>
            <p>Terakhir diupdate: {new Date(prosem.updatedAt).toLocaleDateString('id-ID')}</p>
          </div>
        </ScrollArea>
      </div>
    </DashboardLayout>
  )
}

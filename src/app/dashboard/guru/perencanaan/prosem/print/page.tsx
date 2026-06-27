"use client"

import { useState, useEffect, Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Loader2, Printer, FileDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function PROSEMPrintPageWrapper() {
  return (
    <Suspense fallback={<DashboardLayout role="guru" userName="Ibu Guru"><div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div></DashboardLayout>}>
      <PROSEMPrintPage />
    </Suspense>
  )
}

function PROSEMPrintPage() {

  const router = useRouter()
  const searchParams = useSearchParams()
  const prosemId = searchParams.get('id')
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [prosem, setProsem] = useState<PROSEM | null>(null)
  const [kepsek, setKepsek] = useState<KepsekData | null>(null)
  const [guru, setGuru] = useState<GuruData | null>(null)

  useEffect(() => {
    if (prosemId) {
      fetchPROSEM()
      fetchKepsekData()
      fetchGuruData()
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

        setProsem({
          ...data.prosem,
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

  const fetchKepsekData = async () => {
    try {
      const response = await fetch('/api/kepsek/data')
      const data = await response.json()

      if (data.success && data.kepsek) {
        setKepsek(data.kepsek)
      }
    } catch (error) {
      console.error('Error fetching kepsek data:', error)
    }
  }

  const fetchGuruData = async () => {
    try {
      const response = await fetch('/api/guru/data')
      const data = await response.json()

      if (data.success && data.guru) {
        setGuru(data.guru)
      }
    } catch (error) {
      console.error('Error fetching guru data:', error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = async () => {
    if (!prosem) return

    try {
      const response = await fetch('/api/prosem/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...prosem,
          kepsek,
          guru
        })
      })

      if (!response.ok) {
        throw new Error('Gagal mengekspor PDF')
      }

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
        description: error.message || "Gagal mengekspor PDF"
      })
    }
  }

  const getFormattedDate = () => {
    const now = new Date()
    const options = { day: 'numeric', month: 'long', year: 'numeric' } as const
    return now.toLocaleDateString('id-ID', options)
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

  if (!prosem) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            PROSEM tidak ditemukan
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center gap-4 no-print">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Preview PROSEM</h1>
            <p className="text-muted-foreground mt-2">
              SEMESTER {prosem.semester} - TAHUN AJARAN {prosem.tahunAjaran}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportPDF} variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Cetak
            </Button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="bg-white p-8 shadow-lg print:shadow-none print:p-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-xl font-bold mb-2">PROGRAM SEMESTER (PROMES)</div>
            <div className="text-lg font-semibold mb-2">RA INSAN MADANI</div>
            <div className="text-base">Tahun Ajaran {prosem.tahunAjaran}</div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <div className="font-bold text-lg">
              PROSEM SEMESTER {prosem.semester}, TAHUN {prosem.tahunAjaran}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black p-2 text-sm font-bold">Minggu ke</th>
                  <th className="border border-black p-2 text-sm font-bold">Tema</th>
                  <th className="border border-black p-2 text-sm font-bold">Sub Tema</th>
                  <th className="border border-black p-2 text-sm font-bold">Lingkup Perkembangan</th>
                  <th className="border border-black p-2 text-sm font-bold">Kegiatan Pembelajaran</th>
                  <th className="border border-black p-2 text-sm font-bold">Indikator</th>
                </tr>
              </thead>
              <tbody>
                {prosem.mingguan.map((minggu, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-black p-2 text-sm text-center">{minggu.minggu}</td>
                    <td className="border border-black p-2 text-sm">{minggu.tema}</td>
                    <td className="border border-black p-2 text-sm">{minggu.subTema}</td>
                    <td className="border border-black p-2 text-sm">{minggu.lingkupPerkembangan}</td>
                    <td className="border border-black p-2 text-sm">{minggu.kegiatanPembelajaran}</td>
                    <td className="border border-black p-2 text-sm">{minggu.indikator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer - Two Column Signature */}
          <div className="mt-16 grid grid-cols-2 gap-8">
            {/* Left Column - Kepala Sekolah */}
            <div className="text-center">
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala Sekolah</p>
              <p className="mt-2">{kepsek?.name || '_______________________'}</p>
              <p className="text-sm">NUPTK: {kepsek?.nuptk || '_______________________'}</p>
              <p className="mt-24 font-semibold">({kepsek?.name || '_______________________'})</p>
            </div>

            {/* Right Column - Guru Kelas */}
            <div className="text-center">
              <p>Bandung, {getFormattedDate()}</p>
              <p className="font-semibold">Guru Kelas</p>
              <p className="mt-2">{guru?.name || '_______________________'}</p>
              <p className="text-sm">NUPTK: {guru?.nuptk || '_______________________'}</p>
              <p className="mt-24 font-semibold">({guru?.name || '_______________________'})</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}


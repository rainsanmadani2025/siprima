"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Calendar, ArrowRight, Download, Trash2, Search, Edit, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface RPPItem {
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
  createdAt: string
  updatedAt: string
}

interface ProsemItem {
  id: string
  teacherId: string
  tahunAjaran: string
  semester: string
  createdAt: string
  updatedAt: string
}

export default function GuruPerencanaanPage() {
  const router = useRouter()
  const [rpps, setRpps] = useState<RPPItem[]>([])
  const [prosems, setProsems] = useState<ProsemItem[]>([])
  const [loadingRpp, setLoadingRpp] = useState(true)
  const [loadingProsem, setLoadingProsem] = useState(true)
  const [rppSearch, setRppSearch] = useState("")

  useEffect(() => {
    fetchRPPs()
    fetchProsems()
  }, [])

  const fetchRPPs = async () => {
    try {
      setLoadingRpp(true)
      const response = await fetch('/api/rpp/list')
      const data = await response.json()
      if (data.success) {
        setRpps(data.rpps)
      }
    } catch (error) {
      console.error('Error fetching RPPs:', error)
    } finally {
      setLoadingRpp(false)
    }
  }

  const fetchProsems = async () => {
    try {
      setLoadingProsem(true)
      const response = await fetch('/api/prosem/list')
      const data = await response.json()
      if (data.success) {
        setProsems(data.prosems)
      }
    } catch (error) {
      console.error('Error fetching PROSEMs:', error)
    } finally {
      setLoadingProsem(false)
    }
  }

  const downloadRPP = async (rppId: string) => {
    try {
      const response = await fetch('/api/rpp/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rppId })
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `RPP-${rppId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading RPP:', error)
    }
  }

  const deleteRPP = async (rppId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus RPP ini?')) return

    try {
      const response = await fetch(`/api/rpp/delete?id=${rppId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchRPPs()
      }
    } catch (error) {
      console.error('Error deleting RPP:', error)
    }
  }

  const downloadProsem = async (prosemId: string) => {
    try {
      const response = await fetch('/api/prosem/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prosemId })
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `PROSEM-${prosemId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading PROSEM:', error)
    }
  }

  const deleteProsem = async (prosemId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus PROSEM ini?')) return

    try {
      const response = await fetch(`/api/prosem/delete?id=${prosemId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchProsems()
      }
    } catch (error) {
      console.error('Error deleting PROSEM:', error)
    }
  }

  const filteredRpps = rpps.filter(rpp =>
    rpp.tema.toLowerCase().includes(rppSearch.toLowerCase()) ||
    rpp.judulKegiatan.toLowerCase().includes(rppSearch.toLowerCase()) ||
    rpp.subtema.toLowerCase().includes(rppSearch.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const handleViewRPP = (rppId: string) => {
    router.push(`/dashboard/guru/perencanaan/view/${rppId}`)
  }

  const handleEditRPP = (rppId: string) => {
    router.push(`/dashboard/guru/perencanaan/edit/${rppId}`)
  }

  const handleViewProsem = (prosemId: string) => {
    router.push(`/dashboard/guru/perencanaan/prosem/view/${prosemId}`)
  }

  const handleEditProsem = (prosemId: string) => {
    router.push(`/dashboard/guru/perencanaan/prosem/edit/${prosemId}`)
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perencanaan Pembelajaran</h1>
          <p className="text-muted-foreground mt-2">
            Kelola rencana pembelajaran RPP KBC dan Program Semester
          </p>
        </div>

        {/* Create Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* RPP Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                Rencana Pelaksanaan Pembelajaran (RPP)
              </CardTitle>
              <CardDescription>
                RPP KBC dengan format standar yang komprehensif
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• Template otomatis dengan AI</p>
                <p>• Format RPP KBC lengkap</p>
                <p>• Export ke PDF dan Word</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push('/dashboard/guru/perencanaan/buat')}
                  className="flex-1"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Buat RPP Baru
                </Button>
                <Button
                  onClick={() => router.push('/dashboard/guru/perencanaan/buat')}
                  variant="outline"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PROSEM Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Calendar className="h-5 w-5" />
                </div>
                Program Semester (PROSEM)
              </CardTitle>
              <CardDescription>
                Perencanaan pembelajaran per semester
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• 20 minggu per semester</p>
                <p>• Auto-generate dengan AI</p>
                <p>• Export PDF dengan tanda tangan</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push('/dashboard/guru/perencanaan/prosem')}
                  className="flex-1"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Buat PROSEM Baru
                </Button>
                <Button
                  onClick={() => router.push('/dashboard/guru/perencanaan/prosem')}
                  variant="outline"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Daftar RPP Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Daftar RPP
                </div>
                <span className="text-sm font-normal text-muted-foreground">
                  {rpps.length} dokumen
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari RPP..."
                  value={rppSearch}
                  onChange={(e) => setRppSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {loadingRpp ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Memuat daftar RPP...
                  </div>
                ) : filteredRpps.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {rppSearch ? 'Tidak ada RPP yang cocok dengan pencarian' : 'Belum ada RPP yang disimpan'}
                  </div>
                ) : (
                  filteredRpps.map((rpp) => (
                    <Card key={rpp.id} className="p-4 hover:bg-accent/50 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{rpp.tema}</h4>
                            <p className="text-xs text-muted-foreground truncate">{rpp.judulKegiatan}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleViewRPP(rpp.id)}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditRPP(rpp.id)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => downloadRPP(rpp.id)}
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteRPP(rpp.id)}
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{rpp.semester}</span>
                          <span>•</span>
                          <span>{rpp.tahunAjaran}</span>
                          <span>•</span>
                          <span>{formatDate(rpp.createdAt)}</span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Daftar PROSEM Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Daftar PROSEM
                </div>
                <span className="text-sm font-normal text-muted-foreground">
                  {prosems.length} dokumen
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {loadingProsem ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Memuat daftar PROSEM...
                  </div>
                ) : prosems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada PROSEM yang disimpan
                  </div>
                ) : (
                  prosems.map((prosem) => (
                    <Card key={prosem.id} className="p-4 hover:bg-accent/50 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">PROSEM</h4>
                            <p className="text-xs text-muted-foreground">
                              {prosem.semester} • {prosem.tahunAjaran}
                            </p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleViewProsem(prosem.id)}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditProsem(prosem.id)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => downloadProsem(prosem.id)}
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteProsem(prosem.id)}
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Dibuat: {formatDate(prosem.createdAt)}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

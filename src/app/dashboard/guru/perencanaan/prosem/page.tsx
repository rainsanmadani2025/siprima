"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileText, Plus, ArrowLeft, Trash2, Printer, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface PROSEM {
  id: string
  tahunAjaran: string
  semester: string
  mingguan: string
  createdAt: string
  updatedAt: string
}

export default function PROSEMListPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [prosems, setProsems] = useState<PROSEM[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSemester, setFilterSemester] = useState("")

  useEffect(() => {
    fetchPROSEMs()
  }, [filterSemester])

  const fetchPROSEMs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterSemester && filterSemester !== 'all') params.append('semester', filterSemester)

      const response = await fetch(`/api/prosem/list?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setProsems(data.prosems)
      }
    } catch (error) {
      console.error('Error fetching PROSEMs:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil daftar PROSEM"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus PROSEM ini?")) return

    try {
      const response = await fetch('/api/prosem/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "PROSEM berhasil dihapus"
        })
        fetchPROSEMs()
      } else {
        throw new Error(data.error || 'Gagal menghapus PROSEM')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menghapus PROSEM"
      })
    }
  }

  const filteredProsems = prosems.filter(prosem =>
    prosem.tahunAjaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prosem.semester.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDisplayTitle = (prosem: PROSEM) => {
    return `PROSEM SEMESTER ${prosem.semester}, TAHUN ${prosem.tahunAjaran}`
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/guru/perencanaan')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Program Semester (PROSEM)</h1>
            <p className="text-muted-foreground mt-2">
              Kelola rencana pembelajaran per semester
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/guru/perencanaan/prosem/buat')}>
            <Plus className="mr-2 h-4 w-4" />
            Buat PROSEM Baru
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari berdasarkan tahun ajaran atau semester..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-48">
                <Select value={filterSemester} onValueChange={setFilterSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Semester</SelectItem>
                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                    <SelectItem value="Genap">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PROSEM List */}
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Memuat data PROSEM...
            </CardContent>
          </Card>
        ) : filteredProsems.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada PROSEM yang tersedia.</p>
              <p className="text-sm mt-2">Klik tombol "Buat PROSEM Baru" untuk membuat PROSEM pertama.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProsems.map((prosem) => (
              <Card key={prosem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    {getDisplayTitle(prosem)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>Tahun Ajaran: {prosem.tahunAjaran}</p>
                    <p>Semester: {prosem.semester}</p>
                    <p>Dibuat: {new Date(prosem.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/guru/perencanaan/prosem/buat?id=${prosem.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/guru/perencanaan/prosem/print?id=${prosem.id}`)}
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(prosem.id)}
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
    </DashboardLayout>
  )
}

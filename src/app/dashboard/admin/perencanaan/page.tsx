"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  FileText,
  Calendar,
  Loader2,
  Eye,
  Trash2,
  BookOpen,
  User
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface RPP {
  id: string
  tema: string
  subtema: string
  semester: string
  tahunAjaran: string
  fase: string
  kelompokUsia: string
  guru: string | null
  kelas: string | null
  createdAt: string
  updatedAt: string
}

interface Teacher {
  id: string
  name: string
  nuptk: string | null
}

interface PROSEM {
  id: string
  teacherId: string
  teacher: Teacher
  tahunAjaran: string
  semester: string
  mingguan: any[]
  createdAt: string
  updatedAt: string
}

export default function AdminPerencanaanPage() {
  const { toast } = useToast()

  // RPP State
  const [rppList, setRppList] = useState<RPP[]>([])
  const [rppLoading, setRppLoading] = useState(true)
  const [rppSearchTerm, setRppSearchTerm] = useState("")
  const [rppFilterSemester, setRppFilterSemester] = useState("")
  const [rppFilterTahun, setRppFilterTahun] = useState("")

  // PROSEM State
  const [prosemList, setProsemList] = useState<PROSEM[]>([])
  const [prosemLoading, setProsemLoading] = useState(true)
  const [prosemSearchTerm, setProsemSearchTerm] = useState("")
  const [prosemFilterSemester, setProsemFilterSemester] = useState("")
  const [prosemFilterTahun, setProsemFilterTahun] = useState("")
  const [deleteProsemId, setDeleteProsemId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchRppList()
    fetchProsemList()
  }, [rppFilterSemester, rppFilterTahun, prosemFilterSemester, prosemFilterTahun])

  const fetchRppList = async () => {
    try {
      setRppLoading(true)
      const params = new URLSearchParams()
      if (rppFilterSemester) params.append('semester', rppFilterSemester)
      if (rppFilterTahun) params.append('tahunAjaran', rppFilterTahun)

      const response = await fetch(`/api/admin/rpp/list?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setRppList(data.rpps)
      }
    } catch (error) {
      console.error('Error fetching RPP list:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil daftar RPP"
      })
    } finally {
      setRppLoading(false)
    }
  }

  const fetchProsemList = async () => {
    try {
      setProsemLoading(true)
      const params = new URLSearchParams()
      if (prosemFilterSemester) params.append('semester', prosemFilterSemester)
      if (prosemFilterTahun) params.append('tahunAjaran', prosemFilterTahun)

      const response = await fetch(`/api/admin/prosem/list?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setProsemList(data.prosems)
      }
    } catch (error) {
      console.error('Error fetching PROSEM list:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil daftar PROSEM"
      })
    } finally {
      setProsemLoading(false)
    }
  }

  const handleDeleteProsem = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus PROSEM ini?")) return

    try {
      setDeleting(true)
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
        fetchProsemList()
      } else {
        throw new Error(data.error || 'Gagal menghapus PROSEM')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menghapus PROSEM"
      })
    } finally {
      setDeleting(false)
      setDeleteProsemId(null)
    }
  }

  const filteredRpps = rppList.filter(rpp =>
    rpp.tema.toLowerCase().includes(rppSearchTerm.toLowerCase()) ||
    rpp.subtema.toLowerCase().includes(rppSearchTerm.toLowerCase()) ||
    (rpp.guru?.toLowerCase().includes(rppSearchTerm.toLowerCase()) || false)
  )

  const filteredProsems = prosemList.filter(prosem =>
    prosem.teacher.name.toLowerCase().includes(prosemSearchTerm.toLowerCase()) ||
    prosem.semester.toLowerCase().includes(prosemSearchTerm.toLowerCase()) ||
    prosem.tahunAjaran.toLowerCase().includes(prosemSearchTerm.toLowerCase())
  )

  const getProsemDisplayTitle = (prosem: PROSEM) => {
    return `SEMESTER ${prosem.semester}, TAHUN ${prosem.tahunAjaran}`
  }

  return (
    <DashboardLayout role="admin" userName="Administrator">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perencanaan Pembelajaran</h1>
          <p className="text-muted-foreground mt-2">
            Kelola RPP dan PROSEM yang dibuat oleh guru
          </p>
        </div>

        <Tabs defaultValue="rpp" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rpp" className="gap-2">
              <FileText className="h-4 w-4" />
              Daftar RPP
            </TabsTrigger>
            <TabsTrigger value="prosem" className="gap-2">
              <Calendar className="h-4 w-4" />
              Daftar PROSEM
            </TabsTrigger>
          </TabsList>

          {/* Tab RPP */}
          <TabsContent value="rpp" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari RPP berdasarkan tema, sub tema, atau guru..."
                      value={rppSearchTerm}
                      onChange={(e) => setRppSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={rppFilterSemester || "all"} onValueChange={(value) => setRppFilterSemester(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Semester</SelectItem>
                      <SelectItem value="Ganjil">Ganjil</SelectItem>
                      <SelectItem value="Genap">Genap</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={rppFilterTahun || "all"} onValueChange={(value) => setRppFilterTahun(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Tahun Ajaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tahun</SelectItem>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                      <SelectItem value="2025/2026">2025/2026</SelectItem>
                      <SelectItem value="2026/2027">2026/2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Daftar RPP ({filteredRpps.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rppLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : filteredRpps.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Tidak ada data RPP</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tema</TableHead>
                          <TableHead>Sub Tema</TableHead>
                          <TableHead>Semester</TableHead>
                          <TableHead>Tahun Ajaran</TableHead>
                          <TableHead>Fase</TableHead>
                          <TableHead>Kelompok Usia</TableHead>
                          <TableHead>Guru</TableHead>
                          <TableHead>Kelas</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRpps.map((rpp) => (
                          <TableRow key={rpp.id}>
                            <TableCell className="font-medium">{rpp.tema}</TableCell>
                            <TableCell>{rpp.subtema}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{rpp.semester}</Badge>
                            </TableCell>
                            <TableCell>{rpp.tahunAjaran}</TableCell>
                            <TableCell>{rpp.fase}</TableCell>
                            <TableCell>{rpp.kelompokUsia}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {rpp.guru || '-'}
                              </div>
                            </TableCell>
                            <TableCell>{rpp.kelas || '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                >
                                  <Link href={`/dashboard/guru/perencanaan/buat?id=${rpp.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab PROSEM */}
          <TabsContent value="prosem" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari PROSEM berdasarkan guru, semester, atau tahun..."
                      value={prosemSearchTerm}
                      onChange={(e) => setProsemSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={prosemFilterSemester || "all"} onValueChange={(value) => setProsemFilterSemester(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Semester</SelectItem>
                      <SelectItem value="Ganjil">Ganjil</SelectItem>
                      <SelectItem value="Genap">Genap</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={prosemFilterTahun || "all"} onValueChange={(value) => setProsemFilterTahun(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Tahun Ajaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tahun</SelectItem>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                      <SelectItem value="2025/2026">2025/2026</SelectItem>
                      <SelectItem value="2026/2027">2026/2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Daftar PROSEM ({filteredProsems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {prosemLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : filteredProsems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Tidak ada data PROSEM</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Guru</TableHead>
                          <TableHead>NUPTK</TableHead>
                          <TableHead>Semester</TableHead>
                          <TableHead>Tahun Ajaran</TableHead>
                          <TableHead>Jumlah Minggu</TableHead>
                          <TableHead>Dibuat</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProsems.map((prosem) => (
                          <TableRow key={prosem.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {prosem.teacher.name}
                              </div>
                            </TableCell>
                            <TableCell>{prosem.teacher.nuptk || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{prosem.semester}</Badge>
                            </TableCell>
                            <TableCell>{prosem.tahunAjaran}</TableCell>
                            <TableCell>{prosem.mingguan?.length || 0} minggu</TableCell>
                            <TableCell>
                              {new Date(prosem.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                >
                                  <Link href={`/dashboard/guru/perencanaan/prosem/buat?id=${prosem.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProsem(prosem.id)}
                                  disabled={deleting && deleteProsemId === prosem.id}
                                >
                                  {deleting && deleteProsemId === prosem.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

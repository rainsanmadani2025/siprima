"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Eye, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface RPPItem {
  id: string
  tema: string
  subtema: string
  temaProjek: string
  judulKegiatan: string
  fase: string
  kelompokUsia: string
  semester: string
  tahunAjaran: string
  kelas?: string
  guru?: string
  teacherName?: string
  namaSekolah: string
  createdAt: string
  updatedAt: string
}

export default function KepsekPembelajaranPage() {
  const router = useRouter()
  const [rpps, setRpps] = useState<RPPItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchRPPs()
  }, [])

  const fetchRPPs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/rpp/list')
      const data = await response.json()
      if (data.success) {
        setRpps(data.rpps)
      }
    } catch (error) {
      console.error('Error fetching RPPs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRpps = rpps.filter(rpp =>
    rpp.tema.toLowerCase().includes(search.toLowerCase()) ||
    rpp.judulKegiatan.toLowerCase().includes(search.toLowerCase()) ||
    (rpp.teacherName || rpp.guru || '').toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoring Pembelajaran</h1>
          <p className="text-muted-foreground mt-2">
            Pantau Rencana Pelaksanaan Pembelajaran (RPP) dari seluruh guru
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Daftar RPP Seluruh Guru
                </CardTitle>
                <CardDescription className="mt-1">
                  {rpps.length} dokumen RPP
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari tema, judul, atau guru..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span>Memuat data RPP...</span>
              </div>
            ) : filteredRpps.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {search ? 'Tidak ada RPP yang cocok dengan pencarian' : 'Belum ada RPP yang dibuat oleh guru'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">No</TableHead>
                      <TableHead>Guru</TableHead>
                      <TableHead>Tema</TableHead>
                      <TableHead>Judul Kegiatan</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Tanggal Dibuat</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRpps.map((rpp, index) => (
                      <TableRow key={rpp.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div className="font-medium">{rpp.teacherName || rpp.guru || '-'}</div>
                        </TableCell>
                        <TableCell>
                          <div>{rpp.tema}</div>
                          <div className="text-xs text-muted-foreground">{rpp.subtema}</div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate">{rpp.judulKegiatan}</div>
                        </TableCell>
                        <TableCell>
                          {rpp.kelas ? (
                            <Badge variant="outline">{rpp.kelas}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{rpp.semester} {rpp.tahunAjaran}</TableCell>
                        <TableCell className="text-sm">{formatDate(rpp.createdAt)}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/guru/perencanaan/view/${rpp.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Lihat
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
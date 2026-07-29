"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Eye, Calendar, GraduationCap, TrendingUp, Loader2 } from "lucide-react"

interface Kegiatan {
  id: string
  title: string
  date: string
  category: string
  attendees: number | null
  description: string
}

interface GuruReport {
  teacherId: string
  teacherName: string
  rpphCount: number
  totalRpph: number
  assessmentCount: number
  attendPercent: number
  statusLabel: string
  statusColor: string
}

interface SiswaReportRow {
  studentId: string
  studentName: string
  className: string
  percent: number
  dominant: string
  dominantColor: string
  reportStatusLabel: string
  reportStatusColor: string
}

interface LaporanData {
  kegiatan: Kegiatan[]
  guruReport: GuruReport[]
  siswaReport: {
    summary: {
      totalReports: number
      totalStudents: number
      bsbCount: number
      bshCount: number
      mbCount: number
      bbCount: number
    }
    students: SiswaReportRow[]
  }
  meta: {
    semester: string
    academicYear: string
    currentMonth: string
    currentYear: number
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function KepsekLaporanPage() {
  const [data, setData] = useState<LaporanData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/kepsek/laporan')
      .then(res => res.json())
      .then(result => {
        if (result.success) setData(result.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <DashboardLayout role="kepsek" userName="Kepala Sekolah">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!data) {
    return (
      <DashboardLayout role="kepsek" userName="Kepala Sekolah">
        <div className="text-center py-8 text-muted-foreground">Gagal memuat data laporan</div>
      </DashboardLayout>
    )
  }

  const { kegiatan, guruReport, siswaReport, meta } = data

  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Laporan</h1>
            <p className="text-muted-foreground mt-2">Kelola dan akses berbagai laporan sekolah</p>
          </div>
        </div>

        <Tabs defaultValue="kegiatan" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kegiatan">Laporan Kegiatan</TabsTrigger>
            <TabsTrigger value="guru">Laporan Bulanan Guru</TabsTrigger>
            <TabsTrigger value="siswa">Laporan Perkembangan Siswa</TabsTrigger>
          </TabsList>

          {/* Laporan Kegiatan Sekolah */}
          <TabsContent value="kegiatan" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Laporan Kegiatan Sekolah
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {kegiatan.length > 0 ? (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Judul Kegiatan</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Kategori</TableHead>
                          <TableHead>Peserta</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {kegiatan.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell><Badge>{item.category}</Badge></TableCell>
                            <TableCell>{item.attendees ? `${item.attendees} orang` : '-'}</TableCell>
                            <TableCell><Badge className="bg-green-600">Selesai</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">Belum ada data kegiatan sekolah</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Laporan Bulanan Guru */}
          <TabsContent value="guru" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Laporan Bulanan Guru
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {guruReport.length > 0 ? (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Guru</TableHead>
                          <TableHead>Jumlah RPPH</TableHead>
                          <TableHead>Jumlah Penilaian</TableHead>
                          <TableHead>Kehadiran</TableHead>
                          <TableHead>Status Laporan</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {guruReport.map((guru) => (
                          <TableRow key={guru.teacherId}>
                            <TableCell className="font-medium">{guru.teacherName}</TableCell>
                            <TableCell>{guru.rpphCount}/{guru.totalRpph}</TableCell>
                            <TableCell>{guru.assessmentCount}</TableCell>
                            <TableCell>{guru.attendPercent}%</TableCell>
                            <TableCell><Badge className={guru.statusColor}>{guru.statusLabel}</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">Belum ada data guru</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Laporan Perkembangan Siswa */}
          <TabsContent value="siswa" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Laporan Perkembangan Siswa — {meta.semester} {meta.academicYear}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Raport</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{siswaReport.summary.totalReports}</div>
                        <p className="text-xs text-muted-foreground mt-1">Dari {siswaReport.summary.totalStudents} siswa</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Sangat Baik (BSB)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{siswaReport.summary.bsbCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">{siswaReport.summary.totalStudents > 0 ? Math.round((siswaReport.summary.bsbCount / siswaReport.summary.totalStudents) * 100) : 0}% siswa</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Baik (BSH)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{siswaReport.summary.bshCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">{siswaReport.summary.totalStudents > 0 ? Math.round((siswaReport.summary.bshCount / siswaReport.summary.totalStudents) * 100) : 0}% siswa</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Perlu Bimbingan (MB)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{siswaReport.summary.mbCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">{siswaReport.summary.totalStudents > 0 ? Math.round((siswaReport.summary.mbCount / siswaReport.summary.totalStudents) * 100) : 0}% siswa</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Belum Berkembang (BB)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{siswaReport.summary.bbCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">{siswaReport.summary.totalStudents > 0 ? Math.round((siswaReport.summary.bbCount / siswaReport.summary.totalStudents) * 100) : 0}% siswa</p>
                      </CardContent>
                    </Card>
                  </div>

                  {siswaReport.students.length > 0 ? (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama Siswa</TableHead>
                            <TableHead>Kelas</TableHead>
                            <TableHead>Nilai Rata-rata</TableHead>
                            <TableHead>Predikat</TableHead>
                            <TableHead>Status Raport</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {siswaReport.students.map((s) => (
                            <TableRow key={s.studentId}>
                              <TableCell className="font-medium">{s.studentName}</TableCell>
                              <TableCell>{s.className}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-green-600" style={{ width: `${s.percent}%` }}></div>
                                  </div>
                                  <span className="text-sm">{s.percent}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {s.dominant !== '-' ? (
                                  <Badge className={s.dominantColor}>{s.dominant}</Badge>
                                ) : (
                                  <span className="text-muted-foreground text-sm">-</span>
                                )}
                              </TableCell>
                              <TableCell><Badge className={s.reportStatusColor}>{s.reportStatusLabel}</Badge></TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">Belum ada data laporan perkembangan siswa</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
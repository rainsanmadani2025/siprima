"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Eye, Calendar, Users, GraduationCap, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function KepsekLaporanPage() {
  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Laporan</h1>
            <p className="text-muted-foreground mt-2">
              Kelola dan akses berbagai laporan sekolah
            </p>
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
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download Semua
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
                    <TableRow>
                      <TableCell className="font-medium">Pentas Seni Akhir Semester</TableCell>
                      <TableCell>20 Des 2024</TableCell>
                      <TableCell>
                        <Badge>Pentas Seni</Badge>
                      </TableCell>
                      <TableCell>156 siswa, 24 guru, 200 wali murid</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">Selesai</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Outing Class ke Kebun Raya</TableCell>
                      <TableCell>15 Des 2024</TableCell>
                      <TableCell>
                        <Badge>Outing Class</Badge>
                      </TableCell>
                      <TableCell>80 siswa kelas B, 10 guru</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">Selesai</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Rapat Wali Murid</TableCell>
                      <TableCell>10 Des 2024</TableCell>
                      <TableCell>
                        <Badge>Rapat</Badge>
                      </TableCell>
                      <TableCell>150 wali murid, 24 guru</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">Selesai</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Parenting Day</TableCell>
                      <TableCell>5 Des 2024</TableCell>
                      <TableCell>
                        <Badge>Parenting Day</Badge>
                      </TableCell>
                      <TableCell>100 orang tua, 12 guru</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">Selesai</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
                  <div className="flex gap-2">
                    <Select defaultValue="januari">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="januari">Januari 2025</SelectItem>
                        <SelectItem value="desember">Desember 2024</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download Semua
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Guru</TableHead>
                      <TableHead>Bulan</TableHead>
                      <TableHead>Jumlah RPPH</TableHead>
                      <TableHead>Jumlah Penilaian</TableHead>
                      <TableHead>Kehadiran</TableHead>
                      <TableHead>Status Laporan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Ibu Sari, S.Pd</TableCell>
                      <TableCell>Januari 2025</TableCell>
                      <TableCell>20/20</TableCell>
                      <TableCell>38/40</TableCell>
                      <TableCell>95%</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">Disetujui</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ibu Ani, S.Pd</TableCell>
                      <TableCell>Januari 2025</TableCell>
                      <TableCell>21/21</TableCell>
                      <TableCell>42/42</TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">Disetujui</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bapak Budi, S.Pd</TableCell>
                      <TableCell>Januari 2025</TableCell>
                      <TableCell>18/21</TableCell>
                      <TableCell>35/42</TableCell>
                      <TableCell>90%</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600">Menunggu Review</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ibu Dewi, S.Pd</TableCell>
                      <TableCell>Januari 2025</TableCell>
                      <TableCell>20/21</TableCell>
                      <TableCell>40/42</TableCell>
                      <TableCell>95%</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600">Draft</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
                    Laporan Perkembangan Siswa
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select defaultValue="ganjil">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ganjil">Semester Ganjil 2024/2025</SelectItem>
                        <SelectItem value="genap">Semester Genap 2024/2025</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download Semua
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Ringkasan Perkembangan */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Raport</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">148</div>
                        <p className="text-xs text-muted-foreground mt-1">Dari 156 siswa</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Sangat Baik (BSB)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">45</div>
                        <p className="text-xs text-muted-foreground mt-1">30% siswa</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Baik (BSH)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">85</div>
                        <p className="text-xs text-muted-foreground mt-1">57% siswa</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Perlu Bimbingan (MB)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">18</div>
                        <p className="text-xs text-muted-foreground mt-1">12% siswa</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabel Laporan Siswa */}
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
                      <TableRow>
                        <TableCell className="font-medium">Ahmad Fauzi</TableCell>
                        <TableCell>B1</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-green-600" style={{ width: '92%' }}></div>
                            </div>
                            <span className="text-sm">92%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-600">BSB</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-600">Selesai</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Aisyah Putri</TableCell>
                        <TableCell>B1</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600" style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-sm">85%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-600">BSH</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-600">Selesai</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Budi Santoso</TableCell>
                        <TableCell>B1</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-600" style={{ width: '72%' }}></div>
                            </div>
                            <span className="text-sm">72%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-600">MB</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-600">Draft</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

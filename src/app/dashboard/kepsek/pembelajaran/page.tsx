"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, FileText, CheckCircle2, Clock, AlertCircle, Camera, Heart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function KepsekPembelajaranPage() {
  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitoring Pembelajaran</h1>
            <p className="text-muted-foreground mt-2">
              Pantau rencana dan aktivitas pembelajaran guru
            </p>
          </div>
          <Select defaultValue="minggu-ini">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hari-ini">Hari Ini</SelectItem>
              <SelectItem value="minggu-ini">Minggu Ini</SelectItem>
              <SelectItem value="bulan-ini">Bulan Ini</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistik Pembelajaran */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RPPH Selesai</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-xs text-muted-foreground mt-1">17/20 RPPH hari ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RPPM Terlaksana</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">90%</div>
              <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dokumentasi</CardTitle>
              <Camera className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">156</div>
              <p className="text-xs text-muted-foreground mt-1">Foto kegiatan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kurikulum Cinta</CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">100%</div>
              <p className="text-xs text-muted-foreground mt-1">Terimplementasi</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rpph" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rpph">RPPH Harian</TabsTrigger>
            <TabsTrigger value="rppm">RPPM Mingguan</TabsTrigger>
            <TabsTrigger value="dokumentasi">Dokumentasi</TabsTrigger>
          </TabsList>

          {/* RPPH Harian */}
          <TabsContent value="rpph" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Rencana Pembelajaran Harian (RPPH) - 7 Januari 2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guru</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Tema</TableHead>
                      <TableHead>Subtema</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Waktu Submit</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Ibu Sari, S.Pd</TableCell>
                      <TableCell>B1</TableCell>
                      <TableCell>Tanaman</TableCell>
                      <TableCell>Bagian-bagian tanaman</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Selesai</span>
                        </div>
                      </TableCell>
                      <TableCell>07:00</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Lihat</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ibu Ani, S.Pd</TableCell>
                      <TableCell>A1</TableCell>
                      <TableCell>Diri Sendiri</TableCell>
                      <TableCell>Anggota tubuh</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Selesai</span>
                        </div>
                      </TableCell>
                      <TableCell>07:05</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Lihat</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ibu Dewi, S.Pd</TableCell>
                      <TableCell>B2</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-600">Belum diisi</span>
                        </div>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Remind</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bapak Budi, S.Pd</TableCell>
                      <TableCell>A2</TableCell>
                      <TableCell>Agama</TableCell>
                      <TableCell>Adab makan</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="text-yellow-600">Draft</span>
                        </div>
                      </TableCell>
                      <TableCell>08:30</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Lihat</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RPPM Mingguan */}
          <TabsContent value="rppm" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Rencana Pembelajaran Mingguan (RPPM) - Minggu ke-3
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guru</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Tema</TableHead>
                      <TableHead>Subtema</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Ibu Sari, S.Pd</TableCell>
                      <TableCell>B1</TableCell>
                      <TableCell>Tanaman</TableCell>
                      <TableCell>Jenis, bagian, manfaat</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">Disetujui</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Lihat</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ibu Ani, S.Pd</TableCell>
                      <TableCell>A1</TableCell>
                      <TableCell>Diri Sendiri</TableCell>
                      <TableCell>Identitas, keluarga, teman</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">Disetujui</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Lihat</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ibu Dewi, S.Pd</TableCell>
                      <TableCell>B2</TableCell>
                      <TableCell>Hewan</TableCell>
                      <TableCell>Jenis, habitat, makanan</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600">Menunggu Review</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Review</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dokumentasi Kegiatan */}
          <TabsContent value="dokumentasi" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Dokumentasi Kegiatan Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="group relative rounded-lg overflow-hidden border bg-muted/50">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <Camera className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm">Observasi Tanaman</h3>
                      <p className="text-xs text-muted-foreground">Kelas B1 • Ibu Sari</p>
                      <p className="text-xs text-muted-foreground mt-1">08:30</p>
                    </div>
                  </div>
                  <div className="group relative rounded-lg overflow-hidden border bg-muted/50">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <Camera className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm">Menggambar Wajah</h3>
                      <p className="text-xs text-muted-foreground">Kelas A1 • Ibu Ani</p>
                      <p className="text-xs text-muted-foreground mt-1">09:00</p>
                    </div>
                  </div>
                  <div className="group relative rounded-lg overflow-hidden border bg-muted/50">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <Camera className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm">Bermain Peran</h3>
                      <p className="text-xs text-muted-foreground">Kelas B2 • Ibu Dewi</p>
                      <p className="text-xs text-muted-foreground mt-1">10:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Program Kurikulum Berbasis Cinta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-600" />
              Program Kurikulum Berbasis Cinta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border bg-pink-50 dark:bg-pink-950/20">
                <h3 className="font-semibold mb-2">Kasih Sayang dalam Interaksi</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Sapa hangat setiap pagi</li>
                  <li>✓ Pujian dan afirmasi positif</li>
                  <li>✓ Pendengaran aktif pada anak</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border bg-pink-50 dark:bg-pink-950/20">
                <h3 className="font-semibold mb-2">Lingkungan Penuh Kasih</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Ruang belajar nyaman</li>
                  <li>✓ Dekorasi ramah anak</li>
                  <li>✓ Area bermain aman</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border bg-pink-50 dark:bg-pink-950/20">
                <h3 className="font-semibold mb-2">Pendekatan Individu</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Perhatian pada kebutuhan unik</li>
                  <li>✓ Dukungan emosional</li>
                  <li>✓ Respek terhadap perbedaan</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

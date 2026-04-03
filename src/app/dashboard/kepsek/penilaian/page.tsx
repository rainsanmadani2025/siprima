"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardList, Star, FileText, Camera, MessageSquare, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function KepsekPenilaianPage() {
  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitoring Penilaian & Perkembangan Anak</h1>
            <p className="text-muted-foreground mt-2">
              Pantau penilaian perkembangan siswa berdasarkan 6 aspek PAUD
            </p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="bulan-ini">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hari-ini">Hari Ini</SelectItem>
                <SelectItem value="minggu-ini">Minggu Ini</SelectItem>
                <SelectItem value="bulan-ini">Bulan Ini</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export Laporan</Button>
          </div>
        </div>

        {/* Statistik Penilaian */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Penilaian Selesai</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">75%</div>
              <p className="text-xs text-muted-foreground mt-1">120/160 siswa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">BSH</div>
              <p className="text-xs text-muted-foreground mt-1">Berkembang Sesuai Harapan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catatan Anekdot</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">45</div>
              <p className="text-xs text-muted-foreground mt-1">Catatan bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dokumentasi</CardTitle>
              <Camera className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">89</div>
              <p className="text-xs text-muted-foreground mt-1">Foto kegiatan</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ringkasan" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
            <TabsTrigger value="sikap">Sikap & Karakter</TabsTrigger>
            <TabsTrigger value="motorik">Motorik & Bahasa</TabsTrigger>
            <TabsTrigger value="sosial">Sosial Emosional</TabsTrigger>
          </TabsList>

          {/* Ringkasan Penilaian */}
          <TabsContent value="ringkasan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Penilaian Per Aspek - Januari 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Nilai Agama & Moral</h3>
                      <Badge className="bg-green-600">BSH</Badge>
                    </div>
                    <div className="text-2xl font-bold">85%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-green-600" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Fisik Motorik</h3>
                      <Badge className="bg-green-600">BSH</Badge>
                    </div>
                    <div className="text-2xl font-bold">82%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-green-600" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Kognitif</h3>
                      <Badge className="bg-yellow-600">BSB</Badge>
                    </div>
                    <div className="text-2xl font-bold">78%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-yellow-600" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Bahasa</h3>
                      <Badge className="bg-green-600">BSH</Badge>
                    </div>
                    <div className="text-2xl font-bold">80%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-green-600" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Sosial Emosional</h3>
                      <Badge className="bg-green-600">BSH</Badge>
                    </div>
                    <div className="text-2xl font-bold">88%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-green-600" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Seni</h3>
                      <Badge className="bg-green-600">BSH</Badge>
                    </div>
                    <div className="text-2xl font-bold">83%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-green-600" style={{ width: '83%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penilaian Sikap & Karakter */}
          <TabsContent value="sikap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Penilaian Sikap & Karakter (Nilai Agama dan Moral)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guru</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Jumlah Siswa Dinilai</TableHead>
                      <TableHead>Rata-rata Nilai</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Ibu Sari, S.Pd</TableCell>
                      <TableCell>B1</TableCell>
                      <TableCell>18/20</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">BSH</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Selesai</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Lihat</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ibu Ani, S.Pd</TableCell>
                      <TableCell>A1</TableCell>
                      <TableCell>17/18</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">BSH</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="text-yellow-600">Dalam Proses</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Lihat</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ibu Dewi, S.Pd</TableCell>
                      <TableCell>B2</TableCell>
                      <TableCell>10/19</TableCell>
                      <TableCell>
                        <Badge className="bg-orange-600">MB</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-600">Tertinggal</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Remind</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penilaian Motorik & Bahasa */}
          <TabsContent value="motorik" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Penilaian Fisik Motorik & Bahasa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-3">Fisik Motorik</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kelas</TableHead>
                          <TableHead>Gross Motor</TableHead>
                          <TableHead>Fine Motor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>B1</TableCell>
                          <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                          <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>B2</TableCell>
                          <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                          <TableCell><Badge className="bg-yellow-600">MB</Badge></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Bahasa</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kelas</TableHead>
                          <TableHead>Menyimak</TableHead>
                          <TableHead>Berbicara</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>B1</TableCell>
                          <TableCell><Badge className="bg-green-600">BSB</Badge></TableCell>
                          <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>B2</TableCell>
                          <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                          <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penilaian Sosial Emosional */}
          <TabsContent value="sosial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Penilaian Sosial Emosional</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Kerjasama</TableHead>
                      <TableHead>Emosi</TableHead>
                      <TableHead>Disiplin</TableHead>
                      <TableHead>Nilai Akhir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Ahmad Fauzi</TableCell>
                      <TableCell>B1</TableCell>
                      <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                      <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                      <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">BSH</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Aisyah Putri</TableCell>
                      <TableCell>B1</TableCell>
                      <TableCell><Badge className="bg-yellow-600">BSB</Badge></TableCell>
                      <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                      <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600">BSB</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Budi Santoso</TableCell>
                      <TableCell>B1</TableCell>
                      <TableCell><Badge className="bg-orange-600">MB</Badge></TableCell>
                      <TableCell><Badge className="bg-green-600">BSH</Badge></TableCell>
                      <TableCell><Badge className="bg-orange-600">MB</Badge></TableCell>
                      <TableCell>
                        <Badge className="bg-orange-600">MB</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

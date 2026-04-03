"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, GraduationCap, CheckCircle2, AlertCircle, Download, CalendarClock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function KepsekAbsensiPage() {
  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitoring Absensi Sekolah</h1>
            <p className="text-muted-foreground mt-2">
              Pantau kehadiran siswa dan guru
            </p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="2025-01-07">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tanggal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-01-07">7 Januari 2025</SelectItem>
                <SelectItem value="2025-01-06">6 Januari 2025</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistik Absensi Hari Ini */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran Siswa</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">94%</div>
              <p className="text-xs text-muted-foreground mt-1">147/156 hadir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran Guru</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">92%</div>
              <p className="text-xs text-muted-foreground mt-1">22/24 hadir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Izin</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">4</div>
              <p className="text-xs text-muted-foreground mt-1">2 siswa, 2 guru</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sakit</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">7</div>
              <p className="text-xs text-muted-foreground mt-1">5 siswa, 2 guru</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="siswa" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="siswa">Absensi Siswa</TabsTrigger>
            <TabsTrigger value="guru">Absensi Guru</TabsTrigger>
            <TabsTrigger value="rekap">Rekap Bulanan</TabsTrigger>
          </TabsList>

          {/* Absensi Siswa */}
          <TabsContent value="siswa" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Absensi Siswa - 7 Januari 2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Total Siswa</TableHead>
                      <TableHead className="text-center text-green-600">Hadir</TableHead>
                      <TableHead className="text-center text-blue-600">Izin</TableHead>
                      <TableHead className="text-center text-orange-600">Sakit</TableHead>
                      <TableHead className="text-center text-red-600">Alpha</TableHead>
                      <TableHead className="text-center">Persentase</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Kelas B1</TableCell>
                      <TableCell>20</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">18</TableCell>
                      <TableCell className="text-center text-blue-600">1</TableCell>
                      <TableCell className="text-center text-orange-600">1</TableCell>
                      <TableCell className="text-center text-red-600">0</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-600">90%</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">Lengkap</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Kelas B2</TableCell>
                      <TableCell>19</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">19</TableCell>
                      <TableCell className="text-center text-blue-600">0</TableCell>
                      <TableCell className="text-center text-orange-600">0</TableCell>
                      <TableCell className="text-center text-red-600">0</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-600">100%</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">Lengkap</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Kelas A1</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">17</TableCell>
                      <TableCell className="text-center text-blue-600">1</TableCell>
                      <TableCell className="text-center text-orange-600">0</TableCell>
                      <TableCell className="text-center text-red-600">0</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-600">94%</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">Lengkap</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Kelas A2</TableCell>
                      <TableCell>19</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">18</TableCell>
                      <TableCell className="text-center text-blue-600">0</TableCell>
                      <TableCell className="text-center text-orange-600">1</TableCell>
                      <TableCell className="text-center text-red-600">0</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-600">95%</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm text-yellow-600">Perlu Dicek</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Absensi Guru */}
          <TabsContent value="guru" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Absensi Guru - 7 Januari 2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Guru</TableHead>
                      <TableHead>Kelas Ampu</TableHead>
                      <TableHead>Jam Masuk</TableHead>
                      <TableHead>Jam Pulang</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Keterangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Ibu Sari, S.Pd</TableCell>
                      <TableCell>B1, B2</TableCell>
                      <TableCell>07:00</TableCell>
                      <TableCell>14:00</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Hadir</span>
                        </div>
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ibu Ani, S.Pd</TableCell>
                      <TableCell>A1, A2</TableCell>
                      <TableCell>07:00</TableCell>
                      <TableCell>14:00</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Hadir</span>
                        </div>
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bapak Budi, S.Pd</TableCell>
                      <TableCell>B1, A1</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-600">Izin</span>
                        </div>
                      </TableCell>
                      <TableCell>Izin keluarga</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ibu Dewi, S.Pd</TableCell>
                      <TableCell>B2, A2</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <span className="text-orange-600">Sakit</span>
                        </div>
                      </TableCell>
                      <TableCell>Demam</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rekap Absensi Bulanan */}
          <TabsContent value="rekap" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5" />
                    Rekap Absensi Bulanan - Januari 2025
                  </CardTitle>
                  <Select defaultValue="januari">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="januari">Januari</SelectItem>
                      <SelectItem value="desember">Desember</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Rekap Siswa */}
                  <div>
                    <h3 className="font-semibold mb-3">Rekap Absensi Siswa per Kelas</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kelas</TableHead>
                          <TableHead className="text-center">Hadir</TableHead>
                          <TableHead className="text-center">Izin</TableHead>
                          <TableHead className="text-center">Sakit</TableHead>
                          <TableHead className="text-center">Alpha</TableHead>
                          <TableHead className="text-center">Persentase</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Kelas B1</TableCell>
                          <TableCell className="text-center text-green-600 font-medium">360</TableCell>
                          <TableCell className="text-center text-blue-600">15</TableCell>
                          <TableCell className="text-center text-orange-600">10</TableCell>
                          <TableCell className="text-center text-red-600">5</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-600">93.5%</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Kelas B2</TableCell>
                          <TableCell className="text-center text-green-600 font-medium">380</TableCell>
                          <TableCell className="text-center text-blue-600">10</TableCell>
                          <TableCell className="text-center text-orange-600">5</TableCell>
                          <TableCell className="text-center text-red-600">0</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-600">96.2%</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Kelas A1</TableCell>
                          <TableCell className="text-center text-green-600 font-medium">340</TableCell>
                          <TableCell className="text-center text-blue-600">12</TableCell>
                          <TableCell className="text-center text-orange-600">8</TableCell>
                          <TableCell className="text-center text-red-600">0</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-600">95.2%</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Kelas A2</TableCell>
                          <TableCell className="text-center text-green-600 font-medium">358</TableCell>
                          <TableCell className="text-center text-blue-600">10</TableCell>
                          <TableCell className="text-center text-orange-600">12</TableCell>
                          <TableCell className="text-center text-red-600">0</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-600">94.1%</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Rekap Guru */}
                  <div>
                    <h3 className="font-semibold mb-3">Rekap Absensi Guru</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Guru</TableHead>
                          <TableHead className="text-center">Hadir</TableHead>
                          <TableHead className="text-center">Izin</TableHead>
                          <TableHead className="text-center">Sakit</TableHead>
                          <TableHead className="text-center">Alpha</TableHead>
                          <TableHead className="text-center">Persentase</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Ibu Sari, S.Pd</TableCell>
                          <TableCell className="text-center text-green-600 font-medium">20</TableCell>
                          <TableCell className="text-center text-blue-600">1</TableCell>
                          <TableCell className="text-center text-orange-600">0</TableCell>
                          <TableCell className="text-center text-red-600">0</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-600">95.2%</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Ibu Ani, S.Pd</TableCell>
                          <TableCell className="text-center text-green-600 font-medium">21</TableCell>
                          <TableCell className="text-center text-blue-600">0</TableCell>
                          <TableCell className="text-center text-orange-600">0</TableCell>
                          <TableCell className="text-center text-red-600">0</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-600">100%</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Bapak Budi, S.Pd</TableCell>
                          <TableCell className="text-center text-green-600 font-medium">19</TableCell>
                          <TableCell className="text-center text-blue-600">1</TableCell>
                          <TableCell className="text-center text-orange-600">1</TableCell>
                          <TableCell className="text-center text-red-600">0</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-yellow-600">90.5%</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

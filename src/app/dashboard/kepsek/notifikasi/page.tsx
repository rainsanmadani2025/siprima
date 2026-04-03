"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, CheckCircle2, Clock, X, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function KepsekNotifikasiPage() {
  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifikasi Sistem</h1>
            <p className="text-muted-foreground mt-2">
              Pemberitahuan dan alert dari sistem
            </p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="semua">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua</SelectItem>
                <SelectItem value="unread">Belum Dibaca</SelectItem>
                <SelectItem value="read">Sudah Dibaca</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Tandai Semua Dibaca</Button>
          </div>
        </div>

        {/* Statistik Notifikasi */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notifikasi</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Dibaca</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">8</div>
              <p className="text-xs text-muted-foreground mt-1">Perlu diperhatikan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alert Penting</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-xs text-muted-foreground mt-1">Memerlukan tindakan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sudah Dibaca</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">16</div>
              <p className="text-xs text-muted-foreground mt-1">Sudah ditindaklanjuti</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Daftar Notifikasi
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select defaultValue="semua">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Tipe</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Notifikasi 1 - Alert Belum Dibaca */}
              <div className="flex gap-3 p-4 rounded-lg border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
                <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">Ibu Dewi belum mengisi RPPH hari ini</h4>
                    <Badge variant="destructive">Alert</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Kelas B2 • 2 jam yang lalu
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Hubungi Guru</Button>
                    <Button size="sm" variant="ghost">Tandai Dibaca</Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Notifikasi 2 - Warning Belum Dibaca */}
              <div className="flex gap-3 p-4 rounded-lg border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
                <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center text-white flex-shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">Penilaian mingguan belum lengkap</h4>
                    <Badge className="bg-orange-600">Warning</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    3 kelas (B2, A1, A2) • 5 jam yang lalu
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Lihat Detail</Button>
                    <Button size="sm" variant="ghost">Tandai Dibaca</Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Notifikasi 3 - Info Belum Dibaca */}
              <div className="flex gap-3 p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">Absensi kelas A2 belum lengkap</h4>
                    <Badge variant="secondary">Info</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    5 siswa belum tercatat • Hari ini, 09:30
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Cek Absensi</Button>
                    <Button size="sm" variant="ghost">Tandai Dibaca</Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Notifikasi 4 - Alert Belum Dibaca */}
              <div className="flex gap-3 p-4 rounded-lg border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
                <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">Bapak Budi belum mengisi penilaian 3 siswa</h4>
                    <Badge variant="destructive">Alert</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Kelas B1 • 6 jam yang lalu
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Hubungi Guru</Button>
                    <Button size="sm" variant="ghost">Tandai Dibaca</Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Notifikasi 5 - Sudah Dibaca */}
              <div className="flex gap-3 p-4 rounded-lg border opacity-70">
                <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm line-through">Ibu Ani sudah menyelesaikan RPPH</h4>
                    <Badge className="bg-green-600">Selesai</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Kelas A1 • Kemarin, 16:00
                  </p>
                  <p className="text-sm text-muted-foreground">Sudah ditindaklanjuti</p>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Notifikasi 6 - Sudah Dibaca */}
              <div className="flex gap-3 p-4 rounded-lg border opacity-70">
                <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm line-through">Laporan bulanan Ibu Sari sudah disetujui</h4>
                    <Badge className="bg-green-600">Selesai</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    2 hari yang lalu
                  </p>
                  <p className="text-sm text-muted-foreground">Sudah ditindaklanjuti</p>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Notifikasi 7 - Info Belum Dibaca */}
              <div className="flex gap-3 p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">Rapat guru wali murid besok</h4>
                    <Badge variant="secondary">Info</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sabtu, 25 Januari 2025 • Pukul 09:00 WIB
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Lihat Detail</Button>
                    <Button size="sm" variant="ghost">Tandai Dibaca</Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Notifikasi 8 - Alert Belum Dibaca */}
              <div className="flex gap-3 p-4 rounded-lg border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
                <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">Dokumentasi kegiatan kelas B2 belum ada</h4>
                    <Badge variant="destructive">Alert</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sudah 3 hari tanpa dokumentasi • 1 hari yang lalu
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Hubungi Guru</Button>
                    <Button size="sm" variant="ghost">Tandai Dibaca</Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

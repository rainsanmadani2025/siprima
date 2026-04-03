"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, MapPin, Calendar, Award, Users, GraduationCap, Save } from "lucide-react"

export default function KepsekSekolahPage() {
  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Sekolah</h1>
            <p className="text-muted-foreground mt-2">
              Kelola informasi dan data sekolah
            </p>
          </div>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Simpan Perubahan
          </Button>
        </div>

        {/* Data Sekolah */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informasi Sekolah
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama RA</Label>
                <div className="flex">
                  <Building2 className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="nama"
                    defaultValue="RA Insan Madani"
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="npsn">NPSN</Label>
                <div className="flex">
                  <Building2 className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="npsn"
                    defaultValue="12345678"
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="alamat">Alamat Sekolah</Label>
                <div className="flex">
                  <MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="alamat"
                    defaultValue="Jl. Pendidikan No. 123, Kota Bandung, Jawa Barat"
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tahun">Tahun Berdiri</Label>
                <div className="flex">
                  <Calendar className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="tahun"
                    defaultValue="2015"
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="akreditasi">Akreditasi</Label>
                <div className="flex">
                  <Award className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="akreditasi"
                    defaultValue="A"
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jumlah-kelas">Jumlah Kelas</Label>
                <div className="flex">
                  <Users className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="jumlah-kelas"
                    defaultValue="8"
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jumlah-guru">Jumlah Guru</Label>
                <div className="flex">
                  <GraduationCap className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="jumlah-guru"
                    defaultValue="24"
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jumlah-siswa">Jumlah Siswa</Label>
                <div className="flex">
                  <Users className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="jumlah-siswa"
                    defaultValue="156"
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistik Tambahan */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="card-gradient-1 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kapasitas Kelas</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">20 siswa</div>
              <p className="text-xs opacity-80 mt-1">Per kelas</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-2 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rasio Guru:Siswa</CardTitle>
              <GraduationCap className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1:6.5</div>
              <p className="text-xs opacity-80 mt-1">Ideal PAUD</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-3 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usia Sekolah</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10 Tahun</div>
              <p className="text-xs opacity-80 mt-1">Sejak 2015</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-4 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Akreditasi</CardTitle>
              <Award className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">A (Unggul)</div>
              <p className="text-xs opacity-80 mt-1">Terakreditasi 2023</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

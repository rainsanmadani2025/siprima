"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, GraduationCap, Camera, Save, MapPin } from "lucide-react"

export default function GuruProfilPage() {
  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Guru</h1>
          <p className="text-muted-foreground mt-2">
            Kelola data profil Anda
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Foto Profil */}
          <Card>
            <CardHeader>
              <CardTitle>Foto Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <User className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Foto belum ada</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Ganti Foto
              </Button>
            </CardContent>
          </Card>

          {/* Data Pribadi */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Data Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Guru</Label>
                  <div className="flex">
                    <User className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="nama"
                      defaultValue="Ibu Sari, S.Pd"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nuptk">NUPTK</Label>
                  <div className="flex">
                    <GraduationCap className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="nuptk"
                      defaultValue="1234567890123456"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pendidikan">Pendidikan Terakhir</Label>
                  <div className="flex">
                    <GraduationCap className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="pendidikan"
                      defaultValue="S1 Pendidikan Anak Usia Dini"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex">
                    <Mail className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue="sari@ra-insanmadani.sch.id"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="telepon">Nomor Telepon / WA</Label>
                  <div className="flex">
                    <Phone className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="telepon"
                      defaultValue="081234567890"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <div className="flex">
                    <MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="alamat"
                      defaultValue="Jl. Pendidikan No. 123, Jakarta Selatan"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

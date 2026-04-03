"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Camera, Save, MapPin, Calendar, Shield } from "lucide-react"

export default function AdminProfilPage() {
  return (
    <DashboardLayout role="admin" userName="Administrator">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profil Administrator</h1>
            <p className="text-muted-foreground mt-2">
              Kelola data profil Anda sebagai Administrator
            </p>
          </div>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Simpan Perubahan
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Foto Profil */}
          <Card>
            <CardHeader>
              <CardTitle>Foto Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed">
                <div className="text-center">
                  <Shield className="h-16 w-16 mx-auto text-muted-foreground" />
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
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <div className="flex">
                    <User className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="nama"
                      defaultValue="Administrator"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex">
                    <Shield className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="username"
                      defaultValue="admin"
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
                      defaultValue="admin@ra-insanmadani.sch.id"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telepon">Nomor HP / WA</Label>
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
                      defaultValue="Jl. Pendidikan No. 1, Bandung, Jawa Barat"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2 border-t pt-4 mt-4">
                  <Label className="text-base font-semibold">Ubah Password</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password-baru">Password Baru</Label>
                      <Input
                        id="password-baru"
                        type="password"
                        placeholder="Masukkan password baru"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="konfirmasi-password">Konfirmasi Password</Label>
                      <Input
                        id="konfirmasi-password"
                        type="password"
                        placeholder="Ulangi password baru"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

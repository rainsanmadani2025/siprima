"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Camera, Save, MapPin, Shield, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminData {
  id: string
  name: string
  username: string
  email: string
  phone: string
  avatar: string | null
}

export default function AdminProfilPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<AdminData>({
    id: '',
    name: '',
    username: '',
    email: '',
    phone: '',
    avatar: null,
  })

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem('userId')
      const url = userId ? `/api/admin/profil?userId=${userId}` : '/api/admin/profil'
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setFormData(data.data)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Gagal memuat profil"
        })
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat profil"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nama tidak boleh kosong"
      })
      return
    }

    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password baru dan konfirmasi tidak cocok"
      })
      return
    }

    if (passwords.newPassword && passwords.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password minimal 6 karakter"
      })
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/admin/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: passwords.newPassword || '',
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update localStorage name
        localStorage.setItem('userName', formData.name)
        setPasswords({ newPassword: '', confirmPassword: '' })
        toast({
          title: "Berhasil",
          description: "Profil berhasil diperbarui"
        })
      } else {
        throw new Error(data.error || 'Gagal menyimpan')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan profil"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="admin" userName="Administrator">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

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
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
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
                {formData.avatar ? (
                  <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Shield className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">Foto belum ada</p>
                  </div>
                )}
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
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      value={formData.username}
                      disabled
                      className="rounded-l-none bg-muted"
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="konfirmasi-password">Konfirmasi Password</Label>
                      <Input
                        id="konfirmasi-password"
                        type="password"
                        placeholder="Ulangi password baru"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
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
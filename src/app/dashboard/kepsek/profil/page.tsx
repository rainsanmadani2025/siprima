"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Mail, Phone, GraduationCap, Camera, Save, MapPin, Calendar, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface KepsekProfile {
  id: string
  name: string
  username: string
  email?: string
  phone?: string
  nuptk?: string
  birthPlace?: string
  birthDate?: string
  gender?: string
  lastEducation?: string
  address?: string
  avatar?: string
  isActive: boolean
  createdAt: string
}

export default function KepsekProfilPage() {
  const [profile, setProfile] = useState<KepsekProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [isPhotoChanged, setIsPhotoChanged] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nuptk: "",
    birthPlace: "",
    birthDate: "",
    gender: "Laki-laki",
    lastEducation: "",
    address: "",
    password: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/kepsek/profil')
      const data = await response.json()

      if (data.success) {
        setProfile(data.data)
        setPhotoPreview(data.data.avatar || "")

        setFormData({
          name: data.data.name || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          nuptk: data.data.nuptk || "",
          birthPlace: data.data.birthPlace || "",
          birthDate: data.data.birthDate || "",
          gender: data.data.gender || "Laki-laki",
          lastEducation: data.data.lastEducation || "",
          address: data.data.address || "",
          password: "",
        })
      } else {
        throw new Error(data.error || 'Gagal memuat profil')
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal memuat profil"
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
        setIsPhotoChanged(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    try {
      setSaving(true)

      const submitData: any = {
        ...formData,
      }

      // Only include avatar if changed
      if (isPhotoChanged && photoPreview) {
        submitData.avatar = photoPreview
      }

      // Only include password if filled
      if (formData.password && formData.password.trim() !== '') {
        submitData.password = formData.password
      } else {
        delete submitData.password
      }

      const response = await fetch('/api/kepsek/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Profil berhasil diperbarui"
        })
        setProfile(data.data)
        setIsPhotoChanged(false)
        setFormData(prev => ({ ...prev, password: "" }))
      } else {
        throw new Error(data.error || 'Gagal menyimpan profil')
      }
    } catch (error: any) {
      console.error('Error saving profile:', error)
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
      <DashboardLayout role="kepsek" userName="Kepala Sekolah">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profil Kepala Sekolah</h1>
            <p className="text-muted-foreground mt-2">
              Kelola data profil Anda sebagai Kepala Sekolah
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Foto profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <User className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">Foto belum ada</p>
                  </div>
                )}
              </div>
              <div>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('photo')?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Ganti Foto
                </Button>
              </div>
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
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <div className="flex">
                    <User className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="nama"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nuptk">NUPTK</Label>
                  <div className="flex">
                    <GraduationCap className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="nuptk"
                      value={formData.nuptk}
                      onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                      className="rounded-l-none"
                      placeholder="Nomor NUPTK"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempat-lahir">Tempat Lahir</Label>
                  <div className="flex">
                    <MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="tempat-lahir"
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal-lahir">Tanggal Lahir</Label>
                  <div className="flex">
                    <Calendar className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="tanggal-lahir"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenis-kelamin">Jenis Kelamin</Label>
                  <div className="flex">
                    <User className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className="rounded-l-none flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pendidikan">Pendidikan Terakhir</Label>
                  <div className="flex">
                    <GraduationCap className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="pendidikan"
                      value={formData.lastEducation}
                      onChange={(e) => setFormData({ ...formData, lastEducation: e.target.value })}
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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password">Password Baru (opsional)</Label>
                  <div className="flex">
                    <User className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="rounded-l-none"
                      placeholder="Isi untuk mengubah password"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Kosongkan jika tidak ingin mengubah password
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <div className="flex">
                    <MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="alamat"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="rounded-l-none"
                    />
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

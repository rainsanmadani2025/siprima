"use client"

import { useEffect, useState, useRef } from 'react'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, GraduationCap, Camera, Save, MapPin, Loader2, X, Calendar } from "lucide-react"
import { useToast } from '@/hooks/use-toast'

interface TeacherProfile {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  nuptk: string | null
  birthPlace: string | null
  birthDate: string | null
  lastEducation: string | null
  address: string | null
  avatar?: string | null
}

export default function GuruProfilPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [profile, setProfile] = useState<TeacherProfile>({
    id: '',
    userId: '',
    name: '',
    email: '',
    phone: '',
    nuptk: '',
    birthPlace: '',
    birthDate: '',
    lastEducation: '',
    address: '',
    avatar: null
  })

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        toast({
          title: "Error",
          description: "User ID tidak ditemukan",
          variant: "destructive"
        })
        return
      }

      const response = await fetch(`/api/guru/profile?userId=${userId}`)
      const data = await response.json()

      if (data.success && data.teacher) {
        setProfile({
          id: data.teacher.id,
          userId: data.teacher.userId,
          name: data.teacher.name || '',
          email: data.teacher.email || '',
          phone: data.teacher.phone || '',
          nuptk: data.teacher.nuptk || '',
          birthPlace: data.teacher.birthPlace || '',
          birthDate: data.teacher.birthDate || '',
          lastEducation: data.teacher.lastEducation || '',
          address: data.teacher.address || '',
          avatar: data.teacher.avatar || null
        })
        setPreviewUrl(data.teacher.avatar || null)
      } else {
        throw new Error(data.error || 'Gagal mengambil data profil')
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal mengambil data profil",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Tipe file tidak didukung. Hanya gambar (JPEG, PNG, GIF, WebP) yang diizinkan",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "Ukuran file terlalu besar. Maksimal 2MB",
        variant: "destructive"
      })
      return
    }

    // Show preview
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)

    // Upload file
    await handleUploadPhoto(file)
  }

  const handleUploadPhoto = async (file: File) => {
    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', profile.userId)

      const response = await fetch('/api/guru/profile/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Foto berhasil diupload"
        })
        setProfile({ ...profile, avatar: data.avatarUrl })
        // Dispatch custom event to update header avatar
        window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: { avatar: data.avatarUrl } }))
      } else {
        throw new Error(data.error || 'Gagal mengupload foto')
      }
    } catch (error: any) {
      console.error('Error uploading photo:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal mengupload foto",
        variant: "destructive"
      })
      // Revert preview on error
      setPreviewUrl(profile.avatar || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePhoto = () => {
    setPreviewUrl(null)
    setProfile({ ...profile, avatar: null })
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      const response = await fetch('/api/guru/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.userId,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          nuptk: profile.nuptk,
          birthPlace: profile.birthPlace,
          birthDate: profile.birthDate,
          lastEducation: profile.lastEducation,
          address: profile.address
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Profil berhasil diperbarui"
        })
        // Update local state with returned data
        setProfile(data.teacher)
      } else {
        throw new Error(data.error || 'Gagal memperbarui profil')
      }
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui profil",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="guru" userName={profile.name}>
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
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden relative">
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Foto Profil"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={handleRemovePhoto}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <User className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">Foto belum ada</p>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleFileSelect}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengupload...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    {previewUrl ? 'Ganti Foto' : 'Upload Foto'}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Maksimal 2MB. Format: JPEG, PNG, GIF, WebP
              </p>
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
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempat-lahir">Tempat Lahir</Label>
                  <div className="flex">
                    <MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="tempat-lahir"
                      value={profile.birthPlace}
                      onChange={(e) => setProfile({ ...profile, birthPlace: e.target.value })}
                      className="rounded-l-none"
                      placeholder="Kota kelahiran"
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
                      value={profile.birthDate}
                      onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
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
                      value={profile.nuptk}
                      onChange={(e) => setProfile({ ...profile, nuptk: e.target.value })}
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
                      value={profile.lastEducation}
                      onChange={(e) => setProfile({ ...profile, lastEducation: e.target.value })}
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
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
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
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

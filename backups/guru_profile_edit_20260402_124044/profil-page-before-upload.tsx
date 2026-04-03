"use client"

import { useEffect, useState } from 'react'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, GraduationCap, Camera, Save, MapPin, Loader2 } from "lucide-react"
import { useToast } from '@/hooks/use-toast'

interface TeacherProfile {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  nuptk: string | null
  lastEducation: string | null
  address: string | null
}

export default function GuruProfilPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<TeacherProfile>({
    id: '',
    userId: '',
    name: '',
    email: '',
    phone: '',
    nuptk: '',
    lastEducation: '',
    address: ''
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
          lastEducation: data.teacher.lastEducation || '',
          address: data.teacher.address || ''
        })
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
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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

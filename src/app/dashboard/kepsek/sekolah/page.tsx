"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, MapPin, Calendar, Award, Users, GraduationCap, Save, Loader2, Phone, Mail, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SchoolData {
  id: string
  name: string
  npsn: string
  address: string
  establishedYear: number
  accreditation: string
  totalClasses: number
  totalTeachers: number
  totalStudents: number
  phone: string | null
  email: string | null
  website: string | null
}

export default function KepsekSekolahPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [school, setSchool] = useState<SchoolData>({
    id: '',
    name: '',
    npsn: '',
    address: '',
    establishedYear: 2015,
    accreditation: '',
    totalClasses: 0,
    totalTeachers: 0,
    totalStudents: 0,
    phone: '',
    email: '',
    website: ''
  })

  // Fetch school data
  useEffect(() => {
    fetchSchoolData()
  }, [])

  const fetchSchoolData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/school/profile')
      const data = await response.json()
      if (data.success && data.school) {
        setSchool(data.school)
      }
    } catch (error) {
      console.error('Error fetching school data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setSchool(prev => ({ ...prev, [id]: value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/school/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(school)
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Data sekolah berhasil diperbarui"
        })
        setSchool(data.school)
      } else {
        throw new Error(data.error || 'Gagal menyimpan data')
      }
    } catch (error: any) {
      console.error('Error saving school data:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan data sekolah",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="kepsek" userName="Kepala Sekolah">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Sekolah</h1>
            <p className="text-muted-foreground mt-2">
              Kelola informasi dan data sekolah
            </p>
          </div>
        </div>

        {/* Statistik Tambahan */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="card-gradient-1 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kapasitas Kelas</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {school.totalClasses > 0 ? `${Math.round(school.totalStudents / school.totalClasses)} siswa` : '-'}
              </div>
              <p className="text-xs opacity-80 mt-1">Per kelas</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-2 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rasio Guru:Siswa</CardTitle>
              <GraduationCap className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {school.totalTeachers > 0 ? `1:${(school.totalStudents / school.totalTeachers).toFixed(1)}` : '-'}
              </div>
              <p className="text-xs opacity-80 mt-1">Ideal PAUD</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-3 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usia Sekolah</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date().getFullYear() - school.establishedYear} Tahun
              </div>
              <p className="text-xs opacity-80 mt-1">Sejak {school.establishedYear}</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-4 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Akreditasi</CardTitle>
              <Award className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {school.accreditation || '-'}
              </div>
              <p className="text-xs opacity-80 mt-1">{school.accreditation ? 'Terakreditasi' : 'Belum terakreditasi'}</p>
            </CardContent>
          </Card>
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
                <Label htmlFor="name">Nama RA</Label>
                <div className="flex">
                  <Building2 className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="name"
                    value={school.name}
                    onChange={handleChange}
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
                    value={school.npsn}
                    onChange={handleChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat Sekolah</Label>
                <div className="flex">
                  <MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="address"
                    value={school.address}
                    onChange={handleChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="establishedYear">Tahun Berdiri</Label>
                <div className="flex">
                  <Calendar className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="establishedYear"
                    type="number"
                    value={school.establishedYear}
                    onChange={handleChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accreditation">Akreditasi</Label>
                <div className="flex">
                  <Award className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="accreditation"
                    value={school.accreditation}
                    onChange={handleChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalClasses">Jumlah Kelas</Label>
                <div className="flex">
                  <Users className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="totalClasses"
                    type="number"
                    value={school.totalClasses}
                    onChange={handleChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalTeachers">Jumlah Guru</Label>
                <div className="flex">
                  <GraduationCap className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="totalTeachers"
                    type="number"
                    value={school.totalTeachers}
                    onChange={handleChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalStudents">Jumlah Siswa</Label>
                <div className="flex">
                  <Users className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="totalStudents"
                    type="number"
                    value={school.totalStudents}
                    onChange={handleChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <div className="flex">
                  <Phone className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="phone"
                    value={school.phone || ''}
                    onChange={handleChange}
                    className="rounded-l-none"
                    placeholder="Opsional"
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
                    value={school.email || ''}
                    onChange={handleChange}
                    className="rounded-l-none"
                    placeholder="Opsional"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex">
                  <Globe className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="website"
                    value={school.website || ''}
                    onChange={handleChange}
                    className="rounded-l-none"
                    placeholder="Opsional"
                  />
                </div>
              </div>
            </div>
          </CardContent>
	  <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  )
}
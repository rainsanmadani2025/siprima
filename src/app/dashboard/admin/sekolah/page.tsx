"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, MapPin, Calendar, Award, Users, GraduationCap, Save, Loader2 } from "lucide-react"
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
  phone?: string
  email?: string
  website?: string
}

export default function AdminSekolahPage() {
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    npsn: "",
    address: "",
    establishedYear: 0,
    accreditation: "",
    totalClasses: 0,
    totalTeachers: 0,
    totalStudents: 0,
    phone: "",
    email: "",
    website: ""
  })

  useEffect(() => {
    fetchSchoolData()
  }, [])

  const fetchSchoolData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/school')
      const data = await response.json()

      if (data.success && data.school) {
        setSchoolData(data.school)
        setFormData({
          name: data.school.name,
          npsn: data.school.npsn,
          address: data.school.address,
          establishedYear: data.school.establishedYear,
          accreditation: data.school.accreditation,
          totalClasses: data.school.totalClasses,
          totalTeachers: data.school.totalTeachers,
          totalStudents: data.school.totalStudents,
          phone: data.school.phone || "",
          email: data.school.email || "",
          website: data.school.website || ""
        })
      }
    } catch (error) {
      console.error('Error fetching school data:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data sekolah"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/school', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Data sekolah berhasil diperbarui"
        })
        fetchSchoolData()
      } else {
        throw new Error(data.error || 'Gagal menyimpan data')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan data sekolah"
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
            <h1 className="text-3xl font-bold tracking-tight">Pengaturan Data Sekolah</h1>
            <p className="text-muted-foreground mt-2">
              Kelola informasi dan data sekolah
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.npsn}
                    onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
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
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) })}
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
                    value={formData.accreditation}
                    onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
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
                    type="number"
                    value={formData.totalClasses}
                    onChange={(e) => setFormData({ ...formData, totalClasses: parseInt(e.target.value) })}
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
                    type="number"
                    value={formData.totalTeachers}
                    onChange={(e) => setFormData({ ...formData, totalTeachers: parseInt(e.target.value) })}
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
                    type="number"
                    value={formData.totalStudents}
                    onChange={(e) => setFormData({ ...formData, totalStudents: parseInt(e.target.value) })}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telepon">No. Telepon</Label>
                <div className="flex">
                  <Building2 className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="telepon"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex">
                  <Building2 className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
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
                <Label htmlFor="website">Website</Label>
                <div className="flex">
                  <Building2 className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

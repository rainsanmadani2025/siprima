'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, MapPin, Baby, Calendar, Edit, Save, ArrowLeft, Camera, Loader2 } from 'lucide-react'

interface Student {
  id: string
  name: string
  nis: string
  birthDate: string
  gender: string
  class?: {
    id: string
    name: string
  } | null
  photo?: string | null
}

interface ParentData {
  id: string
  address?: string
  occupation?: string
  fatherName?: string
  fatherOccupation?: string
  fatherPhone?: string
  fatherEmail?: string
  motherName?: string
  motherOccupation?: string
  motherPhone?: string
  motherEmail?: string
}

interface UserData {
  name: string
  email?: string
  phone?: string
}

export default function OrtuProfilPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [parentData, setParentData] = useState<ParentData | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    address: '',
    occupation: '',
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    fatherEmail: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    motherEmail: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Get current user's student(s)
      const studentsResponse = await fetch('/api/students')
      const studentsData = await studentsResponse.json()
      
      if (studentsData.students && studentsData.students.length > 0) {
        setStudents(studentsData.students)

        // Get parent data from the first student
        const parentResponse = await fetch(`/api/parents/${studentsData.students[0].parentId}`)
        const parentData = await parentResponse.json()
        
        if (parentData.parent) {
          setParentData(parentData.parent)
          setFormData({
            address: parentData.parent.address || '',
            occupation: parentData.parent.occupation || '',
            fatherName: parentData.parent.fatherName || '',
            fatherOccupation: parentData.parent.fatherOccupation || '',
            fatherPhone: parentData.parent.fatherPhone || '',
            fatherEmail: parentData.parent.fatherEmail || '',
            motherName: parentData.parent.motherName || '',
            motherOccupation: parentData.parent.motherOccupation || '',
            motherPhone: parentData.parent.motherPhone || '',
            motherEmail: parentData.parent.motherEmail || '',
          })
        }

        // Get user data
        if (parentData.parent?.userId) {
          const userResponse = await fetch(`/api/users/${parentData.parent.userId}`)
          const userData = await userResponse.json()
          if (userData.user) {
            setUserData({
              name: userData.user.name,
              email: userData.user.email,
              phone: userData.user.phone,
            })
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form to original data
    if (parentData) {
      setFormData({
        address: parentData.address || '',
        occupation: parentData.occupation || '',
        fatherName: parentData.fatherName || '',
        fatherOccupation: parentData.fatherOccupation || '',
        fatherPhone: parentData.fatherPhone || '',
        fatherEmail: parentData.fatherEmail || '',
        motherName: parentData.motherName || '',
        motherOccupation: parentData.motherOccupation || '',
        motherPhone: parentData.motherPhone || '',
        motherEmail: parentData.motherEmail || '',
      })
    }
  }

  const handleSave = async () => {
    if (!parentData) return

    setSaving(true)
    try {
      const response = await fetch(`/api/parents/${parentData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setParentData(data.parent)
        setIsEditing(false)
        // Show success message (you could add a toast here)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return `${age} Tahun`
  }

  if (loading) {
    return (
      <DashboardLayout role="ortu" userName="Orang Tua">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="ortu" userName={userData?.name || "Orang Tua"}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/ortu')}
            className="gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Profil Orang Tua</h1>
          <p className="text-gray-600 mt-2">
            Kelola informasi profil Anda dan data anak
          </p>
        </div>

        {/* Informasi Akun */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Informasi Akun
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nama Lengkap</Label>
                <Input 
                  value={userData?.name || ''} 
                  disabled 
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  value={userData?.email || ''} 
                  disabled 
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Nomor Telepon</Label>
                <Input 
                  value={userData?.phone || ''} 
                  disabled 
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Ayah & Ibu */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                Data Orang Tua
              </CardTitle>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEdit}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancel}
                  >
                    Batal
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Ayah */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-blue-700">Data Ayah</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Nama Ayah</Label>
                  <Input
                    value={isEditing ? formData.fatherName : (parentData?.fatherName || '-')}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Pekerjaan</Label>
                  <Input
                    value={isEditing ? formData.fatherOccupation : (parentData?.fatherOccupation || '-')}
                    onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nomor Telepon</Label>
                  <Input
                    value={isEditing ? formData.fatherPhone : (parentData?.fatherPhone || '-')}
                    onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={isEditing ? formData.fatherEmail : (parentData?.fatherEmail || '-')}
                    onChange={(e) => setFormData({ ...formData, fatherEmail: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              {/* Data Ibu */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-pink-700">Data Ibu</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Nama Ibu</Label>
                    <Input
                      value={isEditing ? formData.motherName : (parentData?.motherName || '-')}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Pekerjaan</Label>
                    <Input
                      value={isEditing ? formData.motherOccupation : (parentData?.motherOccupation || '-')}
                      onChange={(e) => setFormData({ ...formData, motherOccupation: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Nomor Telepon</Label>
                    <Input
                      value={isEditing ? formData.motherPhone : (parentData?.motherPhone || '-')}
                      onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={isEditing ? formData.motherEmail : (parentData?.motherEmail || '-')}
                      onChange={(e) => setFormData({ ...formData, motherEmail: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div>
                <Label>Alamat Lengkap</Label>
                <Input
                  value={isEditing ? formData.address : (parentData?.address || '-')}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Pekerjaan Orang Tua</Label>
                <Input
                  value={isEditing ? formData.occupation : (parentData?.occupation || '-')}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Anak */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-6 w-6" />
              Data Anak
            </CardTitle>
          </CardHeader>
          <CardContent>
            {students.length > 0 ? (
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                        {student.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{student.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          {calculateAge(student.birthDate)}
                        </Badge>
                        <Badge variant="outline">
                          NIS: {student.nis}
                        </Badge>
                        {student.class && (
                          <Badge variant="secondary">
                            Kelas {student.class.name}
                          </Badge>
                        )}
                        <Badge variant={student.gender === 'L' ? 'default' : 'outline'}>
                          {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/dashboard/ortu')}
                      className="mt-2"
                    >
                      Lihat Detail
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Belum ada data anak
              </p>
            )}
          </CardContent>
        </Card>

        {/* Informasi Penting */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Informasi Penting</p>
                <p className="text-amber-800 text-sm mt-1">
                  • Jika ada perubahan data kontak, harap segera update profil Anda
                </p>
                <p className="text-amber-800 text-sm mt-1">
                  • Data ini digunakan untuk komunikasi antara sekolah dan orang tua
                </p>
                <p className="text-amber-800 text-sm mt-1">
                  • Pastikan nomor telepon aktif untuk menerima notifikasi penting
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

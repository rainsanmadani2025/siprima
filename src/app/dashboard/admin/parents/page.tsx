"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  User,
  Phone,
  MapPin,
  Mail,
  Edit,
  Save,
  Loader2,
  Plus,
  Trash2,
  Search,
  Users,
  Camera,
  Baby,
  Calendar,
  UserPlus
} from "lucide-react"

interface ParentData {
  id: string
  userId: string
  name: string
  email?: string
  phone?: string
  avatar?: string
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
  children?: Array<{
    id: string
    name: string
    nis: string
    birthDate: string
    class?: {
      name: string
    }
  }>
  createdAt: string
}

export default function AdminParentsPage() {
  const [parentList, setParentList] = useState<ParentData[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedParent, setSelectedParent] = useState<ParentData | null>(null)
  const [editForm, setEditForm] = useState<ParentData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [isPhotoChanged, setIsPhotoChanged] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Add form state
  const [addForm, setAddForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    fatherEmail: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    motherEmail: '',
    address: '',
    occupation: ''
  })
  const [addPhotoPreview, setAddPhotoPreview] = useState<string>("")
  const [isAddPhotoChanged, setIsAddPhotoChanged] = useState(false)

  useEffect(() => {
    fetchParents()
  }, [])

  const fetchParents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/parents')
      const data = await response.json()

      if (data.success && data.parents) {
        const parentsWithDetails = await Promise.all(
          data.parents.map(async (p: any) => {
            const detailRes = await fetch(`/api/parents/${p.id}`)
            const detailData = await detailRes.json()
            if (detailData.success && detailData.parent) {
              return {
                ...detailData.parent,
                name: detailData.parent.user.name,
                email: detailData.parent.user.email,
                phone: detailData.parent.user.phone,
                avatar: detailData.parent.user.avatar
              }
            }
            return null
          })
        )

        setParentList(parentsWithDetails.filter((p): p is ParentData => p !== null))
      }
    } catch (error) {
      console.error('Error fetching parents:', error)
      toast.error("Gagal memuat data orang tua")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (parent: ParentData) => {
    setSelectedParent(parent)
    setEditForm({ ...parent })
    setPhotoPreview(parent.avatar || "")
    setIsPhotoChanged(false)
    setEditing(true)
  }

  const handleSave = async () => {
    if (!editForm) return

    setSaving(true)
    try {
      const submitData: any = {
        address: editForm.address,
        occupation: editForm.occupation,
        fatherName: editForm.fatherName,
        fatherOccupation: editForm.fatherOccupation,
        fatherPhone: editForm.fatherPhone,
        fatherEmail: editForm.fatherEmail,
        motherName: editForm.motherName,
        motherOccupation: editForm.motherOccupation,
        motherPhone: editForm.motherPhone,
        motherEmail: editForm.motherEmail,
      }

      if (isPhotoChanged) {
        submitData.avatar = photoPreview
      }

      const profileRes = await fetch('/api/parent/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      const profileData = await profileRes.json()

      if (profileData.success) {
        toast.success("Data orang tua berhasil diperbarui")
        setEditing(false)
        fetchParents()
      } else {
        toast.error("Gagal memperbarui data")
      }
    } catch (error) {
      console.error('Error saving parent:', error)
      toast.error("Gagal memperbarui data")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setSelectedParent(null)
    setEditForm(null)
    setPhotoPreview("")
    setIsPhotoChanged(false)
  }

  const handleDelete = async (parent: ParentData) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data orang tua "${parent.name}" beserta data akunnya?`)) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/users/${parent.userId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Data orang tua berhasil dihapus")
        fetchParents()
      } else {
        toast.error("Gagal menghapus data")
      }
    } catch (error) {
      console.error('Error deleting parent:', error)
      toast.error("Gagal menghapus data")
    } finally {
      setDeleting(false)
    }
  }

  const handleAddSubmit = async () => {
    if (!addForm.name || !addForm.username || !addForm.email || !addForm.password) {
      toast.error("Nama, Username, Email, dan Password wajib diisi")
      return
    }

    setSaving(true)
    try {
      const submitData: any = {
        username: addForm.username,
        password: addForm.password,
        name: addForm.name,
        email: addForm.email,
        phone: addForm.phone,
        fatherName: addForm.fatherName,
        fatherOccupation: addForm.fatherOccupation,
        fatherPhone: addForm.fatherPhone,
        fatherEmail: addForm.fatherEmail,
        motherName: addForm.motherName,
        motherOccupation: addForm.motherOccupation,
        motherPhone: addForm.motherPhone,
        motherEmail: addForm.motherEmail,
        address: addForm.address,
        occupation: addForm.occupation,
      }

      if (isAddPhotoChanged && addPhotoPreview) {
        submitData.avatar = addPhotoPreview
      }

      const response = await fetch('/api/admin/parents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Data orang tua berhasil ditambahkan")
        setShowAddDialog(false)
        setAddForm({
          username: '',
          password: '',
          name: '',
          email: '',
          phone: '',
          fatherName: '',
          fatherOccupation: '',
          fatherPhone: '',
          fatherEmail: '',
          motherName: '',
          motherOccupation: '',
          motherPhone: '',
          motherEmail: '',
          address: '',
          occupation: ''
        })
        setAddPhotoPreview("")
        setIsAddPhotoChanged(false)
        fetchParents()
      } else {
        toast.error(data.error || "Gagal menambahkan data")
      }
    } catch (error) {
      console.error('Error adding parent:', error)
      toast.error("Gagal menambahkan data")
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, isAdd: boolean = false) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isAdd) {
          setAddPhotoPreview(reader.result as string)
          setIsAddPhotoChanged(true)
        } else {
          setPhotoPreview(reader.result as string)
          setIsPhotoChanged(true)
        }
      }
      reader.readAsDataURL(file)
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

  const filteredParents = parentList.filter(parent =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.motherName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout role="admin" userName="Admin">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Orang Tua</h1>
            <p className="text-gray-600 mt-2">
              Kelola data profil orang tua siswa RA INSAN MADANI
            </p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Orang Tua
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Orang Tua</p>
                  <p className="text-3xl font-bold mt-2">{parentList.length}</p>
                </div>
                <Users className="w-12 h-12 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Anak</p>
                  <p className="text-3xl font-bold mt-2">
                    {parentList.reduce((acc, p) => acc + (p.children?.length || 0), 0)}
                  </p>
                </div>
                <Baby className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Rata-rata Anak</p>
                  <p className="text-3xl font-bold mt-2">
                    {parentList.length > 0
                      ? (parentList.reduce((acc, p) => acc + (p.children?.length || 0), 0) / parentList.length).toFixed(1)
                      : '0'}
                  </p>
                </div>
                <User className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan nama, email, atau nama ayah/ibu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Parent List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Orang Tua</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredParents.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredParents.map((parent) => (
                  <div
                    key={parent.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors space-y-4"
                  >
                    {/* Parent Header */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                          {photoPreview && selectedParent?.id === parent.id ? (
                            <img
                              src={photoPreview}
                              alt={parent.name}
                              className="w-full h-full object-cover"
                            />
                          ) : parent.avatar ? (
                            <img
                              src={parent.avatar}
                              alt={parent.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            parent.name.charAt(0)
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{parent.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {parent.email && (
                                <Badge variant="outline" className="gap-1">
                                  <Mail className="w-3 h-3" />
                                  {parent.email}
                                </Badge>
                              )}
                              {parent.phone && (
                                <Badge variant="outline" className="gap-1">
                                  <Phone className="w-3 h-3" />
                                  {parent.phone}
                                </Badge>
                              )}
                              {parent.occupation && (
                                <Badge variant="secondary">
                                  {parent.occupation}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(parent)}
                              className="gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(parent)}
                              disabled={deleting}
                              className="gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-700 active:scale-95 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Father Data */}
                    {parent.fatherName && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium text-blue-700 mb-2">Data Ayah</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Nama</p>
                            <p className="font-medium">{parent.fatherName || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pekerjaan</p>
                            <p className="font-medium">{parent.fatherOccupation || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Telepon</p>
                            <p className="font-medium">{parent.fatherPhone || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{parent.fatherEmail || '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mother Data */}
                    {parent.motherName && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium text-pink-700 mb-2">Data Ibu</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Nama</p>
                            <p className="font-medium">{parent.motherName || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pekerjaan</p>
                            <p className="font-medium">{parent.motherOccupation || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Telepon</p>
                            <p className="font-medium">{parent.motherPhone || '-'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{parent.motherEmail || '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Address */}
                    {parent.address && (
                      <div className="pt-3 border-t">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <p>{parent.address}</p>
                        </div>
                      </div>
                    )}

                    {/* Children */}
                    {parent.children && parent.children.length > 0 && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium text-emerald-700 mb-2">Anak ({parent.children.length})</p>
                        <div className="grid gap-2">
                          {parent.children.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                  {child.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{child.name}</p>
                                  <div className="flex gap-2 mt-0.5">
                                    <Badge variant="outline" className="text-xs">
                                      NIS: {child.nis}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {calculateAge(child.birthDate)}
                                    </Badge>
                                    {child.class && (
                                      <Badge variant="secondary" className="text-xs">
                                        {child.class.name}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">Belum ada data orang tua</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Klik tombol "Tambah Orang Tua" untuk menambahkan data baru
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Parent Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Orang Tua Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Photo Upload */}
            <div className="flex justify-center">
              <div className="space-y-2 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden mx-auto">
                  {addPhotoPreview ? (
                    <img
                      src={addPhotoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    addForm.name.charAt(0) || 'U'
                  )}
                </div>
                <Input
                  id="add-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(e, true)}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('add-photo')?.click()}
                  className="gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Upload Foto
                </Button>
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold">Informasi Akun</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Nama Lengkap *</Label>
                  <Input
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="Nama lengkap orang tua"
                  />
                </div>
                <div>
                  <Label>Username *</Label>
                  <Input
                    value={addForm.username}
                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                    placeholder="Username untuk login"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="email@contoh.com"
                  />
                </div>
                <div>
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    placeholder="Password minimal 6 karakter"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Nomor Telepon</Label>
                  <Input
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>
            </div>

            {/* Father Data */}
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold text-blue-700">Data Ayah</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Nama Ayah</Label>
                  <Input
                    value={addForm.fatherName}
                    onChange={(e) => setAddForm({ ...addForm, fatherName: e.target.value })}
                    placeholder="Nama ayah"
                  />
                </div>
                <div>
                  <Label>Pekerjaan Ayah</Label>
                  <Input
                    value={addForm.fatherOccupation}
                    onChange={(e) => setAddForm({ ...addForm, fatherOccupation: e.target.value })}
                    placeholder="Pekerjaan ayah"
                  />
                </div>
                <div>
                  <Label>Telepon Ayah</Label>
                  <Input
                    value={addForm.fatherPhone}
                    onChange={(e) => setAddForm({ ...addForm, fatherPhone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <Label>Email Ayah</Label>
                  <Input
                    type="email"
                    value={addForm.fatherEmail}
                    onChange={(e) => setAddForm({ ...addForm, fatherEmail: e.target.value })}
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>
            </div>

            {/* Mother Data */}
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold text-pink-700">Data Ibu</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Nama Ibu</Label>
                  <Input
                    value={addForm.motherName}
                    onChange={(e) => setAddForm({ ...addForm, motherName: e.target.value })}
                    placeholder="Nama ibu"
                  />
                </div>
                <div>
                  <Label>Pekerjaan Ibu</Label>
                  <Input
                    value={addForm.motherOccupation}
                    onChange={(e) => setAddForm({ ...addForm, motherOccupation: e.target.value })}
                    placeholder="Pekerjaan ibu"
                  />
                </div>
                <div>
                  <Label>Telepon Ibu</Label>
                  <Input
                    value={addForm.motherPhone}
                    onChange={(e) => setAddForm({ ...addForm, motherPhone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <Label>Email Ibu</Label>
                  <Input
                    type="email"
                    value={addForm.motherEmail}
                    onChange={(e) => setAddForm({ ...addForm, motherEmail: e.target.value })}
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>
            </div>

            {/* Address & Occupation */}
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold">Alamat & Pekerjaan</h3>
              <div>
                <Label>Alamat Lengkap</Label>
                <Input
                  value={addForm.address}
                  onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                  placeholder="Alamat lengkap rumah"
                />
              </div>
              <div>
                <Label>Pekerjaan Orang Tua</Label>
                <Input
                  value={addForm.occupation}
                  onChange={(e) => setAddForm({ ...addForm, occupation: e.target.value })}
                  placeholder="Pekerjaan orang tua"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleAddSubmit} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Parent Dialog */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Orang Tua</DialogTitle>
          </DialogHeader>
          {editForm && (
            <>
              <div className="space-y-4 py-4">
                {/* Photo Upload */}
                <div className="flex justify-center">
                  <div className="space-y-2 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden mx-auto">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        editForm.name.charAt(0) || 'U'
                      )}
                    </div>
                    <Input
                      id="edit-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, false)}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('edit-photo')?.click()}
                      className="gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      Ganti Foto
                    </Button>
                  </div>
                </div>

                {/* Father Data */}
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-semibold text-blue-700">Data Ayah</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Nama Ayah</Label>
                      <Input
                        value={editForm.fatherName || ''}
                        onChange={(e) => setEditForm({ ...editForm, fatherName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Pekerjaan Ayah</Label>
                      <Input
                        value={editForm.fatherOccupation || ''}
                        onChange={(e) => setEditForm({ ...editForm, fatherOccupation: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Telepon Ayah</Label>
                      <Input
                        value={editForm.fatherPhone || ''}
                        onChange={(e) => setEditForm({ ...editForm, fatherPhone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email Ayah</Label>
                      <Input
                        type="email"
                        value={editForm.fatherEmail || ''}
                        onChange={(e) => setEditForm({ ...editForm, fatherEmail: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Mother Data */}
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-semibold text-pink-700">Data Ibu</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Nama Ibu</Label>
                      <Input
                        value={editForm.motherName || ''}
                        onChange={(e) => setEditForm({ ...editForm, motherName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Pekerjaan Ibu</Label>
                      <Input
                        value={editForm.motherOccupation || ''}
                        onChange={(e) => setEditForm({ ...editForm, motherOccupation: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Telepon Ibu</Label>
                      <Input
                        value={editForm.motherPhone || ''}
                        onChange={(e) => setEditForm({ ...editForm, motherPhone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email Ibu</Label>
                      <Input
                        type="email"
                        value={editForm.motherEmail || ''}
                        onChange={(e) => setEditForm({ ...editForm, motherEmail: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Address & Occupation */}
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-semibold">Alamat & Pekerjaan</h3>
                  <div>
                    <Label>Alamat Lengkap</Label>
                    <Input
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Pekerjaan Orang Tua</Label>
                    <Input
                      value={editForm.occupation || ''}
                      onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCancel}>
                  Batal
                </Button>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
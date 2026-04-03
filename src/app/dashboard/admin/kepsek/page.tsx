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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Edit,
  Trash2,
  Loader2,
  GraduationCap,
  MapPin,
  Calendar,
  Mail,
  Phone,
  User,
  Camera,
  Upload
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Kepsek {
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

export default function AdminKepsekPage() {
  const [kepsekList, setKepsekList] = useState<Kepsek[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingKepsek, setEditingKepsek] = useState<Kepsek | null>(null)
  const [deletingKepsek, setDeletingKepsek] = useState<Kepsek | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    nuptk: "",
    birthPlace: "",
    birthDate: "",
    gender: "Laki-laki",
    lastEducation: "",
    address: "",
  })

  useEffect(() => {
    fetchKepsekList()
  }, [])

  const fetchKepsekList = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/kepsek')
      const data = await response.json()
      if (data.success) {
        setKepsekList(data.kepsek)
      }
    } catch (error) {
      console.error('Error fetching kepsek list:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data kepala sekolah"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditKepsek = (kepsek: Kepsek) => {
    setEditingKepsek(kepsek)
    setFormData({
      username: kepsek.username,
      password: "",
      name: kepsek.name,
      email: kepsek.email || "",
      phone: kepsek.phone || "",
      nuptk: kepsek.nuptk || "",
      birthPlace: kepsek.birthPlace || "",
      birthDate: kepsek.birthDate || "",
      gender: kepsek.gender || "Laki-laki",
      lastEducation: kepsek.lastEducation || "",
      address: kepsek.address || "",
    })
    setPhotoPreview(kepsek.avatar || "")
    setDialogOpen(true)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteKepsek = (kepsek: Kepsek) => {
    setDeletingKepsek(kepsek)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingKepsek
        ? `/api/admin/kepsek/${editingKepsek.id}`
        : '/api/admin/kepsek'

      const method = editingKepsek ? 'PATCH' : 'POST'

      const submitData = {
        ...formData,
        avatar: photoPreview || undefined
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: editingKepsek ? "Berhasil" : "Berhasil",
          description: editingKepsek ? "Data kepala sekolah diperbarui" : "Kepala sekolah baru ditambahkan"
        })
        setDialogOpen(false)
        fetchKepsekList()
      } else {
        throw new Error(data.error || 'Gagal menyimpan data')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan data"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!deletingKepsek) return

    try {
      const response = await fetch(`/api/admin/kepsek/${deletingKepsek.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Kepala sekolah berhasil dihapus"
        })
        setDeleteDialogOpen(false)
        fetchKepsekList()
      } else {
        throw new Error(data.error || 'Gagal menghapus kepala sekolah')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menghapus kepala sekolah"
      })
    }
  }

  return (
    <DashboardLayout role="admin" userName="Administrator">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pengaturan Data Kepala Sekolah</h1>
            <p className="text-muted-foreground mt-2">
              Kelola data kepala sekolah
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : kepsekList.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              Tidak ada data kepala sekolah
            </CardContent>
          </Card>
        ) : (
          kepsekList.map((kepsek) => (
            <div key={kepsek.id} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Foto Profil */}
                <Card>
                  <CardHeader>
                    <CardTitle>Foto Profil</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed">
                      {kepsek.avatar ? (
                        <img
                          src={kepsek.avatar}
                          alt="Foto profil"
                          className="w-full h-full object-fill"
                        />
                      ) : (
                        <div className="text-center">
                          <User className="h-16 w-16 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">Foto belum ada</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditKepsek(kepsek)}
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
                    <div className="flex justify-between items-center">
                      <CardTitle>Data Pribadi</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditKepsek(kepsek)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Data
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteKepsek(kepsek)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Nama Lengkap</Label>
                        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{kepsek.name || "-"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>NUPTK</Label>
                        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                          <GraduationCap className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{kepsek.nuptk || "-"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tempat Lahir</Label>
                        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{kepsek.birthPlace || "-"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tanggal Lahir</Label>
                        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{kepsek.birthDate ? new Date(kepsek.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Jenis Kelamin</Label>
                        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{kepsek.gender || "-"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Pendidikan Terakhir</Label>
                        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                          <GraduationCap className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{kepsek.lastEducation || "-"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{kepsek.email || "-"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Nomor HP</Label>
                        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{kepsek.phone || "-"}</span>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Alamat</Label>
                        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{kepsek.address || "-"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingKepsek ? "Edit Kepala Sekolah" : "Tambah Kepala Sekolah"}
            </DialogTitle>
            <DialogDescription>
              {editingKepsek ? "Perbarui informasi kepala sekolah" : "Isi form di bawah untuk menambah kepala sekolah baru"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Foto Profil */}
              <div className="space-y-2">
                <Label htmlFor="photo">Foto Profil</Label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-lg bg-muted border-2 border-dashed flex items-center justify-center overflow-hidden flex-shrink-0">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Foto profil"
                        className="w-full h-full object-fill"
                      />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: JPG, PNG. Maksimal 2MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <div className="flex">
                  <User className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    disabled={!!editingKepsek}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password {!editingKepsek && "*"}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingKepsek}
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

              <div className="grid gap-4 md:grid-cols-2">
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
                  <Label htmlFor="phone">No. HP</Label>
                  <div className="flex">
                    <Phone className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="birthPlace">Tempat Lahir</Label>
                  <div className="flex">
                    <MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="birthPlace"
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Tanggal Lahir</Label>
                  <div className="flex">
                    <Calendar className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastEducation">Pendidikan Terakhir</Label>
                  <div className="flex">
                    <GraduationCap className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                    <Input
                      id="lastEducation"
                      value={formData.lastEducation}
                      onChange={(e) => setFormData({ ...formData, lastEducation: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <div className="flex">
                  <MapPin className="h-10 w-10 bg-muted p-2 rounded-l-lg border border-r-0" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingKepsek ? "Simpan Perubahan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kepala Sekolah?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data kepala sekolah "{deletingKepsek?.name}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}

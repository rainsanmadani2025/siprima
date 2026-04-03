'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  User,
  Calendar,
  MapPin,
  Heart,
  Syringe,
  Phone,
  Mail,
  Edit,
  FileText,
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface HealthData {
  golonganDarah: string
  beratBadan: string
  tinggiBadan: string
  alergi: string
  riwayatPenyakit: string
  dokter: string
  rsTercatat: string
}

interface Immunization {
  jenis: string
  tanggal: string
  status: string
}

interface AnakData {
  id: string
  foto: string
  nama: string
  nis: string
  jenisKelamin: string
  tanggalLahir: string
  alamat: string
  kesehatan: HealthData
  imunisasi: Immunization[]
}

interface ParentData {
  id: string
  fatherName: string
  fatherOccupation: string
  fatherPhone: string
  fatherEmail: string
  motherName: string
  motherOccupation: string
  motherPhone: string
  motherEmail: string
}

export default function DataAnakPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [anakData, setAnakData] = useState<AnakData | null>(null)
  const [parentData, setParentData] = useState<ParentData | null>(null)

  const [editData, setEditData] = useState({
    nama: '',
    nis: '',
    jenisKelamin: '',
    tanggalLahir: '',
    alamat: '',
    golonganDarah: '',
    beratBadan: '',
    tinggiBadan: '',
    alergi: '',
    riwayatPenyakit: '',
    dokter: '',
    rsTercatat: '',
    imunisasi: [] as Immunization[],
    // Data Orang Tua
    namaAyah: '',
    pekerjaanAyah: '',
    noHpAyah: '',
    emailAyah: '',
    namaIbu: '',
    pekerjaanIbu: '',
    noHpIbu: '',
    emailIbu: ''
  })

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/parent/children')
      const data = await response.json()

      if (data.children && data.children.length > 0) {
        const child = data.children[0]
        setAnakData({
          id: child.id,
          foto: child.photo || '/avatar-placeholder.png',
          nama: child.name,
          nis: child.nis,
          jenisKelamin: child.gender,
          tanggalLahir: child.birthDate,
          alamat: child.address || '',
          kesehatan: child.healthData || {
            golonganDarah: '-',
            beratBadan: '-',
            tinggiBadan: '-',
            alergi: '-',
            riwayatPenyakit: '-',
            dokter: '-',
            rsTercatat: '-'
          },
          imunisasi: Array.isArray(child.immunization) ? child.immunization : []
        })
      }

      if (data.parent) {
        setParentData(data.parent)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data anak",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEdit = () => {
    if (!anakData || !parentData) return

    // Isi form dengan data yang ada
    setEditData({
      nama: anakData.nama,
      nis: anakData.nis,
      jenisKelamin: anakData.jenisKelamin,
      tanggalLahir: anakData.tanggalLahir,
      alamat: anakData.alamat,
      golonganDarah: anakData.kesehatan.golonganDarah,
      beratBadan: anakData.kesehatan.beratBadan,
      tinggiBadan: anakData.kesehatan.tinggiBadan,
      alergi: anakData.kesehatan.alergi,
      riwayatPenyakit: anakData.kesehatan.riwayatPenyakit,
      dokter: anakData.kesehatan.dokter,
      rsTercatat: anakData.kesehatan.rsTercatat,
      imunisasi: Array.isArray(anakData.imunisasi) ? [...anakData.imunisasi] : [],
      // Data Orang Tua
      namaAyah: parentData.fatherName || '',
      pekerjaanAyah: parentData.fatherOccupation || '',
      noHpAyah: parentData.fatherPhone || '',
      emailAyah: parentData.fatherEmail || '',
      namaIbu: parentData.motherName || '',
      pekerjaanIbu: parentData.motherOccupation || '',
      noHpIbu: parentData.motherPhone || '',
      emailIbu: parentData.motherEmail || ''
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!anakData || !parentData) return

    try {
      setSaving(true)

      // Prepare health data
      const healthData = {
        golonganDarah: editData.golonganDarah,
        beratBadan: editData.beratBadan,
        tinggiBadan: editData.tinggiBadan,
        alergi: editData.alergi,
        riwayatPenyakit: editData.riwayatPenyakit,
        dokter: editData.dokter,
        rsTercatat: editData.rsTercatat
      }

      // Update student data
      const studentResponse = await fetch(`/api/parent/children/${anakData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editData.nama,
          nis: editData.nis,
          birthDate: editData.tanggalLahir,
          gender: editData.jenisKelamin,
          address: editData.alamat,
          healthData,
          immunization: editData.imunisasi
        })
      })

      if (!studentResponse.ok) {
        throw new Error('Gagal menyimpan data anak')
      }

      // Update parent data
      const parentResponse = await fetch('/api/parent/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fatherName: editData.namaAyah,
          fatherOccupation: editData.pekerjaanAyah,
          fatherPhone: editData.noHpAyah,
          fatherEmail: editData.emailAyah,
          motherName: editData.namaIbu,
          motherOccupation: editData.pekerjaanIbu,
          motherPhone: editData.noHpIbu,
          motherEmail: editData.emailIbu
        })
      })

      if (!parentResponse.ok) {
        throw new Error('Gagal menyimpan data orang tua')
      }

      // Update local state
      setAnakData({
        ...anakData,
        nama: editData.nama,
        nis: editData.nis,
        jenisKelamin: editData.jenisKelamin,
        tanggalLahir: editData.tanggalLahir,
        alamat: editData.alamat,
        kesehatan: healthData,
        imunisasi: editData.imunisasi
      })

      setParentData({
        ...parentData,
        fatherName: editData.namaAyah,
        fatherOccupation: editData.pekerjaanAyah,
        fatherPhone: editData.noHpAyah,
        fatherEmail: editData.emailAyah,
        motherName: editData.namaIbu,
        motherOccupation: editData.pekerjaanIbu,
        motherPhone: editData.noHpIbu,
        motherEmail: editData.emailIbu
      })

      setIsEditing(false)
      toast({
        title: "Data Berhasil Disimpan ✅",
        description: "Data anak dan orang tua telah diperbarui di database.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error saving data:', error)
      toast({
        title: "Error",
        description: "Gagal menyimpan data. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddImunisasi = () => {
    setEditData({
      ...editData,
      imunisasi: [...editData.imunisasi, { jenis: '', tanggal: '', status: 'Belum' }]
    })
  }

  const handleRemoveImunisasi = (index: number) => {
    const newImunisasi = editData.imunisasi.filter((_, i) => i !== index)
    setEditData({ ...editData, imunisasi: newImunisasi })
  }

  const handleImunisasiChange = (index: number, field: string, value: string) => {
    const newImunisasi = [...editData.imunisasi]
    newImunisasi[index] = { ...newImunisasi[index], [field]: value }
    setEditData({ ...editData, imunisasi: newImunisasi })
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  if (loading) {
    return (
      <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!anakData || !parentData) {
    return (
      <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
        <div className="flex items-center justify-center min-h-96">
          <p className="text-gray-600">Data anak tidak ditemukan</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Anak Kandung</h1>
          <p className="text-gray-600 mt-1">Informasi lengkap data diri anak Anda</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/ortu')}
            className="mt-4 gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Data
        </Button>
      </div>

      {/* Data Utama Anak */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-emerald-600" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-bold mb-2">{anakData.nama}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  NIS: {anakData.nis}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  {anakData.jenisKelamin}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Tanggal Lahir</p>
                  <p className="text-gray-600">{anakData.tanggalLahir}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Alamat</p>
                  <p className="text-gray-600">{anakData.alamat}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Ayah</p>
                  <p className="text-gray-600">{parentData.fatherName} ({parentData.fatherOccupation})</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {parentData.fatherPhone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Ibu</p>
                  <p className="text-gray-600">{parentData.motherName} ({parentData.motherOccupation})</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {parentData.motherPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Kesehatan */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Data Kesehatan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Golongan Darah</p>
              <p className="text-lg font-bold text-gray-900">{anakData.kesehatan.golonganDarah}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Berat Badan</p>
              <p className="text-lg font-bold text-gray-900">{anakData.kesehatan.beratBadan}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tinggi Badan</p>
              <p className="text-lg font-bold text-gray-900">{anakData.kesehatan.tinggiBadan}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Alergi</p>
              <p className="text-lg font-bold text-gray-900">{anakData.kesehatan.alergi}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Dokter Anak</p>
              <p className="text-base font-semibold text-gray-900">{anakData.kesehatan.dokter}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">RS Tercatat</p>
              <p className="text-base font-semibold text-gray-900">{anakData.kesehatan.rsTercatat}</p>
            </div>
          </div>
          <div className="mt-4 bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="text-sm text-orange-800 font-medium mb-1">Riwayat Penyakit</p>
            <p className="text-gray-700">{anakData.kesehatan.riwayatPenyakit}</p>
          </div>
        </CardContent>
      </Card>

      {/* Data Imunisasi */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Syringe className="w-6 h-6" />
            Data Imunisasi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Jenis Imunisasi</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {anakData.imunisasi.map((vaksin, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{vaksin.jenis}</td>
                    <td className="py-3 px-4 text-gray-600">{vaksin.tanggal}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                        {vaksin.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Edit Data */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Edit className="w-5 h-5" />
              Edit Data Anak & Orang Tua
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Data Pribadi */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                Data Pribadi Anak
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    value={editData.nama}
                    onChange={(e) => setEditData({ ...editData, nama: e.target.value })}
                    placeholder="Masukkan nama lengkap anak"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nis">NIS *</Label>
                  <Input
                    id="nis"
                    value={editData.nis}
                    onChange={(e) => setEditData({ ...editData, nis: e.target.value })}
                    placeholder="Nomor Induk Siswa"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
                  <Select
                    value={editData.jenisKelamin}
                    onValueChange={(value) => setEditData({ ...editData, jenisKelamin: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                  <Input
                    id="tanggalLahir"
                    type="text"
                    value={editData.tanggalLahir}
                    onChange={(e) => setEditData({ ...editData, tanggalLahir: e.target.value })}
                    placeholder="Contoh: 15 Mei 2020"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat Lengkap *</Label>
                <Textarea
                  id="alamat"
                  value={editData.alamat}
                  onChange={(e) => setEditData({ ...editData, alamat: e.target.value })}
                  rows={3}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
            </div>

            {/* Data Kesehatan */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Data Kesehatan
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="golonganDarah">Golongan Darah</Label>
                  <Select
                    value={editData.golonganDarah}
                    onValueChange={(value) => setEditData({ ...editData, golonganDarah: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih golongan darah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="O">O</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beratBadan">Berat Badan</Label>
                  <Input
                    id="beratBadan"
                    value={editData.beratBadan}
                    onChange={(e) => setEditData({ ...editData, beratBadan: e.target.value })}
                    placeholder="Contoh: 18.5 kg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tinggiBadan">Tinggi Badan</Label>
                  <Input
                    id="tinggiBadan"
                    value={editData.tinggiBadan}
                    onChange={(e) => setEditData({ ...editData, tinggiBadan: e.target.value })}
                    placeholder="Contoh: 108 cm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alergi">Alergi</Label>
                  <Input
                    id="alergi"
                    value={editData.alergi}
                    onChange={(e) => setEditData({ ...editData, alergi: e.target.value })}
                    placeholder="Tidak ada atau sebutkan jenis alergi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dokter">Dokter Anak</Label>
                  <Input
                    id="dokter"
                    value={editData.dokter}
                    onChange={(e) => setEditData({ ...editData, dokter: e.target.value })}
                    placeholder="Nama dokter anak"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rsTercatat">RS Tercatat</Label>
                <Input
                  id="rsTercatat"
                  value={editData.rsTercatat}
                  onChange={(e) => setEditData({ ...editData, rsTercatat: e.target.value })}
                  placeholder="Nama rumah sakit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riwayatPenyakit">Riwayat Penyakit</Label>
                <Textarea
                  id="riwayatPenyakit"
                  value={editData.riwayatPenyakit}
                  onChange={(e) => setEditData({ ...editData, riwayatPenyakit: e.target.value })}
                  rows={3}
                  placeholder="Sebutkan penyakit yang pernah diderita"
                />
              </div>
            </div>

            {/* Data Orang Tua */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-500" />
                Data Orang Tua
              </h3>

              <div className="space-y-6">
                {/* Data Ayah */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 border-b pb-2">Data Ayah</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="namaAyah">Nama Ayah *</Label>
                      <Input
                        id="namaAyah"
                        value={editData.namaAyah}
                        onChange={(e) => setEditData({ ...editData, namaAyah: e.target.value })}
                        placeholder="Nama lengkap ayah"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pekerjaanAyah">Pekerjaan Ayah</Label>
                      <Input
                        id="pekerjaanAyah"
                        value={editData.pekerjaanAyah}
                        onChange={(e) => setEditData({ ...editData, pekerjaanAyah: e.target.value })}
                        placeholder="Pekerjaan ayah"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="noHpAyah">No. HP Ayah *</Label>
                      <Input
                        id="noHpAyah"
                        value={editData.noHpAyah}
                        onChange={(e) => setEditData({ ...editData, noHpAyah: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailAyah">Email Ayah</Label>
                      <Input
                        id="emailAyah"
                        type="email"
                        value={editData.emailAyah}
                        onChange={(e) => setEditData({ ...editData, emailAyah: e.target.value })}
                        placeholder="ayah@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Ibu */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 border-b pb-2">Data Ibu</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="namaIbu">Nama Ibu *</Label>
                      <Input
                        id="namaIbu"
                        value={editData.namaIbu}
                        onChange={(e) => setEditData({ ...editData, namaIbu: e.target.value })}
                        placeholder="Nama lengkap ibu"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pekerjaanIbu">Pekerjaan Ibu</Label>
                      <Input
                        id="pekerjaanIbu"
                        value={editData.pekerjaanIbu}
                        onChange={(e) => setEditData({ ...editData, pekerjaanIbu: e.target.value })}
                        placeholder="Pekerjaan ibu"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="noHpIbu">No. HP Ibu *</Label>
                      <Input
                        id="noHpIbu"
                        value={editData.noHpIbu}
                        onChange={(e) => setEditData({ ...editData, noHpIbu: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailIbu">Email Ibu</Label>
                      <Input
                        id="emailIbu"
                        type="email"
                        value={editData.emailIbu}
                        onChange={(e) => setEditData({ ...editData, emailIbu: e.target.value })}
                        placeholder="ibu@email.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Imunisasi */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-cyan-500" />
                  Data Imunisasi
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddImunisasi}>
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </Button>
              </div>

              <div className="space-y-3">
                {editData.imunisasi.map((vaksin, index) => (
                  <div key={index} className="grid md:grid-cols-4 gap-3 p-4 border rounded-lg bg-gray-50">
                    <div className="space-y-2">
                      <Label htmlFor={`jenis-${index}`} className="text-sm">Jenis Imunisasi</Label>
                      <Input
                        id={`jenis-${index}`}
                        value={vaksin.jenis}
                        onChange={(e) => handleImunisasiChange(index, 'jenis', e.target.value)}
                        placeholder="Contoh: BCG"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`tanggal-${index}`} className="text-sm">Tanggal</Label>
                      <Input
                        id={`tanggal-${index}`}
                        value={vaksin.tanggal}
                        onChange={(e) => handleImunisasiChange(index, 'tanggal', e.target.value)}
                        placeholder="Contoh: Januari 2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`status-${index}`} className="text-sm">Status</Label>
                      <Select
                        value={vaksin.status}
                        onValueChange={(value) => handleImunisasiChange(index, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sudah">Sudah</SelectItem>
                          <SelectItem value="Belum">Belum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImunisasi(index)}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {editData.imunisasi.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Belum ada data imunisasi. Klik "Tambah" untuk menambahkan.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  )
}

"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Download, Save, FileDown, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from "next/navigation"

interface RPPData {
  id: string
  tema: string
  subtema: string
  temaProjek: string
  judulKegiatan: string
  pokokBahasan?: string
  fase: string
  kelompokUsia: string
  semester: string
  tahunAjaran: string
  hari?: string
  jumlahPertemuan: string
  kelas?: string
  guru?: string
  namaSekolah: string
  alamatSekolah?: string
  topikKBC?: string
  profilLulusan?: string
  tujuanKBC?: string
  tujuanProfilLulusan?: any
  tujuanPembelajaranMendalam?: string
  materiIntegrasiKBC?: string
  tujuanPembelajaran?: string
  kerangkaPembelajaran?: any
  kegiatanPembelajaran?: any
  rubrikPenilaian?: any
}

interface SchoolProfile {
  name: string
  address: string
}

export default function EditRPPPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const [saving, setSaving] = useState(false)
  const [rppData, setRppData] = useState<RPPData | null>(null)
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null)

  const [formData, setFormData] = useState({
    // A. Identitas Pembelajaran
    fase: "Fase Fondasi",
    kelompokUsia: "Kelompok A (4-5 Tahun)",
    semester: "Ganjil",
    tahunAjaran: "2025/2026",
    hari: "",
    jumlahPertemuan: "8 JP",
    kelas: "",
    guru: "",
    // B. Tema Projek
    tema: "",
    subtema: "",
    temaProjek: "",
    judulKegiatan: "",
    pokokBahasan: "",
    // C. Topik KBC
    topikKBC: "Cinta Diri dan Sesama",
    // D. Profil Lulusan
    profilLulusan: "",
    // E. Tujuan KBC
    tujuanKBC: "",
    // F. Tujuan Profil Lulusan
    tujuanProfilLulusan: {
      Kesehatan: "",
      Kemandirian: "",
      BernalarKritis: "",
      Kreatif: "",
      Berkarakter: "",
      Beriman: "",
      Bertakwa: ""
    },
    // G. Tujuan Pembelajaran Mendalam
    tujuanPembelajaranMendalam: "",
    // H. Materi Integrasi KBC
    materiIntegrasiKBC: "",
    // I. Tujuan Pembelajaran
    tujuanPembelajaran: "",
    // J. Kerangka Pembelajaran
    kerangkaPembelajaran: {
      praktekPedagogik: "",
      lingkunganPembelajaran: {
        fisik: "",
        sosial: "",
        psikologis: "",
        akademik: ""
      },
      kemitraanPembelajaran: "",
      pemanfaatanDigital: ""
    },
    // K. Kegiatan Pembelajaran
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: "",
        penyiapanAlat: "",
        alatBahan: ""
      },
      pelaksanaan: {
        orientasi: "",
        eksplorasi: "",
        diskusi: "",
        kolaborasi: "",
        refleksi: ""
      },
      pembuatanKarya: {
        proses: "",
        hasil: ""
      },
      presentasi: {
        persiapan: "",
        pelaksanaan: ""
      },
      refleksiAkhir: {
        refleksiGuru: "",
        refleksiAnak: ""
      }
    },
    // L. Rubrik Penilaian
    rubrikPenilaian: {}
  })

  useEffect(() => {
    fetchSchoolProfile()
    if (params.id) {
      fetchRPPDetail(params.id as string)
    }
  }, [params.id])

  const fetchSchoolProfile = async () => {
    try {
      const response = await fetch('/api/school/profile')
      const data = await response.json()
      if (data.success) {
        setSchoolProfile(data.school)
      }
    } catch (error) {
      console.error('Error fetching school profile:', error)
    }
  }

  const fetchRPPDetail = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/rpp/detail?id=${id}`)
      const data = await response.json()

      if (data.success) {
        const rpp = data.rpp
        setRppData(rpp)

        // Set form data from RPP
        setFormData({
          fase: rpp.fase || "Fase Fondasi",
          kelompokUsia: rpp.kelompokUsia || "Kelompok A (4-5 Tahun)",
          semester: rpp.semester || "Ganjil",
          tahunAjaran: rpp.tahunAjaran || "2025/2026",
          hari: rpp.hari || "",
          jumlahPertemuan: rpp.jumlahPertemuan || "8 JP",
          kelas: rpp.kelas || "",
          guru: rpp.guru || "",
          tema: rpp.tema || "",
          subtema: rpp.subtema || "",
          temaProjek: rpp.temaProjek || "",
          judulKegiatan: rpp.judulKegiatan || "",
          pokokBahasan: rpp.pokokBahasan || "",
          topikKBC: rpp.topikKBC || "Cinta Diri dan Sesama",
          profilLulusan: rpp.profilLulusan || "",
          tujuanKBC: rpp.tujuanKBC || "",
          tujuanProfilLulusan: rpp.tujuanProfilLulusan || {
            Kesehatan: "",
            Kemandirian: "",
            BernalarKritis: "",
            Kreatif: "",
            Berkarakter: "",
            Beriman: "",
            Bertakwa: ""
          },
          tujuanPembelajaranMendalam: rpp.tujuanPembelajaranMendalam || "",
          materiIntegrasiKBC: rpp.materiIntegrasiKBC || "",
          tujuanPembelajaran: rpp.tujuanPembelajaran || "",
          kerangkaPembelajaran: rpp.kerangkaPembelajaran || {
            praktekPedagogik: "",
            lingkunganPembelajaran: {
              fisik: "",
              sosial: "",
              psikologis: "",
              akademik: ""
            },
            kemitraanPembelajaran: "",
            pemanfaatanDigital: ""
          },
          kegiatanPembelajaran: rpp.kegiatanPembelajaran || {
            persiapan: {
              pemahamanKonsep: "",
              penyiapanAlat: "",
              alatBahan: ""
            },
            pelaksanaan: {
              orientasi: "",
              eksplorasi: "",
              diskusi: "",
              kolaborasi: "",
              refleksi: ""
            },
            pembuatanKarya: {
              proses: "",
              hasil: ""
            },
            presentasi: {
              persiapan: "",
              pelaksanaan: ""
            },
            refleksiAkhir: {
              refleksiGuru: "",
              refleksiAnak: ""
            }
          },
          rubrikPenilaian: rpp.rubrikPenilaian || {}
        })
      } else {
        throw new Error(data.error || 'Gagal mengambil detail RPP')
      }
    } catch (error: any) {
      console.error('Error fetching RPP detail:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengambil detail RPP"
      })
      router.push('/dashboard/guru/perencanaan')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    // Validate required fields
    if (!formData.tema || !formData.subtema || !formData.temaProjek || !formData.judulKegiatan) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Mohon lengkapi field yang diperlukan: Tema, Subtema, Tema Projek, Judul Kegiatan"
      })
      return
    }

    if (!rppData) return

    try {
      setSaving(true)

      // Update RPP ke database
      const response = await fetch(`/api/rpp/update?id=${rppData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          namaSekolah: schoolProfile?.name || "RA INSAN MADANI",
          alamatSekolah: schoolProfile?.address || ""
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "RPP berhasil diupdate"
        })
        router.push('/dashboard/guru/perencanaan')
      } else {
        throw new Error(data.error || 'Gagal mengupdate RPP')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengupdate RPP"
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreviewPDF = async () => {
    try {
      setLoadingPDF(true)

      const response = await fetch('/api/rpp/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          namaSekolah: schoolProfile?.name || "RA INSAN MADANI",
          alamatSekolah: schoolProfile?.address || ""
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal membuat preview PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      window.open(url, '_blank')

      toast({
        title: "Berhasil",
        description: "PDF dibuka di tab baru"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal membuat preview PDF"
      })
    } finally {
      setLoadingPDF(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setLoadingPDF(true)
      const response = await fetch('/api/rpp/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          namaSekolah: schoolProfile?.name || "RA INSAN MADANI",
          alamatSekolah: schoolProfile?.address || ""
        }),
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${formData.tema || 'Edit'}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast({
        title: "Berhasil",
        description: "RPP berhasil diekspor ke PDF"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengekspor RPP ke PDF"
      })
    } finally {
      setLoadingPDF(false)
    }
  }

  const handleExport = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/rpp/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          namaSekolah: schoolProfile?.name || "RA INSAN MADANI",
          alamatSekolah: schoolProfile?.address || ""
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal mengekspor RPP')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${formData.tema || 'Edit'}-${new Date().toISOString().split('T')[0]}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Berhasil",
        description: "RPP berhasil diekspor ke Word"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengekspor RPP"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit RPP KBC</h1>
              <p className="text-muted-foreground mt-1">
                {formData.tema} - {formData.semester} {formData.tahunAjaran}
                {schoolProfile && (
                  <span className="ml-2 text-sm text-primary">• {schoolProfile.name}</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handlePreviewPDF} disabled={loadingPDF} variant="outline" size="sm">
              {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Eye className="mr-2 h-4 w-4" />
              Preview PDF
            </Button>
            <Button onClick={handleUpdate} disabled={saving} variant="outline" size="sm">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Update
            </Button>
            <Button onClick={handleExportPDF} disabled={loadingPDF} variant="outline" size="sm">
              {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={handleExport} disabled={loading} variant="outline" size="sm">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Download className="mr-2 h-4 w-4" />
              Export Word
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit RPP KBC</CardTitle>
            <CardDescription>Ubah dan perbarui data RPP yang sudah ada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tema *</Label>
                  <Input
                    value={formData.tema}
                    onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Subtema *</Label>
                  <Input
                    value={formData.subtema}
                    onChange={(e) => setFormData({ ...formData, subtema: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tema Projek *</Label>
                  <Input
                    value={formData.temaProjek}
                    onChange={(e) => setFormData({ ...formData, temaProjek: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Judul Kegiatan *</Label>
                  <Input
                    value={formData.judulKegiatan}
                    onChange={(e) => setFormData({ ...formData, judulKegiatan: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Pokok Bahasan</Label>
                <Textarea
                  value={formData.pokokBahasan}
                  onChange={(e) => setFormData({ ...formData, pokokBahasan: e.target.value })}
                />
              </div>
              <div>
                <Label>Topik KBC</Label>
                <Textarea
                  value={formData.topikKBC}
                  onChange={(e) => setFormData({ ...formData, topikKBC: e.target.value })}
                />
              </div>
              <div>
                <Label>Profil Lulusan</Label>
                <Textarea
                  value={formData.profilLulusan}
                  onChange={(e) => setFormData({ ...formData, profilLulusan: e.target.value })}
                />
              </div>
              <div>
                <Label>Tujuan KBC</Label>
                <Textarea
                  value={formData.tujuanKBC}
                  onChange={(e) => setFormData({ ...formData, tujuanKBC: e.target.value })}
                />
              </div>
              <div>
                <Label>Tujuan Pembelajaran Mendalam (KD)</Label>
                <Textarea
                  value={formData.tujuanPembelajaranMendalam}
                  onChange={(e) => setFormData({ ...formData, tujuanPembelajaranMendalam: e.target.value })}
                />
              </div>
              <div>
                <Label>Materi Integrasi KBC</Label>
                <Textarea
                  value={formData.materiIntegrasiKBC}
                  onChange={(e) => setFormData({ ...formData, materiIntegrasiKBC: e.target.value })}
                />
              </div>
              <div>
                <Label>Tujuan Pembelajaran</Label>
                <Textarea
                  value={formData.tujuanPembelajaran}
                  onChange={(e) => setFormData({ ...formData, tujuanPembelajaran: e.target.value })}
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-4">Tujuan Profil Lulusan per Kategori</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(formData.tujuanProfilLulusan).map((key) => (
                    <div key={key}>
                      <Label>{key}</Label>
                      <Textarea
                        value={formData.tujuanProfilLulusan[key as keyof typeof formData.tujuanProfilLulusan]}
                        onChange={(e) => setFormData({
                          ...formData,
                          tujuanProfilLulusan: {
                            ...formData.tujuanProfilLulusan,
                            [key]: e.target.value
                          }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-4">Identitas Pembelajaran</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Fase</Label>
                    <Select value={formData.fase} onValueChange={(value) => setFormData({ ...formData, fase: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fase Fondasi">Fase Fondasi</SelectItem>
                        <SelectItem value="Fase A">Fase A</SelectItem>
                        <SelectItem value="Fase B">Fase B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Kelompok Usia</Label>
                    <Select value={formData.kelompokUsia} onValueChange={(value) => setFormData({ ...formData, kelompokUsia: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kelompok A (4-5 Tahun)">Kelompok A (4-5 Tahun)</SelectItem>
                        <SelectItem value="Kelompok B (5-6 Tahun)">Kelompok B (5-6 Tahun)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Semester</Label>
                    <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ganjil">Ganjil</SelectItem>
                        <SelectItem value="Genap">Genap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tahun Ajaran</Label>
                    <Input
                      value={formData.tahunAjaran}
                      onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Hari</Label>
                    <Input
                      value={formData.hari}
                      onChange={(e) => setFormData({ ...formData, hari: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Jumlah Pertemuan</Label>
                    <Input
                      value={formData.jumlahPertemuan}
                      onChange={(e) => setFormData({ ...formData, jumlahPertemuan: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Kelas</Label>
                    <Input
                      value={formData.kelas}
                      onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Guru</Label>
                    <Input
                      value={formData.guru}
                      onChange={(e) => setFormData({ ...formData, guru: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

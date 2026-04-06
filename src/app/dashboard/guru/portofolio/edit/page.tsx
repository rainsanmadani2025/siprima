'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface Student {
  id: string
  name: string
  nis: string
}

interface Portfolio {
  id: string
  studentId: string
  title: string
  type: string
  description?: string | null
  fileUrl?: string | null
  videoUrl?: string | null
  date: string
}

export default function EditPortofolioPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const portfolioId = searchParams.get('id')
  const { toast } = useToast()
  
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [studentsLoading, setStudentsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    type: 'karya',
    description: '',
    fileUrl: '',
    videoUrl: '',
    date: new Date().toISOString().split('T')[0]
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (portfolioId) {
      fetchPortfolio()
    } else {
      toast({
        title: "Error",
        description: "ID portfolio tidak ditemukan",
        variant: "destructive"
      })
      router.push('/dashboard/guru/portofolio')
    }
  }, [portfolioId])

  const fetchPortfolio = async () => {
    try {
      setFetching(true)
      const response = await fetch(`/api/portfolios/${portfolioId}`)
      const data = await response.json()
      
      if (data.success && data.portfolio) {
        const portfolio = data.portfolio
        setFormData({
          studentId: portfolio.studentId,
          title: portfolio.title,
          type: portfolio.type,
          description: portfolio.description || '',
          fileUrl: portfolio.fileUrl || '',
          videoUrl: portfolio.videoUrl || '',
          date: portfolio.date ? portfolio.date.split('T')[0] : new Date().toISOString().split('T')[0]
        })
      } else {
        throw new Error(data.error || 'Gagal mengambil data portfolio')
      }
    } catch (error: any) {
      console.error('Error fetching portfolio:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal mengambil data portfolio",
        variant: "destructive"
      })
      router.push('/dashboard/guru/portofolio')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true)
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.warn('[Edit Portfolio] No userId found')
        return
      }

      const response = await fetch(`/api/guru/students-list?userId=${userId}`)
      const data = await response.json()
      if (data.success && data.students) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setStudentsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "Ukuran file terlalu besar. Maksimal 5MB",
        variant: "destructive"
      })
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/portfolios/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({ ...prev, fileUrl: data.fileUrl }))
        toast({
          title: "Berhasil",
          description: "File berhasil diupload"
        })
      } else {
        throw new Error(data.error || 'Gagal mengupload file')
      }
    } catch (error: any) {
      console.error('Error uploading file:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal mengupload file",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFormData(prev => ({ ...prev, fileUrl: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!portfolioId) {
      toast({
        title: "Error",
        description: "ID portfolio tidak ditemukan",
        variant: "destructive"
      })
      return
    }

    if (!formData.studentId || !formData.title || !formData.type) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: formData.studentId,
          title: formData.title,
          type: formData.type,
          description: formData.description,
          fileUrl: formData.fileUrl,
          videoUrl: formData.videoUrl,
          date: formData.date
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Portofolio berhasil diperbarui"
        })
        router.push('/dashboard/guru/portofolio')
      } else {
        throw new Error(data.error || 'Gagal memperbarui portofolio')
      }
    } catch (error: any) {
      console.error('Error updating portfolio:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui portofolio",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <div className="flex items-center justify-center min-h-[600px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Portofolio</h1>
            <p className="text-muted-foreground mt-2">
              Perbarui karya atau dokumentasi kegiatan siswa
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form Portofolio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pilih Siswa */}
              <div className="space-y-2">
                <Label htmlFor="student">Siswa *</Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                  disabled={studentsLoading}
                >
                  <SelectTrigger id="student">
                    {studentsLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memuat...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Pilih Siswa" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.nis})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Judul */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul portofolio"
                  required
                />
              </div>

              {/* Tipe */}
              <div className="space-y-2">
                <Label htmlFor="type">Tipe Portofolio *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Pilih Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karya">Hasil Karya</SelectItem>
                    <SelectItem value="foto">Foto Kegiatan</SelectItem>
                    <SelectItem value="video">Video Kegiatan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan tentang portofolio ini..."
                  rows={4}
                />
              </div>

              {/* Tanggal */}
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              {/* File Upload / URL */}
              <div className="space-y-2">
                <Label htmlFor="file">Upload File/Gambar</Label>
                {!formData.fileUrl ? (
                  <div className="space-y-2">
                    {!selectedFile ? (
                      <div>
                        <Input
                          id="file"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleFileSelect}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Format: JPEG, PNG, GIF, WebP (Maksimal 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleUpload}
                          disabled={uploading}
                          className="flex-1"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Mengupload...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload {selectedFile.name}
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleRemoveFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 border rounded-md">
                      <img
                        src={formData.fileUrl}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-md"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Ganti Gambar
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>atau masukkan URL:</span>
                </div>
                <Input
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL Video (Opsional)</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan URL video (YouTube, dll) untuk tipe Video Kegiatan
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
